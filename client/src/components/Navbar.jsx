import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #60a5fa;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.$isActive ? '#60a5fa' : 'white'};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #60a5fa;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #dc2626;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #2563eb;
  border: none;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const RegisterButton = styled(Link)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  background-color: white;
  border: none;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isModeratorOrAdmin = user?.role === 'moderator' || user?.role === 'admin';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Nav>
      <Container>
        <FlexContainer>
          <Logo to="/">
            Whitecliffe
          </Logo>
          
          <NavLinks>
            {user ? (
              <>
                <NavLink to="/forum" $isActive={isActive('/forum')}>
                  Forum
                </NavLink>
                {isModeratorOrAdmin ? (
                  <>
                    <NavLink to="/posts" $isActive={isActive('/posts')}>
                      Moderate Posts
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/announcements" $isActive={isActive('/announcements')}>
                    Announcements
                  </NavLink>
                )}
                <NavLink to="/events" $isActive={isActive('/events')}>
                  Events
                </NavLink>
                <NavLink to="/profile" $isActive={isActive('/profile')}>
                  Profile
                </NavLink>
                <NavLink to="/message" $isActive={isActive('/message')}>
                  Message
                </NavLink>
                <LogoutButton onClick={handleLogout}>
                  Logout
                </LogoutButton>
              </>
            ) : (
              <>
                <LoginButton to="/login">
                  Login
                </LoginButton>
                <RegisterButton to="/register">
                  Register
                </RegisterButton>
              </>
            )}
          </NavLinks>
        </FlexContainer>
      </Container>
    </Nav>
  );
};

export default Navbar; 