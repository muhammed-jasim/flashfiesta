import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Avatar, Divider, CircularProgress, IconButton } from '@mui/material';
import { User, Mail, Phone, MapPin, Building, Hash, Save, Camera, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';
import Navigation from '../Components/Navigation';
import axios from '../axiosInstance';
import { ProfileApi, UpdateProfileApi } from '../Api';
import { useNotification } from '../NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileHero = styled(Box)`
  background: linear-gradient(135deg, #12B76A 0%, #0BA05B 100%);
  height: 160px;
  width: 100%;
  position: relative;
  margin-bottom: 60px;
`;

const AvatarWrapper = styled(Box)`
  position: absolute;
  bottom: -50px;
  left: 40px;
  background: white;
  padding: 5px;
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const ProfileCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  box-shadow: none;
`;

const Profile = () => {
    const navigate = useNavigate();
    const showNotification = useNotification();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        zip_code: '',
        role: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(ProfileApi);
            if (data.Status === 6000) {
                setProfile(data.data);
            }
        } catch (error) {
            showNotification("Failed to load profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const { data } = await axios.post(UpdateProfileApi, profile);
            if (data.Status === 6000) {
                showNotification("Profile updated successfully!", "success");
                localStorage.setItem('username', profile.username);
            }
        } catch (error) {
            showNotification("Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="success" /></Box>;

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh' }}>
            <Navigation />

            <ProfileHero>
                <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ position: 'absolute', top: 20, left: 0, color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    >
                        <ArrowLeft />
                    </IconButton>
                    <AvatarWrapper>
                        <Avatar
                            sx={{ width: 100, height: 100, bgcolor: '#12B76A', fontSize: '40px', fontWeight: 800 }}
                        >
                            {profile.username[0]?.toUpperCase()}
                        </Avatar>
                        {/* <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <Camera size={18} />
                        </IconButton> */}
                    </AvatarWrapper>
                </Container>
            </ProfileHero>

            <Container maxWidth="lg" sx={{ pb: 10 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{profile.username}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>{profile.email}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
                                <Typography variant="caption" sx={{ color: '#12B76A', fontWeight: 900, textTransform: 'uppercase' }}>{profile.role}</Typography>
                            </Box>
                        </Box>

                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Quick Stats</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Account Type</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{profile.role}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Member Since</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Feb 2026</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <ProfileCard component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Account Details</Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Username"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        InputProps={{ startAdornment: <User size={18} color="#9CA3AF" style={{ marginRight: 8 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        InputProps={{ startAdornment: <Mail size={18} color="#9CA3AF" style={{ marginRight: 8 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Phone Number"
                                        value={profile.phone_number}
                                        onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                        placeholder="+1 234 567 890"
                                        InputProps={{ startAdornment: <Phone size={18} color="#9CA3AF" style={{ marginRight: 8 }} /> }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 800 }}>SHIPPING DEFAULTS</Typography>
                                    </Divider>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Default Address" multiline rows={2}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        InputProps={{ startAdornment: <MapPin size={18} color="#9CA3AF" style={{ marginRight: 8, marginTop: -20 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="City"
                                        value={profile.city}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        InputProps={{ startAdornment: <Building size={18} color="#9CA3AF" style={{ marginRight: 8 }} /> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="ZIP Code"
                                        value={profile.zip_code}
                                        onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                                        InputProps={{ startAdornment: <Hash size={18} color="#9CA3AF" style={{ marginRight: 8 }} /> }}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained" fullWidth size="large"
                                        onClick={handleUpdate} disabled={saving}
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                                        sx={{ bgcolor: '#12B76A', '&:hover': { bgcolor: '#0BA05B' }, borderRadius: '12px', py: 1.5, fontWeight: 700 }}
                                    >
                                        {saving ? "Saving Changes..." : "Save Profile"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </ProfileCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
