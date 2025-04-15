import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#0066cc' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.active ? '#0052a3' : '#dee2e6'};
  }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PostTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  color: #333;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.875rem;
`;

const PostContent = styled.p`
  color: #495057;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &.approve {
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
  }
  
  &.reject {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
  
  &.view {
    background-color: #17a2b8;
    color: white;
    
    &:hover {
      background-color: #138496;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.pending {
    background-color: #ffc107;
    color: #212529;
  }
  
  &.approved {
    background-color: #28a745;
    color: white;
  }
  
  &.rejected {
    background-color: #dc3545;
    color: white;
  }
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const Posts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  
  // Check if user is moderator or admin
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';
  
  useEffect(() => {
    // Redirect if not moderator or admin
    if (!isModerator) {
      navigate('/');
      return;
    }
    
    fetchPosts();
  }, [isModerator, navigate]);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getUnmoderatedPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleModeratePost = async (postId, action) => {
    try {
      await postService.moderatePost(postId, action);
      // Refresh the list of unmoderated posts
      fetchPosts();
    } catch (err) {
      console.error('Error moderating post:', err);
      setError('Failed to moderate post. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <Container>
        <Navbar />
        <MainContent>
          <div>Loading posts...</div>
        </MainContent>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Navbar />
        <MainContent>
          <div style={{ color: 'red' }}>{error}</div>
        </MainContent>
      </Container>
    );
  }
  
  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Posts Awaiting Moderation</Title>
        </Header>
        
        {posts.length === 0 ? (
          <NoPostsMessage>
            <p>No posts waiting for moderation!</p>
          </NoPostsMessage>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                  <span>By {post.author?.username}</span>
                  <span>•</span>
                  <span>{formatDate(post.created_at)}</span>
                </PostMeta>
              </PostHeader>
              <PostContent>{post.content}</PostContent>
              {post.image && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    style={{ maxWidth: '100%', borderRadius: '4px' }} 
                  />
                </div>
              )}
              <PostActions>
                <ActionButton 
                  className="approve"
                  onClick={() => handleModeratePost(post.id, 'approve')}
                >
                  Approve
                </ActionButton>
                <ActionButton 
                  className="reject"
                  onClick={() => handleModeratePost(post.id, 'reject')}
                >
                  Reject
                </ActionButton>
              </PostActions>
            </PostCard>
          ))
        )}
      </MainContent>
    </Container>
  );
};

export default Posts;
