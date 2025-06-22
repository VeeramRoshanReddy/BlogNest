import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif;
    background: #fff;
    color: #0d2346;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  a {
    color: #1976d2;
    text-decoration: none;
    transition: color 0.15s;
    &:hover {
      color: #1565c0;
    }
  }

  button, input, textarea, select {
    font-family: inherit;
    border-radius: 6px;
    border: 1.5px solid #1976d2;
    background: #fff;
    color: #0d2346;
    font-size: 1rem;
    transition: border-color 0.15s, box-shadow 0.15s;
    &:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px #1976d255;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    color: #1976d2;
    font-weight: 700;
    margin-top: 0;
  }

  ::selection {
    background: #1976d2;
    color: #fff;
  }

  /* Subtle blue scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    background: #e3f0fd;
  }
  ::-webkit-scrollbar-thumb {
    background: #1976d2;
    border-radius: 8px;
  }

  /* Subtle blue box-shadow for cards/modals */
  .card, .modal {
    box-shadow: 0 4px 24px 0 rgba(25, 118, 210, 0.08), 0 1.5px 6px 0 rgba(25, 118, 210, 0.06);
    border: 1.5px solid #e3f0fd;
  }
`;

export default GlobalStyle; 