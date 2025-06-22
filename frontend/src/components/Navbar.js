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
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 1000;
    color: white;
`;

const LogoContainer = styled.div`
    text-align: center;
`;

const Logo = styled(Link)`
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    font-family: 'Georgia', serif;
`;

const Tagline = styled.p`
    font-size: 0.8rem;
    margin-top: -5px;
    color: rgba(255, 255, 255, 0.8);
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
    color: white;
    transition: color 0.3s ease;

    &:hover {
        color: #89f7fe;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: white;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
        color: #ffcccb;
    }
`;

export default Navbar; 