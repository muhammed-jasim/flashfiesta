import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, Paper, Grid, Chip, CircularProgress, Button, Modal, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material";
import { Package, Clock, ChevronRight, X, Download, Printer } from "lucide-react";
import styled from "styled-components";
import Navigation from "../Components/Navigation";
import axios from "../axiosInstance";
import { MyOrdersApi } from "../Api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EinvoiceTemplate from './Printtemplate';

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

const ModalContent = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 32px;
  outline: none;
`;


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const componentRef = useRef();

    const handleDownloadPDF = async () => {
        if (!selectedOrder) return;
        setIsDownloading(true);
        try {
            const element = componentRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#FFFFFF',
                windowWidth: 1200 // Ensure consistent width for capture
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`FlashFiesta_Invoice_${selectedOrder.id.slice(0, 8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

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

    const handleOpenDetails = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

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
                                    <Typography sx={{ fontWeight: 700, mb: 2 }}>#{order.id.slice(0, 8).toUpperCase()}</Typography>
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
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>${parseFloat(order.total_amount).toFixed(2)}</Typography>
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
                                        onClick={() => handleOpenDetails(order)}
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

            {/* Order Detail Modal */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <ModalContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Order Summary</Typography>
                        <IconButton onClick={handleCloseModal}><X /></IconButton>
                    </Box>

                    {selectedOrder && (
                        <Box>
                            <Grid container spacing={4} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Shipping Address</Typography>
                                    <Typography sx={{ fontWeight: 700, mt: 1 }}>{selectedOrder.full_name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                        {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.zip_code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Status</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <StatusChip
                                            label={selectedOrder.status}
                                            sx={{
                                                backgroundColor: getStatusColor(selectedOrder.status).bg,
                                                color: getStatusColor(selectedOrder.status).color
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: 'none', mb: 4 }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ fontWeight: 600 }}>{item.product_name}</TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>
                                                <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Total Paid</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#12B76A' }}>${parseFloat(selectedOrder.total_amount).toFixed(2)}</Typography>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <Download size={20} />}
                                    onClick={handleDownloadPDF}
                                    disabled={isDownloading}
                                    sx={{ bgcolor: '#111827', borderRadius: '12px', py: 1.5, fontWeight: 700 }}
                                >
                                    {isDownloading ? 'Generating PDF...' : 'Download Invoice'}
                                </Button>
                            </Box>

                            {/* Hidden Print Template - Off-screen but captureable */}
                            <div style={{ position: 'fixed', top: '-10000%', left: '-10000%', width: '1200px' }}>
                                <EinvoiceTemplate ref={componentRef} order={selectedOrder} />
                            </div>
                        </Box>
                    )}
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Orders;
