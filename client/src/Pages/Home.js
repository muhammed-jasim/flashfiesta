import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../Components/Navigation";
import DashbordCard from "./DashbordCard";
import { Box, Typography, Container, Grid, Button, Paper, CircularProgress, Chip, Divider, IconButton, InputBase } from "@mui/material";
import { motion } from "framer-motion";
import HeroSwiper from "./Swiper";
import { ArrowRight, Zap, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import styled from "styled-components";
import axios from "../axiosInstance";
import { ProductDeatailsApi, CategoriesApi } from "../Api";

const HeroWrapper = styled(Box)`
  padding: 24px 0;
  background-color: #FFFFFF;
`;

const HeroContainer = styled(Box)`
  background: #020617;
  border-radius: 40px;
  padding: 60px;
  position: relative;
  overflow: hidden;
  color: white;
  min-height: 500px;
  display: flex;
  align-items: center;

  @media (max-width: 960px) {
    padding: 40px;
    border-radius: 24px;
  }
`;

const HeroBadge = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 24px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10B981;
  }
`;

const TimerCircle = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #0066FF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  span:first-child {
    font-size: 20px;
    font-weight: 900;
  }
  span:last-child {
    font-size: 10px;
    font-weight: 700;
    opacity: 0.8;
  }
`;

const CategoryPill = styled(motion.div)`
  background: white;
  padding: 12px 24px;
  border-radius: 100px;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: #0066FF;
    color: #0066FF;
    box-shadow: 0 10px 15px -3px rgba(0, 102, 255, 0.1);
  }

  ${({ active }) => active && `
    background: #0066FF;
    color: white;
    border-color: #0066FF;
    &:hover { color: white; }
  `}
`;

const TrendingCard = styled(Paper)`
  padding: 12px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0066FF;
    transform: translateY(-2px);
  }
`;

