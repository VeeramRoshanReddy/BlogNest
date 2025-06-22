import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaUserCircle, FaSignOutAlt, FaTh } from 'react-icons/fa';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Nav>
            <NavLinks>
                <StyledLink to="/">
                    <FaHome />
                    <span>Home</span>
                </StyledLink>
                <StyledLink to="/categories">
                    <FaTh />
                    <span>Categories</span>
                </StyledLink>
            </NavLinks>
            <LogoContainer>
                <Logo to="/">BlogNest</Logo>
                <Tagline>Where Thoughts Find Their Roost</Tagline>
            </LogoContainer>
            <UserActions>
                <StyledLink to="/profile">
                    <FaUserCircle />
                </StyledLink>
                <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt />
                </LogoutButton>
            </UserActions>
        </Nav>
    );
};

const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(25, 118, 210, 0.07);
    border-bottom: 2px solid #e3f0fd;
    z-index: 1000;
    color: #1976d2;
`;

const LogoContainer = styled.div`
    text-align: center;
`;

const Logo = styled(Link)`
    font-size: 2.5rem;
    font-weight: bold;
    color: #1976d2;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
`;

const Tagline = styled.p`
    font-size: 0.8rem;
    margin-top: -5px;
    color: #1976d2;
    opacity: 0.7;
`;

const NavLinks = styled.div`
    display: flex;
    gap: 30px;
`;

const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    color: #1976d2;
    background: transparent;
    border-radius: 8px;
    padding: 4px 10px;
    transition: background 0.18s, color 0.18s;
    &:hover {
        background: #e3f0fd;
        color: #1565c0;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: #1976d2;
    transition: background 0.18s, color 0.18s;
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 4px 10px;
    &:hover {
        background: #e3f0fd;
        color: #1565c0;
    }
`;

export default Navbar; 