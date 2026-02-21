import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Container, Divider } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import styled from "styled-components";
import axios from "../axiosInstance";
import { LoginApi } from "../Api";
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

const Signin = () => {
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(LoginApi, formData);
      if (data.Status === 6000) {
        localStorage.clear();
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        showNotification("Welcome back to Flash Fiesta!", "success");
        navigate("/dashboard");
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <StyledPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>Sign In</Typography>
          <Typography sx={{ color: '#6B7280' }}>Enter your details to access your account</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ color: '#12B76A', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Box>

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
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(18, 183, 106, 0.2)'
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </form>

        <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>OR CONTINUE WITH</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <SocialButton startIcon={<Chrome size={20} />}>Google</SocialButton>
          <SocialButton startIcon={<Github size={20} />}>Github</SocialButton>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: '#12B76A', fontWeight: 700 }}>Sign Up</Link>
          </Typography>
        </Box>
      </StyledPaper>
    </AuthContainer>
  );
};

export default Signin;