const NewsletterContainer = styled(Box)`
  background: white;
  border-radius: 40px;
  padding: 60px;
  text-align: center;
  border: 1px solid #E2E8F0;
  margin: 60px 0;
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000"
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const catParam = searchParams.get('category');
  const trendingParam = searchParams.get('trending');

  useEffect(() => {
    fetchHomeData();
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchQuery, catParam, trendingParam, location.hash]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ProductDeatailsApi, {
        params: {
          search: searchQuery || undefined,
          category: catParam || undefined,
          trending: trendingParam || undefined
        }
      });
      setProducts(response.data.data);

      const trendingRes = await axios.get(ProductDeatailsApi, {
        params: { trending: 'true' }
      });
      setTrendingProducts(trendingRes.data.data);

      const catRes = await axios.get(CategoriesApi);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navigation />

      <HeroWrapper>
        <Container maxWidth="xl">
          <HeroContainer>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                  <HeroBadge>LIVE NOW</HeroBadge>
                  <Typography variant="h1" sx={{ fontWeight: 950, fontSize: { xs: '48px', md: '72px' }, mb: 2, lineHeight: 1 }}>
                    THE FIESTA<br />
                    <span style={{ color: '#0066FF', fontStyle: 'italic' }}>IS LIVE</span>
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', mb: 6, maxWidth: '500px' }}>
                    High-performance tech drops. Unbeatable prices. Only while supplies last.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 3, mb: 8 }}>
                    <TimerCircle><span>02</span><span>DAYS</span></TimerCircle>
                    <TimerCircle><span>48</span><span>HRS</span></TimerCircle>
                    <TimerCircle><span>12</span><span>SEC</span></TimerCircle>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard')}
                    endIcon={<ArrowRight />}
                    sx={{
                      bgcolor: '#0066FF',
                      borderRadius: '100px',
                      px: 5, py: 2,
                      fontSize: '18px',
                      fontWeight: 900,
                      boxShadow: '0 20px 40px rgba(0, 102, 255, 0.3)',
                      '&:hover': { bgcolor: '#0052CC' }
                    }}
                  >
                    GRAB NOW
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={5} sx={{ mt: { xs: 4, md: 0 } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <HeroSwiper images={heroImages} />
                </motion.div>
              </Grid>
            </Grid>
          </HeroContainer>
        </Container>
      </HeroWrapper>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Categories Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Flash Categories</Typography>
          <Button endIcon={<ChevronRight size={16} />} sx={{ fontWeight: 700, color: '#0066FF' }}>View All</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 8, '::-webkit-scrollbar': { display: 'none' } }}>
          <CategoryPill active={!catParam} onClick={() => navigate('/dashboard')}>
            <Zap size={18} /> All Deals
          </CategoryPill>
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              active={catParam === cat.id}
              onClick={() => navigate(`/dashboard?category=${cat.id}`)}
            >
              <Box component="img" src={cat.image} sx={{ width: 24, height: 24, borderRadius: '6px' }} />
              {cat.name}
            </CategoryPill>
          ))}
        </Box>

        {/* Epic Deals */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: '#DCFCE7', borderRadius: '50%' }}><Zap size={20} color="#10B981" fill="#10B981" /></Box>
            <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Epic Deals</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ border: '1px solid #E2E8F0' }}><ChevronLeft size={20} /></IconButton>
            <IconButton size="small" sx={{ border: '1px solid #E2E8F0' }}><ChevronRight size={20} /></IconButton>
          </Box>
        </Box>

        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box> : (
          <DashbordCard products={products.slice(0, 4)} />
        )}

        {/* Trending Now */}
        <Box sx={{ mt: 10, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Trending Now</Typography>
          <Grid container spacing={3}>
            {trendingProducts.slice(0, 3).map((product) => (
              <Grid item xs={12} md={4} key={product.id}>
                <TrendingCard onClick={() => navigate(`/product/${product.id}`)}>
                  <Box sx={{ width: 80, height: 80, bgcolor: '#F1F5F9', borderRadius: '16px', flexShrink: 0 }}>
                    <img src={product.ProductImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#0066FF', mb: 0.5, display: 'block' }}>FEATURED</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{product.ProductName}</Typography>
                    <Typography variant="h6" sx={{ color: '#0066FF', fontWeight: 900 }}>${product.Rate} <span style={{ color: '#10B981' }}>✓</span></Typography>
                  </Box>
                </TrendingCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Newsletter */}
        <NewsletterContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: '16px' }}><Mail color="#0066FF" size={32} /></Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 950, mb: 1 }}>Don’t Miss the Next Drop</Typography>
          <Typography sx={{ color: '#64748B', mb: 4 }}>Sign up for early access notifications and exclusive member-only flash codes.</Typography>
          <Box sx={{ display: 'flex', gap: 2, maxWidth: '500px', mx: 'auto' }}>
            <Paper sx={{ display: 'flex', flexGrow: 1, borderRadius: '100px', border: '1px solid #E2E8F0', boxShadow: 'none', px: 3 }}>
              <InputBase placeholder="Enter your email" sx={{ flexGrow: 1, fontSize: '14px' }} />
            </Paper>
            <Button variant="contained" sx={{ bgcolor: '#0066FF', borderRadius: '100px', px: 4, fontWeight: 900 }}>NOTIFY ME</Button>
          </Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', mt: 4, display: 'block' }}>NO SPAM. JUST SPEED.</Typography>
        </NewsletterContainer>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#F8FAFC', py: 10, borderTop: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Zap size={24} fill="#0066FF" color="#0066FF" />
                <Typography variant="h6" sx={{ fontWeight: 950 }}>FLASHFIESTA</Typography>
              </Box>
              <Typography sx={{ color: '#64748B', maxWidth: '300px', mb: 4 }}>
                The ultimate destination for limited-time tech drops and high-performance flash sales. Optimized for the swift.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 900, mb: 3 }}>SHOPPING</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Live Drops</Typography>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Coming Soon</Typography>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Collections</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 900, mb: 3 }}>SUPPORT</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Order Status</Typography>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Returns</Typography>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Help Center</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 900, mb: 3 }}>LEGAL</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Privacy Policy</Typography>
                <Typography variant="body2" sx={{ color: '#64748B', cursor: 'pointer' }}>Terms of Service</Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 6 }} />
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>© 2026 FLASH FIESTA INC. ALL RIGHTS RESERVED.</Typography>
        </Container>
      </Box>
    </Box >
  );
};

export default Home;
