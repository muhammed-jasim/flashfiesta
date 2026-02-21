import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Container, Divider } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail, Github, Chrome, ShieldCheck, Phone } from "lucide-react";
import styled from "styled-components";
import axios from "../axiosInstance";
import { RegisterApi } from "../Api";
import { useNotification } from "../NotificationContext";
import { motion } from "framer-motion";

const AuthContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
  padding: 24px;
`;

const StyledPaper = styled(motion.div)`
  background: white;
  padding: 48px;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
`;

const SocialButton = styled(Button)`
  border: 1px solid #E5E7EB !important;
  color: #374151 !important;
  text-transform: none !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  padding: 10px !important;
  flex: 1;
  
  &:hover {
    background-color: #F9FAFB !important;
    border-color: #D1D5DB !important;
  }
`;

const Signup = () => {
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [formData, setFormData] = useState({ email: "", username: "", password: "", phone_number: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(RegisterApi, formData);
      if (response.data.Status === 6000) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("user_role", response.data.role || 'CUSTOMER');
        localStorage.setItem("access_token", response.data.tokens.access);
        localStorage.setItem("refresh_token", response.data.tokens.refresh);
        showNotification("Account created successfully! Welcome.", "success");
        navigate("/dashboard");
      } else {
        showNotification(response.data.message || "Registration failed", "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "An error occurred during signup", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <StyledPaper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', p: 1.5, backgroundColor: '#F0FDF4', borderRadius: '16px', mb: 2 }}>
            <ShieldCheck color="#12B76A" size={32} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>Create Account</Typography>
          <Typography sx={{ color: '#6B7280' }}>Join the Flash Fiesta community today</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Mail size={20} color="#9CA3AF" /></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><User size={20} color="#9CA3AF" /></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Phone size={20} color="#9CA3AF" /></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock size={20} color="#9CA3AF" /></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: '#12B76A',
                '&:hover': { backgroundColor: '#0BA05B' },
                borderRadius: '12px',
                py: 1.5,
                mt: 1,
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(18, 183, 106, 0.2)'
              }}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Box>
        </form>

        <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>OR SIGN UP WITH</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <SocialButton startIcon={<Chrome size={20} />}>Google</SocialButton>
          <SocialButton startIcon={<Github size={20} />}>Github</SocialButton>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: '#12B76A', fontWeight: 700 }}>Sign In</Link>
          </Typography>
        </Box>
      </StyledPaper>
    </AuthContainer>
  );
};

export default Signup;
