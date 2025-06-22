import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styled from 'styled-components';

const Layout = () => {
  return (
    <>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

const MainContent = styled.main`
  padding: 20px;
  margin-top: 80px; /* To offset the fixed navbar */
`;

export default Layout; 