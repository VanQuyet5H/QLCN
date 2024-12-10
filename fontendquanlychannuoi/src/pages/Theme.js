import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: {
      light: '#f8fafc',
      dark: '#1e293b'
    },
    text: {
      light: '#1e293b',
      dark: '#f8fafc'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: ${theme.colors.primary};
    --secondary-color: ${theme.colors.secondary};
    --background-light: ${theme.colors.background.light};
    --background-dark: ${theme.colors.background.dark};
    --text-light: ${theme.colors.text.light};
    --text-dark: ${theme.colors.text.dark};
    --sidebar-width: 250px;
    --sidebar-collapsed-width: 70px;
    --header-height: 60px;
    scrollbar-width: none;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Inter, system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-light);
    color: var(--text-light);
  }

  
`;