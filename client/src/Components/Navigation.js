import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Box, InputBase, Container } from '@mui/material';
import { Search, Heart, ShoppingBag, User, MoreVertical, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logopng from '../myntra-logo-m-png-3.png';
import { useCart } from '../CartContext';
import CartDrawer from './CartDrawer';

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
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
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
    localStorage.clear();
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

  return (
    <NavContainer position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ px: '0 !important' }}>
          <LogoLink to="/dashboard">
            <span style={{ color: '#12B76A' }}>FLASH</span> FIESTA
          </LogoLink>

          <NavLinks>
            <NavItem to="/dashboard">Flash Deals</NavItem>
            <NavItem to="/categories">Categories</NavItem>
            <NavItem to="/trending">Trending</NavItem>
          </NavLinks>

          <Box sx={{ flexGrow: 1 }} />

          <SearchWrapper>
            <Search size={18} color="#9CA3AF" />
            <InputBase
              placeholder="Search limited products..."
              sx={{ ml: 1, flex: 1, fontSize: '14px', fontWeight: 500 }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchWrapper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBtn size="large">
              <Badge badgeContent={17} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#12B76A' } }}>
                <Heart size={24} strokeWidth={1.5} />
              </Badge>
            </IconBtn>
            <IconBtn size="large" onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#12B76A' } }}>
                <ShoppingBag size={24} strokeWidth={1.5} />
              </Badge>
            </IconBtn>
            <IconBtn
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
            >
              <User size={24} strokeWidth={1.5} />
            </IconBtn>
          </Box>
        </Toolbar>
      </Container>
      {renderMenu}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </NavContainer>
  );
}
