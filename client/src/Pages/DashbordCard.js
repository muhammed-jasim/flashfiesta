import React from 'react';
import { Box, Typography, Grid, Paper, IconButton, Button } from '@mui/material';
import { Heart, ShoppingCart, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cartSlice';
import { useWishlist } from '../WishlistContext';
import { useNotification } from '../NotificationContext'; // Assuming this context exists

const StyledCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  border: 1px solid #F1F5F9;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  cursor: pointer;

  &:hover {
    border-color: #0066FF;
    box-shadow: 0 20px 25px -5px rgba(0, 102, 255, 0.1);
    transform: translateY(-8px);
  }
`;

const ImageWrapper = styled(Box)`
  position: relative;
  height: 240px;
  background-color: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }

  ${StyledCard}:hover & img {
    transform: scale(1.1);
  }
`;

const DiscountBadge = styled(Box)`
  position: absolute;
  top: 16px;
  left: 16px;
  background: #EF4444;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 900;
  z-index: 2;
`;

const WishlistBtn = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 2;
  
  &:hover {
    background: #F8FAFC;
    color: #EF4444;
  }
`;

const Content = styled(Box)`
  padding: 20px;
`;

const ProgressBar = styled(Box)`
  height: 6px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
  margin: 12px 0;
  
  div {
    height: 100%;
    background: #10B981;
    border-radius: 100px;
  }
`;

const DashbordCard = ({ products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNotification = useNotification();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    showNotification(`${product.ProductName} added to cart!`, 'success');
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {products.map((product, index) => (
        <Grid item xs={6} sm={6} md={3} key={product.id || index}>
          <StyledCard
            onClick={() => navigate(`/product/${product.id}`)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ImageWrapper>
              <DiscountBadge>50% OFF</DiscountBadge>
              <WishlistBtn size="small" onClick={(e) => handleWishlist(e, product)}>
                <Heart size={18} fill={isInWishlist(product.id) ? '#EF4444' : 'transparent'} color={isInWishlist(product.id) ? '#EF4444' : '#64748B'} />
              </WishlistBtn>
              <img src={product.ProductImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500"} alt={product.ProductName} />
            </ImageWrapper>

            <Content>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, display: 'block' }}>
                {product.category_details?.name || 'Accessories'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: '16px', color: '#020617', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.ProductName}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0066FF' }}>
                  ${product.Rate || '299.00'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', textDecoration: 'line-through' }}>
                  ${(parseFloat(product.Rate || 0) * 1.5).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#10B981' }}>60% CLAIMED</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#EF4444' }}>ONLY 2 LEFT!</Typography>
              </Box>
              <ProgressBar><div style={{ width: '60%' }} /></ProgressBar>

              <Button
                fullWidth
                variant="contained"
                onClick={(e) => handleAddToCart(e, product)}
                startIcon={<ShoppingCart size={18} />}
                sx={{
                  mt: 2,
                  backgroundColor: '#111827',
                  '&:hover': { backgroundColor: '#1F2937' },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: { xs: 0.8, md: 1 },
                  fontSize: { xs: '12px', md: '14px' }
                }}
              >
                Add to Cart
              </Button>
            </Content>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashbordCard;
