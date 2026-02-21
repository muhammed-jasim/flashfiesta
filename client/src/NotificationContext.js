import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Box, Typography, IconButton } from '@mui/material';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const ToastContainer = styled(motion.div)`
  background: white;
  min-width: 320px;
  max-width: 450px;
  padding: 16px 20px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #F3F4F6;
  pointer-events: auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${props => props.color};
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${props => props.bgColor};
  color: ${props => props.color};
  flex-shrink: 0;
`;

const severityConfig = {
    success: {
        icon: <CheckCircle2 size={24} />,
        color: '#12B76A',
        bgColor: '#F0FDF4',
        title: 'Success'
    },
    error: {
        icon: <AlertCircle size={24} />,
        color: '#F43F5E',
        bgColor: '#FFF1F2',
        title: 'Error'
    },
    warning: {
        icon: <AlertTriangle size={24} />,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        title: 'Warning'
    },
    info: {
        icon: <Info size={24} />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        title: 'Information'
    }
};

export const NotificationProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    const showNotification = useCallback((msg, sev = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const config = severityConfig[severity] || severityConfig.info;

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    top: { xs: 20, sm: 40 },
                    right: { xs: 20, sm: 40 },
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ pointerEvents: 'auto' }}>
                    <AnimatePresence>
                        {open && (
                            <ToastContainer
                                color={config.color}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            >
                                <IconWrapper color={config.color} bgColor={config.bgColor}>
                                    {config.icon}
                                </IconWrapper>

                                <Box sx={{ flexGrow: 1, pr: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                                        {config.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.4 }}>
                                        {message}
                                    </Typography>
                                </Box>

                                <IconButton
                                    size="small"
                                    onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        color: '#9CA3AF',
                                        '&:hover': { color: '#6B7280', backgroundColor: '#F9FAFB' }
                                    }}
                                >
                                    <X size={16} />
                                </IconButton>
                            </ToastContainer>
                        )}
                    </AnimatePresence>
                </Box>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
