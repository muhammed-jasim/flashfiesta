import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Grid, Typography, Button, IconButton,
    Divider, Rating, Paper, TextField, Avatar, CircularProgress, Chip
} from '@mui/material';
import { Heart, ShoppingBag, ShieldCheck, Truck, RefreshCcw, Timer, X, Send } from 'lucide-react';
import styled from 'styled-components';
import axios from '../axiosInstance';
import { ProductDetailApi, ProductDeatailsApi, CreateReviewApi } from '../Api';
import Navigation from '../Components/Navigation';
import DashbordCard from './DashbordCard';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cartSlice';
import { useWishlist } from '../WishlistContext';
import { useNotification } from '../NotificationContext';

const ImageContainer = styled(Box)`
  background-color: #F9FAFB;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
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
    const showNotification = useNotification();
    const dispatch = useDispatch();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = (p) => {
        dispatch(addToCart(p));
        showNotification("Added to cart", "success");
    };

    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    // Review form state
    const [revState, setRevState] = useState({ rating: 5, comment: '', loading: false });

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(ProductDetailApi(id));
                const data = response.data.data;
                setProduct(data);
                setSelectedImage(data.ProductImage);

                const recResponse = await axios.get(ProductDeatailsApi);
                setRecommendations(recResponse.data.data.filter(p => p.id !== id).slice(0, 4));
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddReview = async () => {
        if (!revState.comment) return;
        setRevState(prev => ({ ...prev, loading: true }));
        try {
            const response = await axios.post(CreateReviewApi, {
                product_id: id,
                rating: revState.rating,
                comment: revState.comment
            });
            if (response.data.Status === 6000) {
                showNotification("Review added successfully", "success");
                setRevState({ rating: 5, comment: '', loading: false });
                // Refresh product details to show new review
                const refreshRes = await axios.get(ProductDetailApi(id));
                setProduct(refreshRes.data.data);
            }
        } catch (error) {
            showNotification("Failed to add review. Are you logged in?", "error");
        } finally {
            setRevState(prev => ({ ...prev, loading: false }));
        }
    };

    if (isLoading || !product) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress color="success" />
        </Box>
    );

    const allImages = [
        { id: 'primary', image: product.ProductImage },
        ...(product.gallery || [])
    ];

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Navigation />

            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <ImageContainer>
                                <img src={selectedImage || product.ProductImage} alt={product.ProductName} />
                            </ImageContainer>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {allImages.map((imgObj, idx) => (
                                    <Grid item xs={3} key={idx}>
                                        <Box
                                            onClick={() => setSelectedImage(imgObj.image)}
                                            sx={{
                                                p: 1, background: '#F9FAFB', borderRadius: '16px',
                                                border: selectedImage === imgObj.image ? '2px solid #12B76A' : '2px solid transparent',
                                                cursor: 'pointer', height: '80px', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                            }}
                                        >
                                            <img src={imgObj.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip label={product.category_details?.name || 'Flash Release'} size="small" variant="outlined" sx={{ fontWeight: 700, borderColor: '#12B76A', color: '#12B76A' }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Rating value={4.8} precision={0.1} size="small" readOnly />
                                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>({product.reviews?.length || 0} Reviews)</Typography>
                                </Box>
                            </Box>

                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '28px', md: '36px' }, lineHeight: 1.2 }}>
                                {product.ProductName}
                            </Typography>

                            <UrgencyBanner>
                                <Timer size={20} color="#F43F5E" />
                                <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 600 }}>
                                    Only <span style={{ fontWeight: 800 }}>{product.Qty}</span> items left in stock!
                                </Typography>
                            </UrgencyBanner>

                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#12B76A' }}>${parseFloat(product.Rate).toFixed(2)}</Typography>
                                <Typography variant="h6" sx={{ color: '#9CA3AF', textDecoration: 'line-through' }}>${(parseFloat(product.Rate || 0) * 1.5).toFixed(2)}</Typography>
                                {product.is_trending && <Chip label="TRENDING" color="error" size="small" sx={{ fontWeight: 900 }} />}
                            </Box>

                            <Typography sx={{ color: '#4B5563', mb: 6, lineHeight: 1.7, fontSize: '16px' }}>
                                {product.ProductDescription}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 8 }}>
                                <Button
                                    fullWidth variant="contained" startIcon={<ShoppingBag />}
                                    onClick={() => handleAddToCart(product)}
                                    sx={{ bgcolor: '#111827', borderRadius: '12px', py: 1.5, fontWeight: 700, fontSize: '16px' }}
                                >
                                    Add to Cart
                                </Button>
                                <IconButton
                                    onClick={() => toggleWishlist(product)}
                                    sx={{
                                        border: '1.5px solid #E5E7EB',
                                        borderRadius: '12px', p: 1.5,
                                        color: isInWishlist(product?.id) ? '#F43F5E' : 'inherit',
                                        borderColor: isInWishlist(product?.id) ? '#F43F5E' : '#E5E7EB'
                                    }}
                                >
                                    <Heart size={24} fill={isInWishlist(product?.id) ? '#F43F5E' : 'transparent'} />
                                </IconButton>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}><FeatureItem icon={<Truck size={20} color="#12B76A" />} title="Free Delivery" desc="Over $100 orders" /></Grid>
                                <Grid item xs={12} sm={4}><FeatureItem icon={<RefreshCcw size={20} color="#12B76A" />} title="7-Day Return" desc="No questions asked" /></Grid>
                                <Grid item xs={12} sm={4}><FeatureItem icon={<ShieldCheck size={20} color="#12B76A" />} title="Secure Checkout" desc="Safe & Encrypted" /></Grid>
                            </Grid>
                        </motion.div>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 12 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Customer Reviews</Typography>

                    {product.can_review ? (
                        <Paper sx={{ p: 4, borderRadius: '24px', mb: 6, bgcolor: '#F9FAFB', border: 'none' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Write a Review</Typography>
                            <Rating value={revState.rating} onChange={(e, val) => setRevState({ ...revState, rating: val })} sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth multiline rows={2} placeholder="Your experience matters..."
                                    value={revState.comment} onChange={(e) => setRevState({ ...revState, comment: e.target.value })}
                                    sx={{ bgcolor: 'white', borderRadius: '12px' }}
                                />
                                <Button
                                    variant="contained" onClick={handleAddReview} disabled={revState.loading}
                                    sx={{ bgcolor: '#12B76A', borderRadius: '12px', minWidth: '120px' }}
                                >
                                    {revState.loading ? <CircularProgress size={24} /> : <Send />}
                                </Button>
                            </Box>
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 3, borderRadius: '20px', mb: 6, bgcolor: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                            <Typography variant="body2" sx={{ color: '#1E40AF', fontWeight: 600 }}>
                                🔒 Only verified buyers who have received this product can leave a review.
                            </Typography>
                        </Paper>
                    )}

                    <Grid container spacing={4}>
                        {product.reviews?.map((rev, i) => (
                            <Grid item xs={12} md={6} key={i}>
                                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: 'none' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#12B76A' }}>{rev.user?.username[0].toUpperCase()}</Avatar>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{rev.user?.username}</Typography>
                                                    <Chip label="Verified Purchase" size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '10px', fontWeight: 800 }} />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>{new Date(rev.created_at).toLocaleDateString()}</Typography>
                                            </Box>
                                        </Box>
                                        <Rating value={rev.rating} size="small" readOnly />
                                    </Box>
                                    <Typography sx={{ color: '#4B5563' }}>"{rev.comment}"</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mt: 16 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 6 }}>Recommended products</Typography>
                    <DashbordCard products={recommendations} />
                </Box>
            </Container>
        </Box>
    );
};

export default ProductDetails;
