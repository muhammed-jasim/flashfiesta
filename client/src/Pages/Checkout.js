import React, { useState } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Typography, Button, Paper, Grid, TextField, Divider, RadioGroup, FormControlLabel, Radio, Avatar } from '@mui/material';
import { ChevronRight, ChevronLeft, CreditCard, Truck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import styled from 'styled-components';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutItem = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            // Final step: order success
            clearCart();
            setActiveStep(activeStep + 1);
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderShipping = () => (
        <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Shipping Address</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" variant="outlined" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" variant="outlined" /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Address" variant="outlined" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="City" variant="outlined" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="ZIP Code" variant="outlined" /></Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <Paper sx={{ p: 4, borderRadius: '24px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', boxShadow: 'none' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Summary</Typography>
                    {cart.map(item => (
                        <CheckoutItem key={item.ProductID}>
                            <Avatar src={item.ProductImage} variant="rounded" />
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.ProductName}</Typography>
                                <Typography variant="caption" sx={{ color: '#6B7280' }}>Qty: {item.quantity}</Typography>
                            </Box>
                        </CheckoutItem>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="body2">Shipping</Typography>
                        <Typography variant="body2" sx={{ color: '#12B76A', fontWeight: 800 }}>FREE</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>${cartTotal.toFixed(2)}</Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );

    const renderPayment = () => (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Payment Method</Typography>
            <RadioGroup defaultValue="card">
                <Paper sx={{ p: 3, mb: 2, borderRadius: '16px', border: '1.5px solid #12B76A' }}>
                    <FormControlLabel value="card" control={<Radio sx={{ color: '#12B76A', '&.Mui-checked': { color: '#12B76A' } }} />} label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CreditCard size={20} />
                            <Typography sx={{ fontWeight: 700 }}>Credit / Debit Card</Typography>
                        </Box>
                    } />
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField fullWidth label="Card Number" placeholder="**** **** **** ****" />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField fullWidth label="Expiry" placeholder="MM/YY" /></Grid>
                            <Grid item xs={6}><TextField fullWidth label="CVC" placeholder="***" /></Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                </Paper>
            </RadioGroup>
        </Box>
    );

    const renderReview = () => (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle2 size={64} color="#12B76A" style={{ marginBottom: '16px' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Order Review</Typography>
            <Typography sx={{ color: '#6B7280', mb: 4 }}>Please confirm your order details before we ship your limited flash products.</Typography>
            <Paper sx={{ p: 4, borderRadius: '24px', textAlign: 'left', mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Ship to</Typography>
                        <Typography sx={{ fontWeight: 700, mt: 1 }}>John Doe</Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>123 Flash Way, Swift City, 90210</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Payment</Typography>
                        <Typography sx={{ fontWeight: 700, mt: 1 }}>Visa ending in 4242</Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>Expires 12/26</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );

    const renderSuccess = () => (
        <Box sx={{ textAlign: 'center', py: 12 }}>
            <Box sx={{ width: 100, height: 100, backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
                <CheckCircle2 size={60} color="#12B76A" />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Order Confirmed!</Typography>
            <Typography sx={{ color: '#6B7280', mb: 6, maxWidth: 500, mx: 'auto' }}>
                Thank you for your purchase. We've received your order and are preparing it for flash delivery.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ backgroundColor: '#111827', borderRadius: '16px', px: 6, py: 2, fontWeight: 700, textTransform: 'none' }}
            >
                Continue Shopping
            </Button>
        </Box>
    );

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Navigation />
            <Container maxWidth="lg" sx={{ py: 10 }}>
                {activeStep < steps.length ? (
                    <>
                        <Box sx={{ mb: 8, textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Checkout</Typography>
                            <Typography sx={{ color: '#6B7280' }}>Complete your purchase in 3 easy steps</Typography>
                        </Box>

                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 10, '& .MuiStepIcon-root.Mui-active': { color: '#12B76A' }, '& .MuiStepIcon-root.Mui-completed': { color: '#12B76A' } }}>
                            {steps.map((label) => (
                                <Step key={label}><StepLabel>{label}</StepLabel></Step>
                            ))}
                        </Stepper>

                        <Box sx={{ minHeight: 400, mb: 6 }}>
                            {activeStep === 0 && renderShipping()}
                            {activeStep === 1 && renderPayment()}
                            {activeStep === 2 && renderReview()}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', pt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                startIcon={<ChevronLeft />}
                                sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 4, color: '#111827' }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ backgroundColor: '#12B76A', '&:hover': { backgroundColor: '#0BA05B' }, borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 6, py: 1.5 }}
                            >
                                {activeStep === steps.length - 1 ? 'Place Order' : 'Next Step'}
                            </Button>
                        </Box>
                    </>
                ) : (
                    renderSuccess()
                )}
            </Container>
        </Box>
    );
};

export default Checkout;
