import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        // Sync to backend if logged in
        const syncCart = async () => {
            if (localStorage.getItem('access_token')) {
                const { SyncCartApi } = await import('./Api');
                const axios = (await import('./axiosInstance')).default;
                try {
                    await axios.post(SyncCartApi, { items: cart });
                } catch (e) { console.error("Cart sync failed", e); }
            }
        };
        const timer = setTimeout(syncCart, 1000); // Debounce sync
        return () => clearTimeout(timer);
    }, [cart]);

    const fetchUserCart = async () => {
        if (!localStorage.getItem('access_token')) return;
        const { GetCartApi } = await import('./Api');
        const axios = (await import('./axiosInstance')).default;
        try {
            const { data } = await axios.get(GetCartApi);
            if (data.Status === 6000) {
                setCart(data.data);
            }
        } catch (e) { console.error("Failed to fetch user cart", e); }
    };

    useEffect(() => {
        fetchUserCart();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, qty) => {
        if (qty < 1) return removeFromCart(productId);
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: qty } : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.Rate || 0) * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
