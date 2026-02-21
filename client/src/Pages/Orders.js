import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Grid, Chip, CircularProgress, Button } from "@mui/material";
import { Package, Clock, ChevronRight } from "lucide-react";
import styled from "styled-components";
import Navigation from "../Components/Navigation";
import axios from "../axiosInstance";
import { MyOrdersApi } from "../Api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const OrderCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  box-shadow: none;
  margin-bottom: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #12B76A;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  }
`;

const StatusChip = styled(Chip)`
  font-weight: 700;
  border-radius: 8px;
  text-transform: uppercase;
  font-size: 11px;
`;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(MyOrdersApi);
                if (response.data.Status === 6000) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return { bg: '#FFFBEB', color: '#B45309' };
            case 'shipped': return { bg: '#EFF6FF', color: '#1D4ED8' };
            case 'delivered': return { bg: '#F0FDF4', color: '#15803D' };
            default: return { bg: '#F3F4F6', color: '#4B5563' };
        }
    };

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Navigation />
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>My Orders</Typography>
                    <Typography sx={{ color: '#6B7280' }}>Track and manage your limited flash purchases.</Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress color="success" />
                    </Box>
                ) : orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderCard key={order.id}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>Order ID</Typography>
                                    <Typography sx={{ fontWeight: 700, mb: 2 }}>#{order.id.slice(0, 8)}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Clock size={14} color="#6B7280" />
                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>Items</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ fontWeight: 500, color: '#4B5563' }}>
                                                {item.quantity}x {item.product_name}
                                            </Typography>
                                        ))}
                                        {order.items.length > 2 && (
                                            <Typography variant="caption" sx={{ color: '#12B76A', fontWeight: 700 }}>
                                                + {order.items.length - 2} more items
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>Total</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>${order.total_amount.toFixed(2)}</Typography>
                                </Grid>

                                <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { md: 'flex-end' }, gap: 2 }}>
                                    <StatusChip
                                        label={order.status}
                                        sx={{
                                            backgroundColor: getStatusColor(order.status).bg,
                                            color: getStatusColor(order.status).color
                                        }}
                                    />
                                    <Button
                                        variant="text"
                                        endIcon={<ChevronRight size={18} />}
                                        sx={{ textTransform: 'none', fontWeight: 700, color: '#12B76A', '&:hover': { backgroundColor: '#F0FDF4' } }}
                                    >
                                        Order Details
                                    </Button>
                                </Grid>
                            </Grid>
                        </OrderCard>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', py: 12 }}>
                        <Box sx={{ width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                            <Package size={40} color="#9CA3AF" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No orders yet</Typography>
                        <Typography sx={{ color: '#6B7280', mb: 4 }}>You haven't placed any flash orders yet.</Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/dashboard')}
                            sx={{ backgroundColor: '#111827', borderRadius: '12px', px: 4, py: 1.5, textTransform: 'none', fontWeight: 700 }}
                        >
                            Start Shopping
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Orders;
