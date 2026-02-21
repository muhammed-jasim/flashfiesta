import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, IconButton, Tab, Tabs, Divider, Rating, Badge, Paper } from '@mui/material';
import { Heart, ShoppingBag, ShieldCheck, Truck, RefreshCcw, Star, Timer } from 'lucide-react';
import styled from 'styled-components';
import axios from '../axiosInstance';
import { ProductDetailApi, ProductDeatailsApi } from '../Api';
import Navigation from '../Components/Navigation';
import DashbordCard from './DashbordCard';
import { motion } from 'framer-motion';

const ImageContainer = styled(Box)`
  background-color: #F9FAFB;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  aspect-ratio: 1;

  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }
`;

const UrgencyBanner = styled(Box)`
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const FeatureItem = ({ icon, title, desc }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ p: 1, backgroundColor: '#F0FDF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography variant="caption" sx={{ color: '#6B7280' }}>{desc}</Typography>
        </Box>
    </Box>
);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(ProductDetailApi(id));
                setProduct(response.data.data);

                // Fetch recommendations
                const recResponse = await axios.get(ProductDeatailsApi);
                setRecommendations(recResponse.data.data.filter(p => p.ProductID !== parseInt(id)).slice(0, 4));
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading || !product) return null;

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Navigation />

            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Grid container spacing={8}>
                    {/* Product Imagery */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <ImageContainer>
                                <img src={product.ProductImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} alt={product.ProductName} />
                            </ImageContainer>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {[1, 2, 3, 4].map(i => (
                                    <Grid item xs={3} key={i}>
                                        <Box sx={{ p: 2, background: '#F9FAFB', borderRadius: '16px', border: i === 1 ? '2px solid #12B76A' : 'none', cursor: 'pointer' }}>
                                            <img src={product.ProductImage} style={{ width: '100%', opacity: i === 1 ? 1 : 0.5 }} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Grid>

                    {/* Product Info */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#12B76A', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Limited Flash Release
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Rating value={4.8} precision={0.1} size="small" readOnly />
                                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>(128 Reviews)</Typography>
                                </Box>
                            </Box>

                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '32px', md: '48px' }, lineHeight: 1.2 }}>
                                {product.ProductName}
                            </Typography>

                            <UrgencyBanner>
                                <Timer size={20} color="#F43F5E" />
                                <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 600 }}>
                                    Flash deal ends in <span style={{ fontWeight: 800 }}>02:45:12</span>. Only <span style={{ fontWeight: 800 }}>{product.Qty}</span> items left in stock!
                                </Typography>
                            </UrgencyBanner>

                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#12B76A' }}>
                                    ${product.Rate}
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#9CA3AF', textDecoration: 'line-through' }}>
                                    ${(product.Rate * 1.5).toFixed(2)}
                                </Typography>
                                <Box sx={{ px: 1.5, py: 0.5, backgroundColor: '#F43F5E', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                                    -33% OFF
                                </Box>
                            </Box>

                            <Typography sx={{ color: '#4B5563', mb: 6, lineHeight: 1.7, fontSize: '16px' }}>
                                {product.ProductDescription || "Elevate your daily routine with the premium Flash Release. Designed for those who demand both style and unmatched performance. Crafted from sustainable high-grade materials for long-lasting comfort and durability."}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 8 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<ShoppingBag />}
                                    sx={{
                                        backgroundColor: '#111827',
                                        '&:hover': { backgroundColor: '#1F2937' },
                                        borderRadius: '16px',
                                        py: 2,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '18px'
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <IconButton sx={{ border: '2px solid #E5E7EB', borderRadius: '16px', p: 2 }}>
                                    <Heart size={24} />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <FeatureItem icon={<Truck size={20} color="#12B76A" />} title="Free Delivery" desc="Over $100 orders" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FeatureItem icon={<RefreshCcw size={20} color="#12B76A" />} title="7-Day Return" desc="No questions asked" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FeatureItem icon={<ShieldCheck size={20} color="#12B76A" />} title="Secure Checkout" desc="Industry leading" />
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Reviews Section */}
                <Box sx={{ mt: 12 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Honest Reviews</Typography>
                    <Grid container spacing={4}>
                        {[1, 2].map(rev => (
                            <Grid item xs={12} md={6} key={rev}>
                                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: 'none' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 48, height: 48, backgroundColor: '#F3F4F6', borderRadius: '50%' }} />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Alex Johnson</Typography>
                                                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>Verified Purchase</Typography>
                                            </Box>
                                        </Box>
                                        <Rating value={5} size="small" readOnly />
                                    </Box>
                                    <Typography sx={{ color: '#4B5563' }}>
                                        "The quality is absolutely phenomenal. I wasn't expecting it to be this good for a flash deal. Shipping was lightning fast too!"
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Recommendations */}
                <Box sx={{ mt: 16 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Recommended for You</Typography>
                    </Box>
                    <DashbordCard products={recommendations} />
                </Box>
            </Container>
        </Box>
    );
};

export default ProductDetails;
