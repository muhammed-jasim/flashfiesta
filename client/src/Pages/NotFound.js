import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FullPage = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  padding: 40px;
  text-align: center;
`;

const IllustrationWrapper = styled(motion.div)`
  position: relative;
  margin-bottom: 48px;
`;

const Glow = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(18, 183, 106, 0.1) 0%, rgba(18, 183, 106, 0) 70%);
  z-index: 0;
`;

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <FullPage>
            <Container maxWidth="sm">
                <IllustrationWrapper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Glow />
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '120px', md: '180px' },
                                fontWeight: 900,
                                color: '#F3F4F6',
                                lineHeight: 1,
                                letterSpacing: '-5px',
                                position: 'relative'
                            }}
                        >
                            404
                        </Typography>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Ghost size={80} color="#12B76A" strokeWidth={1.5} />
                            </motion.div>
                        </Box>
                    </Box>
                </IllustrationWrapper>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#111827' }}>
                        Lost in Space?
                    </Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '18px', mb: 6, lineHeight: 1.6 }}>
                        The page you're looking for has vanished or never existed. Don't worry, even the best explorers get lost sometimes.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            startIcon={<Home size={20} />}
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                backgroundColor: '#111827',
                                '&:hover': { backgroundColor: '#1F2937' },
                                padding: '14px 32px',
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '16px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowLeft size={20} />}
                            onClick={() => navigate(-1)}
                            sx={{
                                borderColor: '#E5E7EB',
                                color: '#4B5563',
                                '&:hover': { borderColor: '#12B76A', color: '#12B76A', backgroundColor: '#F0FDF4' },
                                padding: '14px 32px',
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '16px'
                            }}
                        >
                            Go Back
                        </Button>
                    </Stack>
                </motion.div>

                <Box sx={{ mt: 10, pt: 4, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#12B76A' } }}>
                        HELP CENTER
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#12B76A' } }}>
                        SUPPORT
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#12B76A' } }}>
                        CONTACT US
                    </Typography>
                </Box>
            </Container>
        </FullPage >
    );
};

export default NotFound;
