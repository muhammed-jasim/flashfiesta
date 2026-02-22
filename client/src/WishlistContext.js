import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from './axiosInstance';
import { ToggleWishlistApi, ListWishlistApi } from './Api';
import { useNotification } from './NotificationContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const showNotification = useNotification();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = React.useCallback(async () => {
        if (!localStorage.getItem('access_token')) return;
        try {
            const { data } = await axios.get(ListWishlistApi);
            if (data.Status === 6000) {
                setWishlist(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    }, []);

    const toggleWishlist = React.useCallback(async (product) => {
        if (!localStorage.getItem('access_token')) {
            showNotification("Please login to manage your wishlist", "error");
            return;
        }

        try {
            const { data } = await axios.post(ToggleWishlistApi, { product_id: product.id });
            if (data.Status === 6000) {
                if (data.wishlisted) {
                    setWishlist(prev => [...prev, product]);
                    showNotification("Added to wishlist", "success");
                } else {
                    setWishlist(prev => prev.filter(item => item.id !== product.id));
                    showNotification("Removed from wishlist", "info");
                }
            }
        } catch (error) {
            showNotification("Failed to update wishlist", "error");
        }
    }, [showNotification]);

    const isInWishlist = React.useCallback((productId) => wishlist.some(item => item.id === productId), [wishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
