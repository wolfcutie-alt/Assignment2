import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import Post from '../components/Post';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 2rem;
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ProfileHeader = styled.div`
  h2 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
  }
  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
  
  div {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const EditProfileButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const FashionWeekBanner = styled.div`
  position: relative;
  height: 200px;
  background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
    url('https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  h1 {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    color: white;
    font-size: 2rem;
    margin: 0;
  }
`;

const SecretFilesFeed = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  h3 {
    color: #333;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }
`;

const CreatePostButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #65676b;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #e4e6e9;
  }
`;

const CreatePostForm = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const PostTitle = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const PostInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const PostButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const ImagePreview = styled.div`
  margin: 1rem 0;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
  }
  
  button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    
    &:hover {
      background: rgba(0,0,0,0.7);
    }
  }
`;

const ImageInput = styled.div`
  margin: 1rem 0;
  
  input {
    display: none;
  }
  
  label {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #f0f2f5;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #e4e6e9;
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCreatePost = async () => {
    if (!user) {
      setError('Please log in to create a post');
      return;
    }

    if (!newPost.trim() || !postTitle.trim()) {
      setError('Please fill in both title and content');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', newPost);
      if (selectedImage) {
        formData.append('post_image', selectedImage);
      }

      await postService.createPost(formData);
      setNewPost('');
      setPostTitle('');
      setSelectedImage(null);
      setImagePreview(null);
      setShowCreatePost(false);
      // Refresh posts
      const fetchedPosts = await postService.getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Navbar />

      <MainContent>
        <aside>
          <ProfileSection>
            <ProfileHeader>
              <h2>{user?.username}</h2>
              <p>{user?.role || 'Student'}</p>
            </ProfileHeader>
            
            <ProfileInfo>
              <div>
                <span>Age</span>
                <span>{user?.age || 'N/A'}</span>
              </div>
              <div>
                <span>Role</span>
                <span>{user?.role || 'Student'}</span>
              </div>
            </ProfileInfo>
            
            <EditProfileButton>Edit Profile</EditProfileButton>
          </ProfileSection>
        </aside>

        <main>
          <FashionWeekBanner>
            <h1>Whitecliffe Fashion Week</h1>
          </FashionWeekBanner>

          {user ? (
            <>
              <CreatePostButton onClick={() => setShowCreatePost(!showCreatePost)}>
                What's on your mind?
              </CreatePostButton>

              {showCreatePost && (
                <CreatePostForm>
                  {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                  <PostTitle
                    placeholder="Post title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <PostInput
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  
                  <ImageInput>
                    <input
                      type="file"
                      id="post-image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="post-image">Add Image</label>
                  </ImageInput>

                  {imagePreview && (
                    <ImagePreview>
                      <img src={imagePreview} alt="Preview" />
                      <button onClick={removeImage}>×</button>
                    </ImagePreview>
                  )}

                  <PostButton onClick={handleCreatePost} disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </PostButton>
                </CreatePostForm>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Please <Link to="/login" style={{ color: '#0066cc' }}>log in</Link> to create posts
            </div>
          )}

          {loading ? (
            <div>Loading posts...</div>
          ) : (
            posts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
        </main>

        <aside>
          <SecretFilesFeed>
            <h3>Secret Files Feed</h3>
            <p>Materials Mixed Up! Lorem ipsum mama gusto ko kumain haha?! then ayon nangyari.</p>
          </SecretFilesFeed>
          <SecretFilesFeed>
            <h3>Secret Files Feed</h3>
            <p>Materials Mixed Up! Lorem ipsum mama gusto ko kumain haha?! then ayon nangyari.</p>
          </SecretFilesFeed>
          <SecretFilesFeed>
            <h3>Secret Files Feed</h3>
            <p>Materials Mixed Up! Lorem ipsum mama gusto ko kumain haha?! then ayon nangyari.</p>
          </SecretFilesFeed>
        </aside>
      </MainContent>
    </Container>
  );
};

export default Home;