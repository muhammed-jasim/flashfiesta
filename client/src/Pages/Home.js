import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../Components/Navigation";
import DashbordCard from "./DashbordCard";
import { Box, Typography, Container, Grid, Button, Paper, CircularProgress, Chip, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Timer } from "lucide-react";
import styled from "styled-components";
import axios from "../axiosInstance";
import { ProductDeatailsApi, CategoriesApi } from "../Api";

const HeroSection = styled(Box)`
  background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
  padding: 80px 0;
  overflow: hidden;
  position: relative;
`;

const Badge = styled(motion.div)`
  background: #DCFCE7;
  color: #15803D;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
`;

const CategoryCard = styled(motion.div)`
  background: white;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    border-color: #12B76A;
    box-shadow: 0 10px 25px -5px rgba(18, 183, 106, 0.1);
    transform: translateY(-5px);
  }
`;

const SectionHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Fetch Products
      let url = `${ProductDeatailsApi}?`;
      if (searchQuery) url += `search=${searchQuery}&`;
      if (catParam) url += `category=${catParam}&`;
      if (trendingParam) url += `trending=true&`;

      const response = await axios.get(url);
      setProducts(response.data.data);

      // Fetch Trending Products for the horizontal bar
      const trendingRes = await axios.get(`${ProductDeatailsApi}?trending=true`);
      setTrendingProducts(trendingRes.data.data);

      // Fetch Categories
      const catRes = await axios.get(CategoriesApi);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCatClick = (catId) => {
    if (catParam === catId) {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard?category=${catId}`);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navigation />

      <HeroSection>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <Badge initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  Flash Deals Live Now
                </Badge>
                <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '42px', md: '64px' }, mb: 3 }}>
                  Swift Picks, <span style={{ color: '#12B76A' }}>Flash</span> Prices.
                </Typography>
                <Typography sx={{ color: '#6B7280', fontSize: '18px', mb: 5 }}>
                  Premium quality gear delivered with flash speed. Explore the Fiesto collections today.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ bgcolor: '#111827', borderRadius: '12px', px: 4, py: 1.5 }}>Shop Deals</Button>
                  <Button variant="outlined" sx={{ borderRadius: '12px', px: 4, py: 1.5 }}>Explore All</Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="img" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" sx={{ width: '100%', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 10 }}>
        {/* Categories */}
        <SectionHeader id="categories">
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Explore Categories</Typography>
        </SectionHeader>
        <Grid container spacing={2} sx={{ mb: 8 }}>
          {categories.map((cat, idx) => (
            <Grid item xs={6} sm={4} md={2} key={cat.id}>
              <CategoryCard
                onClick={() => handleCatClick(cat.id)}
                sx={{ borderColor: catParam === cat.id ? '#12B76A' : '#E5E7EB', bgcolor: catParam === cat.id ? '#F0FDF4' : 'white' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              >
                <Box sx={{ width: 60, height: 60, borderRadius: '14px', bgcolor: '#F9FAFB', mb: 2, overflow: 'hidden', mx: 'auto' }}>
                  <img src={cat.image || "https://cdn-icons-png.flaticon.com/512/3081/3081840.png"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{cat.name}</Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Trending Section */}
        {trendingProducts.length > 0 && !trendingParam && (
          <>
            <SectionHeader id="trending">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Trending Now</Typography>
                <Chip label="HOT" color="error" size="small" sx={{ fontWeight: 900 }} />
              </Box>
            </SectionHeader>
            <DashbordCard products={trendingProducts.slice(0, 4)} />
            <Divider sx={{ my: 10 }} />
          </>
        )}

        {/* All Products */}
        <SectionHeader>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {trendingParam ? 'Trending Flash Gear' : (catParam ? 'Category Items' : 'All Flash Deals')}
          </Typography>
        </SectionHeader>

        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box> : (
          products.length > 0 ? <DashbordCard products={products} /> : <Typography>No products found.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default Home;
