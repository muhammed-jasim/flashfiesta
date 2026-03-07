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
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
            <Navigation />

            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => navigate(-1)}
                        sx={{ color: 'text.primary', fontWeight: 700 }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>My <span style={{ color: 'error.main' }}>Wishlist</span></Typography>
                </Box>

                {wishlist.length === 0 ? (
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            py: 6, textAlign: 'center', borderRadius: '24px',
                            bgcolor: 'surface', border: '1px solid', borderColor: 'border', boxShadow: 'none', color: 'text.primary'
                        }}
                    >
                        <Box sx={{ width: 80, height: 80, bgcolor: 'error.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, opacity: 0.8 }}>
                            <Heart size={40} color="#F43F5E" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Your wishlist is empty</Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 4 }}>Save items you love to find them easily later.</Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/dashboard')}
                            sx={{ backgroundColor: 'text.primary', color: 'background.paper', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
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
