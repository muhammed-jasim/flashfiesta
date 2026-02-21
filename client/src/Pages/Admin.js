import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Box, Typography, Grid, Paper, TextField, Button,
  IconButton, Card, Divider, List, ListItem, ListItemIcon,
  ListItemText, Badge, Container, Tab, Tabs
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, Users, Activity,
  BarChart3, Settings, Plus, FileText, Search,
  Bell, CheckCircle, Package, TrendingUp, DollarSign
} from 'lucide-react';
import axios from '../axiosInstance';
import { CreteProduct } from '../Api';
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
`;

const NavItem = styled(ListItem)`
  border-radius: 12px;
  margin-bottom: 4px;
  color: ${props => props.active ? '#12B76A' : '#6B7280'};
  background: ${props => props.active ? '#F0FDF4' : 'transparent'};
  
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
`;

const Admin = () => {
  const showNotification = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [activeNav, setActiveNav] = useState('dashboard');

  const [State, setState] = useState({
    ProductName: '',
    Description: '',
    ProductImage: '',
    Qty: 0,
    ProductPrice: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setState({ ProductName: '', Description: '', ProductImage: '', Qty: 0, ProductPrice: 0 });
  };

  const AddProduct = async () => {
    try {
      const response = await axios.post(CreteProduct, {
        ProductName: State.ProductName,
        Description: State.Description,
        ProductImage: State.ProductImage,
        Qty: State.Qty,
        Rate: State.ProductPrice
      });
      if (response.data.Status === 6000) {
        showNotification("Product added successfully!", "success");
        handleClear();
      } else {
        showNotification("Error: " + response.data.data, "error");
      }
    } catch (error) {
      showNotification("Failed to add product.", "error");
    }
  };

  const chartData = [
    { name: 'Mon', sales: 4000, revenue: 2400 },
    { name: 'Tue', sales: 3000, revenue: 1398 },
    { name: 'Wed', sales: 2000, revenue: 9800 },
    { name: 'Thu', sales: 2780, revenue: 3908 },
    { name: 'Fri', sales: 1890, revenue: 4800 },
    { name: 'Sat', sales: 2390, revenue: 3800 },
    { name: 'Sun', sales: 3490, revenue: 4300 },
  ];

  return (
    <AdminWrapper>
      <Sidebar sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Flash Admin</Typography>
        </Box>

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, mb: 2, display: 'block' }}>MAIN MENU</Typography>
        <List sx={{ mb: 4 }}>
          <NavItem button active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')}>
            <ListItemIcon><LayoutDashboard size={20} color={activeNav === 'dashboard' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
          <NavItem button active={activeNav === 'products'} onClick={() => setActiveNav('products')}>
            <ListItemIcon><ShoppingBag size={20} color={activeNav === 'products' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Products" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
          <NavItem button active={activeNav === 'orders'} onClick={() => setActiveNav('orders')}>
            <ListItemIcon><Package size={20} color={activeNav === 'orders' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Orders" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
          <NavItem button active={activeNav === 'users'} onClick={() => setActiveNav('users')}>
            <ListItemIcon><Users size={20} color={activeNav === 'users' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Users" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
        </List>

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, mb: 2, display: 'block' }}>ANALYTICS</Typography>
        <List>
          <NavItem button active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')}>
            <ListItemIcon><BarChart3 size={20} color={activeNav === 'analytics' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Performance" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
          <NavItem button active={activeNav === 'reports'} onClick={() => setActiveNav('reports')}>
            <ListItemIcon><FileText size={20} color={activeNav === 'reports' ? '#12B76A' : '#6B7280'} /></ListItemIcon>
            <ListItemText primary="Reports" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
          </NavItem>
        </List>
      </Sidebar>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Header>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Welcome back, Admin 👋</Typography>
            <Typography sx={{ color: '#6B7280' }}>Here's what's happening with Flash Fiesta today.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
              <Bell size={20} />
            </IconButton>
            <Button variant="contained" startIcon={<Plus />} sx={{
              backgroundColor: '#12B76A',
              '&:hover': { backgroundColor: '#0E9F5E' },
              borderRadius: '12px',
              textTransform: 'none',
              px: 3
            }}>
              Quick Add
            </Button>
          </Box>
        </Header>

        {activeNav === 'dashboard' && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Sales', val: '1,482', icon: <ShoppingBag color="#12B76A" />, up: '12%', color: '#F0FDF4' },
                { label: 'Live Traffic', val: '856', icon: <TrendingUp color="#3B82F6" />, up: '28%', color: '#EFF6FF' },
                { label: 'Total Revenue', val: '$142,500', icon: <DollarSign color="#8B5CF6" />, up: '5%', color: '#F5F3FF' },
                { label: 'Active Deals', val: '12', icon: <Activity color="#F59E0B" />, up: '0%', color: '#FFFBEB' },
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
              <Grid item xs={12} md={8}>
                <StatCard sx={{ height: 400 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Revenue Velocity</Typography>
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={chartData}>
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
              <Grid item xs={12} md={4}>
                <StatCard sx={{ height: 400 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Add New Product</Typography>
                  <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField fullWidth size="small" label="Product Name" name="ProductName" value={State.ProductName} onChange={handleChange} variant="outlined" />
                    <TextField fullWidth size="small" label="Description" name="Description" value={State.Description} onChange={handleChange} />
                    <TextField fullWidth size="small" type="number" label="Price" name="ProductPrice" value={State.ProductPrice} onChange={handleChange} />
                    <TextField fullWidth size="small" type="number" label="Quantity" name="Qty" value={State.Qty} onChange={handleChange} />
                    <Button variant="contained" fullWidth onClick={AddProduct} sx={{ mt: 2, backgroundColor: '#111827', borderRadius: '10px', py: 1.5, textTransform: 'none', fontWeight: 600 }}>
                      Create Product
                    </Button>
                  </Box>
                </StatCard>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </AdminWrapper>
  );
};

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

export default Admin;