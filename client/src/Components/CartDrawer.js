import React, { useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Button, Avatar, Stack } from '@mui/material';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, syncCartToBackend } from '../cartSlice';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CartItem = styled(Box)`
  padding: 15px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const QtyBtn = styled(IconButton)`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px;
  color: ${props => props.theme.colors.text};
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
            PaperProps={{ sx: { width: { xs: '100%', sm: 360 }, borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px', bgcolor: 'surface', backgroundImage: 'none' } }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'text.primary' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'border' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ShoppingBag size={24} color="#3B82F6" />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Your Bag</Typography>
                        <Box sx={{ px: 1, py: 0.2, backgroundColor: 'surfaceSecondary', borderRadius: '6px', fontSize: '12px', fontWeight: 800, color: 'primary.main', border: '1px solid', borderColor: 'border' }}>
                            {cart.length}
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'text.primary' }}><X /></IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {cart.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
                            <Box sx={{ p: 3, backgroundColor: 'surfaceSecondary', borderRadius: '50%', mb: 3 }}>
                                <ShoppingBag size={48} color="#9CA3AF" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Bag is empty</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Looks like you haven't added anything to your bag yet.</Typography>
                            <Button
                                variant="contained"
                                onClick={onClose}
                                sx={{ backgroundColor: 'primary.main', color: 'white', borderRadius: '12px', textTransform: 'none', px: 4, fontWeight: 700, '&:hover': { bgcolor: 'primary.dark' } }}
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
                                    sx={{ width: 64, height: 64, backgroundColor: 'surfaceSecondary' }}
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
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
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
                    <Box sx={{ p: 4, borderTop: '1px solid', borderColor: 'border' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '18px', color: 'text.primary' }}>${cartTotal.toFixed(2)}</Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => { onClose(); navigate('/checkout'); }}
                            sx={{
                                backgroundColor: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.dark' },
                                color: 'white',
                                borderRadius: '12px',
                                py: 1.5,
                                fontSize: '15px',
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
