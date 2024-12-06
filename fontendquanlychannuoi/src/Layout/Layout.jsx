import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.isExpanded ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  padding-top: var(--header-height);
  overflow-x: hidden;
  scrollbar-width: none;
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  min-height: calc(100vh - var(--header-height));
   @media (max-width: 768px) {
    padding-left: 1rem; /* Add some space on left side */
  }
`;

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutWrapper>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <MainContent isExpanded={!isSidebarOpen}>
        <Header isExpanded={!isSidebarOpen} toggleSidebar={toggleSidebar} />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutWrapper>
  );
}

export default Layout;