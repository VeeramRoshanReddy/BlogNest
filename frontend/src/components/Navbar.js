import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaUserCircle, FaSignOutAlt, FaTh, FaFeatherAlt } from 'react-icons/fa';

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #1976d2; /* Blue Background */
    color: #fff; /* White Text */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 2rem;
    font-weight: 700;
    color: #fff; /* White Logo Text */
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Tagline = styled.p`
    font-size: 0.9rem;
    font-style: italic;
    color: #e3f2fd; /* Lighter white for tagline */
    margin-left: 1rem;
    opacity: 0.9;
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const StyledLink = styled(Link)`
    color: #fff; /* White Link Text */
    padding: 0.6rem 1.1rem;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
`;

const LogoutButton = styled.button`
    color: #fff; /* White Button Text */
    background: transparent;
    border: 1px solid #fff;
    padding: 0.6rem 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s, transform 0.2s;

    &:hover {
        background-color: #fff;
        color: #1976d2; /* Blue text on hover */
        transform: translateY(-2px);
    }
`;

export default Navbar; 