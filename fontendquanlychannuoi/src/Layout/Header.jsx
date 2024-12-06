import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.isExpanded ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'};
  height: var(--header-height);
  background: white;
  z-index: 100;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    left: 0;
    width: 100%;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: '#ffffff';
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

function Header({ isExpanded, toggleSidebar }) {
  return (
    <HeaderWrapper isExpanded={isExpanded}>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <FaBars size={24} />
        </MenuButton>
        <h1>Quản lý chăn nuôi</h1>
      </HeaderLeft>
      <HeaderRight>
        <ThemeToggle />
      </HeaderRight>
    </HeaderWrapper>
  );
}

export default Header;