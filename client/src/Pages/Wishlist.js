import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper } from '@mui/material';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../WishlistContext';
import Navigation from '../Components/Navigation';
import DashbordCard from './DashbordCard';
import { motion } from 'framer-motion';

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const navigate = useNavigate();

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Navigation />

            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => navigate(-1)}
                        sx={{ color: '#111827', fontWeight: 700 }}
                    >
                        Back
                    </Button>
                    <Typography variant="h3" sx={{ fontWeight: 900 }}>My <span style={{ color: '#F43F5E' }}>Wishlist</span></Typography>
                </Box>

                {wishlist.length === 0 ? (
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            py: 12, textAlign: 'center', borderRadius: '32px',
                            bgcolor: '#F9FAFB', border: '1px solid #F3F4F6', boxShadow: 'none'
                        }}
                    >
                        <Box sx={{ width: 80, height: 80, bgcolor: '#FFF1F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                            <Heart size={40} color="#F43F5E" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Your wishlist is empty</Typography>
                        <Typography sx={{ color: '#6B7280', mb: 4 }}>Save items you love to find them easily later.</Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/dashboard')}
                            sx={{ backgroundColor: '#111827', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700 }}
                        >
                            Explore Products
                        </Button>
                    </Paper>
                ) : (
                    <DashbordCard products={wishlist} />
                )}
            </Container>
        </Box>
    );
};

export default Wishlist;
