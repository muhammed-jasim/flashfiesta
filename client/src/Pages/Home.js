import React, { useRef, useState, useEffect } from "react";
import Navigation from "../Components/Navigation";
import DashbordCard from "./DashbordCard";
import { Box, Typography, Container, Grid, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp, Grid as GridIcon, ArrowRight } from "lucide-react";
import styled from "styled-components";
import axios from "../axiosInstance";
import { ProductDeatailsApi } from "../Api";

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
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(ProductDeatailsApi);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Electronics", icon: "📱", color: "#EFF6FF" },
    { name: "Fashion", icon: "👗", color: "#FAF5FF" },
    { name: "Home", icon: "🏠", color: "#FFFBEB" },
    { name: "Beauty", icon: "💄", color: "#FFF1F2" },
    { name: "Gaming", icon: "🎮", color: "#F0FDF4" },
    { name: "Fitness", icon: "🏋️", color: "#F0FDFA" },
  ];

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navigation />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Flash Deals Live Now
                </Badge>
                <Typography variant="h1" sx={{
                  fontWeight: 800,
                  fontSize: { xs: '42px', md: '64px' },
                  lineHeight: 1.1,
                  mb: 3,
                  color: '#111827'
                }}>
                  The Future of <span style={{ color: '#12B76A' }}>Shopping</span> is Here.
                </Typography>
                <Typography sx={{ color: '#4B5563', fontSize: '18px', mb: 5, maxWidth: '500px' }}>
                  Grab premium tech, fashion, and lifestyle essentials at unbeatable flash prices. Only while stocks last.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" sx={{
                    backgroundColor: '#12B76A',
                    '&:hover': { backgroundColor: '#0E9F5E' },
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(18, 183, 106, 0.2)'
                  }}>
                    Grab Now
                  </Button>
                  <Button variant="outlined" sx={{
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    '&:hover': { borderColor: '#12B76A', backgroundColor: '#F0FDF4' },
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    View Categories
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{ position: 'relative' }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"
                  sx={{
                    width: '100%',
                    borderRadius: '32px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Paper sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  p: 2,
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                  display: { xs: 'none', lg: 'block' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, backgroundColor: '#DCFCE7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp color="#12B76A" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>Live Viewers</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>1,284 People</Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 10 }}>
        {/* Category Grid */}
        <SectionHeader>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Shop by Category</Typography>
            <Typography sx={{ color: '#6B7280' }}>Curated collections for your lifestyle.</Typography>
          </Box>
          <Button sx={{ color: '#12B76A', fontWeight: 600, display: 'flex', gap: 1 }}>
            View All <ArrowRight size={18} />
          </Button>
        </SectionHeader>

        <Grid container spacing={3} sx={{ mb: 10 }}>
          {categories.map((cat, idx) => (
            <Grid item xs={6} sm={4} md={2} key={idx}>
              <CategoryCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Box sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: cat.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  margin: '0 auto 16px'
                }}>
                  {cat.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }}>{cat.name}</Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Epic Deals Section */}
        <SectionHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Epic Deals</Typography>
              <Typography sx={{ color: '#6B7280' }}>Limited time offers on trending gear.</Typography>
            </Box>
          </Box>
        </SectionHeader>

        <DashbordCard products={products} />
      </Container>
    </Box>
  );
};

export default Home;
