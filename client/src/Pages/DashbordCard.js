import React from 'react';
import { Box, Typography, Grid, Paper, IconButton, Button } from '@mui/material';
import { Heart, ShoppingCart, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const StyledCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  border: 1px solid #F3F4F6;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
    border-color: #12B76A;
  }
`;

const ImageWrapper = styled(Box)`
  position: relative;
  aspect-ratio: 1;
  background-color: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }

  ${StyledCard}:hover img {
    transform: scale(1.1);
  }
`;

const DealBadge = styled(Box)`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #12B76A;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
`;

const WishlistBtn = styled(IconButton)`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 10;
  
  &:hover {
    background: white;
    color: #F43F5E;
  }
`;

const Content = styled(Box)`
  padding: 20px;
`;

const StockIndicator = styled(Box)`
  height: 6px;
  background: #F3F4F6;
  border-radius: 10px;
  margin: 12px 0;
  overflow: hidden;
`;

const StockProgress = styled(Box)`
  height: 100%;
  background: ${props => props.low ? '#F43F5E' : '#12B76A'};
  width: ${props => props.width}%;
`;

const DashbordCard = ({ products = [] }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Grid container spacing={4}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={3} key={product.id || index}>
          <StyledCard
            onClick={() => navigate(`/product/${product.id}`)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ImageWrapper>
              <DealBadge>
                FLASH SALE
              </DealBadge>
              <WishlistBtn size="small">
                <Heart size={18} />
              </WishlistBtn>
              <img
                src={product.ProductImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500"}
                alt={product.ProductName}
              />
            </ImageWrapper>

            <Content>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {product.category_details?.name || 'Flash Release'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '18px', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.ProductName}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#12B76A' }}>
                  ${product.Rate || '299.00'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', textDecoration: 'line-through' }}>
                  ${(product.Rate * 1.4).toFixed(2) || '499.00'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: product.Qty < 10 ? '#F43F5E' : '#6B7280' }}>
                  {product.Qty < 10 ? 'ONLY ' : ''}{product.Qty} ITEMS LEFT!
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Timer size={12} /> 2h left
                </Typography>
              </Box>

              <StockIndicator>
                <StockProgress width={(product.Qty / 50) * 100} low={product.Qty < 10} />
              </StockIndicator>

              <Button
                fullWidth
                variant="contained"
                onClick={(e) => handleAddToCart(e, product)}
                startIcon={<ShoppingCart size={18} />}
                sx={{
                  mt: 2,
                  backgroundColor: '#111827',
                  '&:hover': { backgroundColor: '#1F2937' },
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2
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
