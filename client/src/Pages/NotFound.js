import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import styled from 'styled-components';

const NotFound = () => {
    const navigate = useNavigate();

    // A high-quality public Lottie animation for 404
    const lottieUrl = "https://lottie.host/76b7104e-e090-4822-8647-3801a61c6b54/yvRz4W3b6w.json";

    return (
        <Container>
            <LottieBox>
                <Lottie
                    animationData={null} // We'll fetch the data or use a better approach
                    path={lottieUrl}
                    loop={true}
                    style={{ height: '400px' }}
                />
            </LottieBox>
            <Content>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#151717' }}>
                    Oops! Page Not Found
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 4, textAlign: 'center' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                        backgroundColor: '#151717',
                        padding: '12px 30px',
                        fontSize: '16px',
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: '#2d79f3'
                        }
                    }}
                >
                    Back to Home
                </Button>
            </Content>
        </Container>
    );
};

export default NotFound;

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8f9fa;
    padding: 20px;
`;

const LottieBox = styled(Box)`
    width: 100%;
    max-width: 500px;
`;

const Content = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;
