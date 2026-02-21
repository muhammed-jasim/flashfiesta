import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Box, Typography, Grid, Paper, TextField, Button,
  IconButton, List, ListItem, ListItemIcon,
  ListItemText, CircularProgress, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, MenuItem, Select,
  Avatar, Badge, Popover, Checkbox, FormControlLabel, Modal,
  Divider
} from '@mui/material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, Plus, Bell, Package, TrendingUp, DollarSign,
  Activity, BarChart3, Image as ImageIcon, FileText,
  AlertCircle, CheckCircle, Clock, Grid as GridIcon, X, Eye
} from 'lucide-react';
import axios from '../axiosInstance';
import {
  CreteProduct, DashboardStatsApi, GetAllOrdersApi,
  UpdateOrderStatusApi, ProductDeatailsApi, CategoriesApi,
  CreateCategoryApi, OrderDetailApi
} from '../Api';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../NotificationContext';

const AdminWrapper = styled(Box)`
  display: flex;
  min-height: 100vh;
  background-color: #F9FAFB;
`;

const Sidebar = styled(Box)`
  width: 280px;
  background: white;
  border-right: 1px solid #E5E7EB;
  padding: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
`;

const NavItem = styled(ListItem)`
  border-radius: 12px;
  margin-bottom: 4px;
  color: ${props => props.active ? '#12B76A' : '#6B7280'};
  background: ${props => props.active ? '#F0FDF4' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    color: #12B76A;
  }
`;

const StatCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  box-shadow: none;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 24;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ImageGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const SubHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Admin = () => {
  const showNotification = useNotification();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role');
  const isOwner = userRole === 'OWNER';
  const isEmployee = userRole === 'EMPLOYEE';

  // Set initial tab based on role permissions
  const [activeNav, setActiveNav] = useState(isOwner ? 'dashboard' : 'products');

  useEffect(() => {
    if (!isOwner && !isEmployee) {
      navigate('/dashboard');
      showNotification("You do not have permission to access the admin panel.", "error");
    }
    fetchData();
  }, [navigate]);

  const [stats, setStats] = useState(null);
  // ... rest of state ...
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const [State, setState] = useState({
    ProductName: '',
    Description: '',
    ProductImage: null,
    GalleryImages: [],
    Qty: 0,
    ProductPrice: 0,
    category: '',
    is_trending: false,
    ImagePreview: null,
    GalleryPreviews: []
  });

  const [catState, setCatState] = useState({
    name: '',
    image: null,
    preview: null
  });

  useEffect(() => {
    fetchData();
  }, [activeNav]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeNav === 'dashboard' || activeNav === 'reports') {
        const response = await axios.get(DashboardStatsApi);
        if (response.data.Status === 6000) setStats(response.data.data);
      }
      if (activeNav === 'orders') {
        const response = await axios.get(GetAllOrdersApi);
        if (response.data.Status === 6000) setOrders(response.data.data);
      }
      if (activeNav === 'products' || activeNav === 'dashboard') {
        const response = await axios.get(ProductDeatailsApi);
        if (response.data.Status === 6000) setProductsList(response.data.data);

        const catRes = await axios.get(CategoriesApi);
        if (catRes.data.Status === 6000) setCategories(catRes.data.data);
      }
      if (activeNav === 'categories') {
        const response = await axios.get(CategoriesApi);
        if (response.data.Status === 6000) setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setState(prev => ({
        ...prev,
        ProductImage: file,
        ImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setState(prev => ({
        ...prev,
        GalleryImages: [...prev.GalleryImages, ...files],
        GalleryPreviews: [...prev.GalleryPreviews, ...files.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  const removeGalleryImage = (index) => {
    setState(prev => ({
      ...prev,
      GalleryImages: prev.GalleryImages.filter((_, i) => i !== index),
      GalleryPreviews: prev.GalleryPreviews.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOrderClick = async (orderId) => {
    try {
      const response = await axios.get(OrderDetailApi(orderId));
      if (response.data.Status === 6000) {
        setSelectedOrder(response.data.data);
        setOrderModalOpen(true);
      }
    } catch (error) {
      showNotification("Failed to fetch order details", "error");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(UpdateOrderStatusApi(orderId), { status: newStatus });
      if (response.data.Status === 6000) {
        showNotification("Status updated successfully", "success");
        fetchData();
        if (selectedOrder && selectedOrder.id === orderId) {
          handleOrderClick(orderId);
        }
      }
    } catch (error) {
      showNotification("Failed to update status", "error");
    }
  };

  const AddProduct = async () => {
    if (!State.ProductName || !State.ProductImage) {
      showNotification("Please provide product name and image", "error");
      return;
    }

    const formData = new FormData();
    formData.append('ProductName', State.ProductName);
    formData.append('Description', State.Description);
    formData.append('ProductImage', State.ProductImage);
    formData.append('Qty', State.Qty);
    formData.append('Rate', State.ProductPrice);
    formData.append('category', State.category);
    formData.append('is_trending', State.is_trending);

    State.GalleryImages.forEach((img) => {
      formData.append('gallery_images', img);
    });

    try {
      const response = await axios.post(CreteProduct, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.Status === 6000) {
        showNotification("Product added successfully!", "success");
        setState({
          ProductName: '', Description: '', ProductImage: null,
          GalleryImages: [], Qty: 0, ProductPrice: 0,
          category: '', is_trending: false,
          ImagePreview: null, GalleryPreviews: []
        });
        fetchData();
      }
    } catch (error) {
      showNotification("Failed to add product.", "error");
    }
  };

  const AddCategory = async () => {
    if (!catState.name) return;
    const formData = new FormData();
    formData.append('name', catState.name);
    if (catState.image) formData.append('image', catState.image);

    try {
      const response = await axios.post(CreateCategoryApi, formData);
      if (response.data.Status === 6000) {
        showNotification("Category created", "success");
        setCatState({ name: '', image: null, preview: null });
        fetchData();
      }
    } catch (error) {
      showNotification("Failed to add category", "error");
    }
  };

  const notifications = [
    { id: 1, title: 'Low Inventory', desc: '5 products are below 10 units', icon: <AlertCircle size={16} color="#F43F5E" />, time: '2m ago' },
    { id: 2, title: 'New Order', desc: 'Order #8241 was just placed', icon: <CheckCircle size={16} color="#12B76A" />, time: '15m ago' },
    { id: 3, title: 'System Batch', desc: 'Scheduled flash price update', icon: <Clock size={16} color="#3B82F6" />, time: '1h ago' },
  ];

  const renderDashboard = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Orders', val: stats?.total_orders || 0, icon: <ShoppingBag color="#12B76A" />, up: '12%', color: '#F0FDF4' },
          { label: 'Live Traffic', val: '856', icon: <TrendingUp color="#3B82F6" />, up: '28%', color: '#EFF6FF' },
          { label: 'Total Revenue', val: `$${stats?.total_revenue?.toLocaleString() || 0}`, icon: <DollarSign color="#8B5CF6" />, up: '5%', color: '#F5F3FF' },
          { label: 'Total Products', val: stats?.total_products || 0, icon: <Activity color="#F59E0B" />, up: '0%', color: '#FFFBEB' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ p: 1.5, backgroundColor: stat.color, borderRadius: '12px' }}>{stat.icon}</Box>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>+{stat.up}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>{stat.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.val}</Typography>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <StatCard sx={{ height: 450 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Revenue Velocity</Typography>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={stats?.recent_sales || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12B76A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#12B76A" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <StatCard>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Quick Product</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth size="small" label="Product Name" name="ProductName" value={State.ProductName} onChange={handleChange} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth select size="small" label="Category" name="category" value={State.category} onChange={handleChange}>
                  {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </TextField>
                <FormControlLabel control={<Checkbox name="is_trending" checked={State.is_trending} onChange={handleChange} />} label="Trending" />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" type="number" label="Price" name="ProductPrice" value={State.ProductPrice} onChange={handleChange} />
                <TextField fullWidth size="small" type="number" label="Qty" name="Qty" value={State.Qty} onChange={handleChange} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component="label" variant="outlined" startIcon={<ImageIcon size={18} />} sx={{ flex: 1, borderRadius: '12px', borderStyle: 'dashed' }}>
                  Cover
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                <Button component="label" variant="outlined" startIcon={<Plus size={18} />} sx={{ flex: 1, borderRadius: '12px', borderStyle: 'dashed' }}>
                  Gallery
                  <input type="file" hidden accept="image/*" multiple onChange={handleGalleryChange} />
                </Button>
              </Box>

              {(State.ImagePreview || State.GalleryPreviews.length > 0) && (
                <ImageGrid>
                  {State.ImagePreview && (
                    <Box sx={{ width: 60, height: 60, borderRadius: '8px', overflow: 'hidden', border: '2px solid #12B76A', position: 'relative' }}>
                      <img src={State.ImagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  )}
                  {State.GalleryPreviews.map((url, i) => (
                    <Box key={i} sx={{ width: 60, height: 60, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', position: 'relative' }}>
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small"
                        onClick={() => removeGalleryImage(i)}
                        sx={{ position: 'absolute', top: 0, right: 0, p: 0.2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                      >
                        <X size={12} />
                      </IconButton>
                    </Box>
                  ))}
                </ImageGrid>
              )}

              <Button variant="contained" fullWidth onClick={AddProduct} sx={{ bgcolor: '#111827', borderRadius: '12px', py: 1.5 }}>
                Create Product
              </Button>
            </Box>
          </StatCard>
        </Grid>
      </Grid>
    </>
  );

  const renderOrders = () => (
    <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.id)}>
              <TableCell sx={{ fontWeight: 600 }}>#{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.full_name}</Typography>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>{order.city}</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>${order.total_amount?.toFixed(2)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip label={order.status} size="small" sx={{ fontWeight: 700, bgcolor: order.status === 'Delivered' ? '#F0FDF4' : '#FFFBEB', color: order.status === 'Delivered' ? '#15803D' : '#B45309' }} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" color="primary"><Eye size={18} /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderProducts = () => (
    <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Badges</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell><Avatar variant="rounded" src={p.ProductImage} sx={{ width: 48, height: 48 }} /></TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.ProductName}</Typography>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>ID: {p.id.slice(0, 8)}</Typography>
              </TableCell>
              <TableCell>{p.category_details?.name || 'Uncategorized'}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>${p.Rate}</TableCell>
              <TableCell>{p.Qty} units</TableCell>
              <TableCell>
                {p.is_trending && <Chip label="Trending" size="small" color="primary" sx={{ mr: 1, fontWeight: 700 }} />}
                <Chip label={p.Qty > 0 ? 'In Stock' : 'Out'} size="small" color={p.Qty > 0 ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCategories = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Add Category</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Category Name" value={catState.name} onChange={(e) => setCatState({ ...catState, name: e.target.value })} />
            <Button component="label" variant="outlined" startIcon={<ImageIcon size={18} />} sx={{ borderRadius: '12px' }}>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={(e) => setCatState({ ...catState, image: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })} />
            </Button>
            {catState.preview && <Avatar src={catState.preview} variant="rounded" sx={{ width: '100%', height: 120 }} />}
            <Button variant="contained" fullWidth onClick={AddCategory} sx={{ bgcolor: '#12B76A' }}>Create Category</Button>
          </Box>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={8}>
        <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}><TableRow><TableCell>Image</TableCell><TableCell>Name</TableCell><TableCell>Products</TableCell></TableRow></TableHead>
            <TableBody>
              {categories.map(c => (
                <TableRow key={c.id}>
                  <TableCell><Avatar src={c.image} variant="rounded" /></TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                  <TableCell>Click to View</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );

  const renderReports = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StatCard sx={{ height: 400 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Sales Performance</Typography>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={stats?.recent_sales || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="sales" fill="#12B76A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <StatCard sx={{ height: 400 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Order Distribution</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Delivered', val: 65, color: '#12B76A' },
              { label: 'Pending', val: 20, color: '#F59E0B' },
              { label: 'Processing', val: 15, color: '#3B82F6' },
            ].map(item => (
              <Box key={item.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>{item.val}%</Typography>
                </Box>
                <Box sx={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 4 }}>
                  <Box sx={{ height: '100%', width: `${item.val}%`, backgroundColor: item.color, borderRadius: 4 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </StatCard>
      </Grid>
    </Grid>
  );

  return (
    <AdminWrapper>
      <Sidebar sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 6, color: '#12B76A', tracking: '1px' }}>FLASH FIERRO</Typography>

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, mb: 2, display: 'block' }}>MENU</Typography>
        <List sx={{ mb: 4 }}>
          {isOwner && (
            <>
              <NavItem active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')}>
                <ListItemIcon><LayoutDashboard size={20} color={activeNav === 'dashboard' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </NavItem>
              <NavItem active={activeNav === 'orders'} onClick={() => setActiveNav('orders')}>
                <ListItemIcon><Package size={20} color={activeNav === 'orders' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
                <ListItemText primary="Orders" />
              </NavItem>
            </>
          )}
          <NavItem active={activeNav === 'products'} onClick={() => setActiveNav('products')}>
            <ListItemIcon><ShoppingBag size={20} color={activeNav === 'products' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Products" />
          </NavItem>
          <NavItem active={activeNav === 'categories'} onClick={() => setActiveNav('categories')}>
            <ListItemIcon><GridIcon size={20} color={activeNav === 'categories' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Categories" />
          </NavItem>
        </List>

        {isOwner && (
          <>
            <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, mb: 2, display: 'block' }}>INSIGHTS</Typography>
            <List>
              <NavItem active={activeNav === 'reports'} onClick={() => setActiveNav('reports')}>
                <ListItemIcon><BarChart3 size={20} color={activeNav === 'reports' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
                <ListItemText primary="Reports" />
              </NavItem>
            </List>
          </>
        )}
      </Sidebar>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <SubHeader>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</Typography>
              <Chip label={userRole} color={isOwner ? "success" : "primary"} size="small" sx={{ fontWeight: 900, borderRadius: '6px' }} />
            </Box>
            <Typography color="text.secondary">Store management made simple.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ bgcolor: 'white', border: '1px solid #E5E7EB' }}>
              <Badge badgeContent={3} color="error"><Bell size={20} /></Badge>
            </IconButton>
            <Button variant="contained" startIcon={<Plus size={18} />} sx={{ bgcolor: '#12B76A', borderRadius: '12px', px: 3 }}>Quick Add</Button>
          </Box>
        </SubHeader>

        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
          <>
            {activeNav === 'dashboard' && renderDashboard()}
            {activeNav === 'orders' && renderOrders()}
            {activeNav === 'products' && renderProducts()}
            {activeNav === 'categories' && renderCategories()}
            {activeNav === 'reports' && renderReports()}
          </>
        )}

        <Modal open={orderModalOpen} onClose={() => setOrderModalOpen(false)}>
          <ModalBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Order Details #{selectedOrder?.id.slice(0, 8)}</Typography>
              <IconButton onClick={() => setOrderModalOpen(false)}><X /></IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Customer Info</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>{selectedOrder?.full_name}</Typography>
                <Typography variant="body2">{selectedOrder?.address}, {selectedOrder?.city}</Typography>
                <Typography variant="body2">Zip: {selectedOrder?.zip_code}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Order Status</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={selectedOrder?.status || ''}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  sx={{ mt: 1, borderRadius: '12px' }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>Order Items</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>Product</TableCell><TableCell align="right">Qty</TableCell><TableCell align="right">Price</TableCell></TableRow></TableHead>
                <TableBody>
                  {selectedOrder?.items?.map(item => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{item.product_name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 800, pt: 2 }}>Grand Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, pt: 2, fontSize: '1.1rem' }}>${selectedOrder?.total_amount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button variant="contained" fullWidth onClick={() => setOrderModalOpen(false)} sx={{ mt: 4, bgcolor: '#111827', borderRadius: '12px' }}>Close</Button>
          </ModalBox>
        </Modal>

        <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Notifications</Typography>
            {notifications.map(n => (
              <Box key={n.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ mt: 0.5 }}>{n.icon}</Box>
                <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{n.title}</Typography><Typography variant="caption" color="text.secondary">{n.desc}</Typography></Box>
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
    </AdminWrapper>
  );
};

export default Admin;