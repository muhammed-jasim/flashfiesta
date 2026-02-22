import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Box, InputBase, Container, Typography, Avatar } from '@mui/material';
import { Search, Heart, ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import axios from '../axiosInstance';
import { SearchSuggestionsApi } from '../Api';
import CartDrawer from './CartDrawer';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount, fetchCart, syncCartToBackend, clearCart } from '../cartSlice';

const NavContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#111827',
  boxShadow: 'none',
  borderBottom: '1px solid #E5E7EB',
  height: '72px',
  justifyContent: 'center',
}));

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 800;
  font-size: 20px;
  color: #111827;
  letter-spacing: -0.5px;

  img {
    height: 32px;
    width: auto;
  }
`;

const NavLinks = styled(Box)`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-left: 32px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #4B5563;
  transition: all 0.2s ease;
  padding: 8px 0;
  position: relative;

  &:hover {
    color: #12B76A;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #12B76A;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: '#F3F4F6',
  transition: 'all 0.2s ease',
  marginRight: '16px',
  marginLeft: '16px',
  width: '320px',
  display: 'flex',
  alignItems: 'center',
  padding: '4px 12px',

  '&:focus-within': {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 0 2px #12B76A',
  },

  '@media (max-width: 768px)': {
    display: 'none',
  },
}));

const IconBtn = styled(IconButton)`
  color: #4B5563;
  transition: all 0.2s ease;
  
  &:hover {
    color: #12B76A;
    background-color: #F0FDF4;
  }
`;



export default function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const { wishlist, fetchWishlist } = useWishlist();

  const cart = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);

  React.useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
      fetchWishlist();
    }
  }, [dispatch, fetchWishlist, cartStatus]);

  React.useEffect(() => {
    // Debounce sync to backend to avoid multiple calls
    const timer = setTimeout(() => {
      if (localStorage.getItem('access_token') && cartStatus === 'succeeded') {
        dispatch(syncCartToBackend(cart));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cart, dispatch, cartStatus]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    dispatch(clearCart());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    window.location.href = '/';
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ '& .MuiPaper-root': { borderRadius: '12px', mt: 1, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }} sx={{ fontSize: '14px', px: 2, py: 1 }}>My Profile</MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }} sx={{ fontSize: '14px', px: 2, py: 1 }}>My Orders</MenuItem>
      <MenuItem onClick={handleLogout} sx={{ fontSize: '14px', px: 2, py: 1, color: '#F43F5E', display: 'flex', gap: 1 }}>
        <LogOut size={16} /> Logout
      </MenuItem>
    </Menu>
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = React.useState(initialSearch);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const suggestionRef = React.useRef(null);

  React.useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.trim().length >= 2) {
        try {
          const { data } = await axios.get(SearchSuggestionsApi, {
            params: { q: searchValue.trim() }
          });
          if (data.Status === 6000) setSuggestions(data.data);
        } catch (err) { console.error(err); }
      } else {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = localStorage.getItem('user_role');
  const isAdmin = role === 'OWNER' || role === 'EMPLOYEE';

  return (
    <NavContainer position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ px: '0 !important' }}>
          <LogoLink to="/dashboard">
            <span style={{ color: '#12B76A' }}>FLASH</span> FIESTA
          </LogoLink>

          <NavLinks>
            <NavItem to="/dashboard">Flash Deals</NavItem>
            <NavItem to="/dashboard#categories" onClick={() => {
              const el = document.getElementById('categories');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Categories</NavItem>
            <NavItem to="/dashboard?trending=true">Trending</NavItem>
            {isAdmin && <NavItem to="/myadmin" sx={{ color: '#12B76A !important', fontWeight: 'bold' }}>Admin</NavItem>}
          </NavLinks>

          <Box sx={{ flexGrow: 1 }} />

          <SearchWrapper ref={suggestionRef}>
            <Search size={18} color="#9CA3AF" />
            <InputBase
              placeholder="Search limited products..."
              sx={{ ml: 1, flex: 1, fontSize: '14px', fontWeight: 500 }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false);
                  const params = new URLSearchParams(location.search);
                  if (searchValue.trim()) {
                    params.set('search', searchValue.trim());
                  } else {
                    params.delete('search');
                  }
                  navigate(`/dashboard?${params.toString()}`);
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <Box sx={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                bgcolor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', mt: 1, zIndex: 1000,
                overflow: 'hidden'
              }}>
                {suggestions.map((name, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchValue(name);
                      const params = new URLSearchParams(location.search);
                      params.set('search', name);
                      navigate(`/dashboard?${params.toString()}`);
                    }}
                    sx={{
                      p: 1.5, display: 'flex', alignItems: 'center', gap: 2,
                      cursor: 'pointer', '&:hover': { bgcolor: '#F9FAFB' },
                      borderBottom: '1px solid #F3F4F6'
                    }}
                  >
                    <Search size={16} color="#9CA3AF" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </SearchWrapper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBtn size="large" onClick={() => navigate('/wishlist')} sx={{ color: wishlist.length > 0 ? '#F43F5E' : 'inherit' }}>
              <Badge badgeContent={wishlist.length} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#F43F5E' } }}>
                <Heart size={24} strokeWidth={1.5} fill={wishlist.length > 0 ? '#F43F5E' : 'transparent'} />
              </Badge>
            </IconBtn>
            <IconBtn size="large" onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#12B76A' } }}>
                <ShoppingBag size={24} strokeWidth={1.5} />
              </Badge>
            </IconBtn>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, display: 'block', lineHeight: 1 }}>Welcome,</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#111827' }}>{localStorage.getItem('username') || 'Guest'}</Typography>
              </Box>
              <IconBtn
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
              >
                <User size={24} strokeWidth={1.5} />
              </IconBtn>
            </Box>
          </Box>
        </Toolbar>
      </Container>
      {renderMenu}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </NavContainer>
  );
}
