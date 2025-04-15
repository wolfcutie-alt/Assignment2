import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e4e6eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #65676b;
  margin-right: 2rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }
  
  p {
    margin: 0;
    color: #65676b;
    font-size: 1.1rem;
  }
`;

const EditButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const ProfileDetails = styled.div`
  margin-top: 2rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #e4e6eb;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    width: 150px;
    font-weight: 500;
    color: #65676b;
  }
  
  .value {
    flex: 1;
  }
`;

const EditForm = styled.form`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #0066cc;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background-color: #e4e6eb;
  color: #050505;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #d8dadf;
  }
`;

const SaveButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #0052a3;
  }
  
  &:disabled {
    background-color: #e4e6eb;
    cursor: not-allowed;
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    bio: '',
    profile_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize form data with user data
    setFormData({
      username: user.username || '',
      email: user.email || '',
      age: user.age || '',
      bio: user.bio || '',
      profile_image: null
    });
    
    if (user.profile_image) {
      setImagePreview(`${process.env.REACT_APP_API_URL}${user.profile_image}`);
    }
  }, [user, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      if (formData.age) formDataToSend.append('age', formData.age);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.profile_image) formDataToSend.append('profile_image', formData.profile_image);
      
      await userService.updateProfile(formDataToSend);
      setIsEditing(false);
      // Refresh user data in context
      // This would typically be handled by your auth context
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Container>
      <Navbar />
      
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeader>
            <ProfileImage>
              {imagePreview ? (
                <img src={imagePreview} alt={user.username} />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </ProfileImage>
            
            <ProfileInfo>
              <h1>{user.username}</h1>
              <p>{user.role || 'Student'}</p>
            </ProfileInfo>
            
            {!isEditing && (
              <EditButton onClick={() => setIsEditing(true)}>
                Edit Profile
              </EditButton>
            )}
          </ProfileHeader>
          
          {isEditing ? (
            <EditForm onSubmit={handleSubmit}>
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              
              <FormGroup>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  maxLength="500"
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="profile_image">Profile Image</label>
                <input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </SaveButton>
              </ButtonGroup>
            </EditForm>
          ) : (
            <ProfileDetails>
              <h2>Profile Information</h2>
              
              <DetailItem>
                <div className="label">Username</div>
                <div className="value">{user.username}</div>
              </DetailItem>
              
              <DetailItem>
                <div className="label">Email</div>
                <div className="value">{user.email}</div>
              </DetailItem>
              
              <DetailItem>
                <div className="label">Age</div>
                <div className="value">{user.age || 'Not specified'}</div>
              </DetailItem>
              
              <DetailItem>
                <div className="label">Role</div>
                <div className="value">{user.role || 'Student'}</div>
              </DetailItem>
              
              <DetailItem>
                <div className="label">Bio</div>
                <div className="value">{user.bio || 'No bio provided'}</div>
              </DetailItem>
              
              <DetailItem>
                <div className="label">Member Since</div>
                <div className="value">
                  {new Date(user.date_joined).toLocaleDateString()}
                </div>
              </DetailItem>
            </ProfileDetails>
          )}
        </ProfileCard>
      </ProfileContainer>
    </Container>
  );
};

export default Profile;