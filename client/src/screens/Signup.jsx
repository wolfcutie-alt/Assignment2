import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #0c2340;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  &::after {
    content: 'V.';
    display: inline-block;
    transform: scaleX(-1);
    margin-left: -0.2em;
  }
`;

const CollegeName = styled.div`
  color: white;
  font-size: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1e293b;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #f8fafc;
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0c2340;
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1.125rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #1e3a5f;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
`;

const StyledLink = styled(Link)`
  color: #dc2626;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('age', formData.age);
      
      await register(formDataToSend);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContainer>
      <LogoContainer>
        <Logo>V</Logo>
        <CollegeName>Whitecliffe College</CollegeName>
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Get Started</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="120"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
        <Text>
          Already have an account?{' '}
          <StyledLink to="/login">Login</StyledLink>
        </Text>
      </Form>
    </SignupContainer>
  );
};

export default Signup;
