import React, { useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Button, Avatar, Stack } from '@mui/material';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, syncCartToBackend } from '../cartSlice';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CartItem = styled(Box)`
  padding: 20px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #F3F4F6;
`;

const QtyBtn = styled(IconButton)`
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 4px;
`;

const CartDrawer = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const cart = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            dispatch(syncCartToBackend(cart));
        }
    }, [cart, dispatch]);

    const handleUpdateQty = (productId, qty) => {
        dispatch(updateQuantity({ productId, quantity: qty }));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px' } }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ShoppingBag size={24} color="#12B76A" />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Your Bag</Typography>
                        <Box sx={{ px: 1, py: 0.2, backgroundColor: '#F0FDF4', borderRadius: '6px', fontSize: '12px', fontWeight: 800, color: '#12B76A' }}>
                            {cart.length}
                        </Box>
                    </Box>
                    <IconButton onClick={onClose}><X /></IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {cart.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
                            <Box sx={{ p: 3, backgroundColor: '#F9FAFB', borderRadius: '50%', mb: 3 }}>
                                <ShoppingBag size={48} color="#D1D5DB" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Bag is empty</Typography>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>Looks like you haven't added anything to your bag yet.</Typography>
                            <Button
                                variant="contained"
                                onClick={onClose}
                                sx={{ backgroundColor: '#111827', borderRadius: '12px', textTransform: 'none', px: 4 }}
                            >
                                Start Shopping
                            </Button>
                        </Box>
                    ) : (
                        cart.map((item) => (
                            <CartItem key={item.id}>
                                <Avatar
                                    src={item.ProductImage}
                                    variant="rounded"
                                    sx={{ width: 80, height: 80, backgroundColor: '#F9FAFB' }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.ProductName}
                                        </Typography>
                                        <IconButton size="small" onClick={() => handleRemove(item.id)}>
                                            <Trash2 size={16} color="#9CA3AF" />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#12B76A', mb: 1.5 }}>
                                        ${parseFloat(item.Rate || 0).toFixed(2)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <QtyBtn size="small" onClick={() => handleUpdateQty(item.id, item.quantity - 1)}><Minus size={14} /></QtyBtn>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                                            <QtyBtn size="small" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}><Plus size={14} /></QtyBtn>
                                        </Stack>
                                    </Box>
                                </Box>
                            </CartItem>
                        ))
                    )}
                </Box>

                {cart.length > 0 && (
                    <Box sx={{ p: 4, borderTop: '1px solid #F3F4F6' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: '#6B7280', fontWeight: 600 }}>Subtotal</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>${cartTotal.toFixed(2)}</Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => { onClose(); navigate('/checkout'); }}
                            sx={{
                                backgroundColor: '#12B76A',
                                '&:hover': { backgroundColor: '#0BA05B' },
                                borderRadius: '16px',
                                py: 2,
                                fontSize: '16px',
                                fontWeight: 700,
                                textTransform: 'none',
                                display: 'flex',
                                gap: 1
                            }}
                        >
                            Checkout <ArrowRight size={20} />
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
