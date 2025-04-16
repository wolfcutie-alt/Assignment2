import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postService, commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PostCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
  }
  
  div {
    h3 {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }
  }
`;

const PostContent = styled.div`
  margin-bottom: 1rem;
  
  p {
    margin: 0;
    color: #333;
    line-height: 1.5;
  }
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin: 1rem 0;
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  
  button {
    background: none;
    border: none;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.liked {
      color: #e74c3c;
    }
  }
`;

const CommentSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CommentInput = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #0052a3;
    }
  }
`;

const CommentList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const Comment = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  .comment-author {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .comment-content {
    font-size: 0.875rem;
    color: #333;
  }
`;

const Post = ({ post }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch comments when component mounts
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);
  
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      console.log(`Fetching comments for post with ID: ${post.id}`);
      const fetchedComments = await postService.getCommentsByPostId(post.id);
      console.log('Fetched comments:', fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Show error message to user
      alert('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }
    
    try {
      setIsLoading(true);
      const action = isLiked ? 'dislike' : 'like';
      console.log(`${action}ing post with ID: ${post.id}`);
      const response = await postService.likePost(post.id, action);
      console.log('Like response:', response);
      setIsLiked(response.is_liked);
      if (response && response.like_count !== undefined) {
        setLikeCount(response.like_count);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Show error message to user
      alert('Failed to like post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setIsLoading(true);
      console.log(`Adding comment to post with ID: ${post.id}`);
      const commentData = {
        post: post.id,
        content: newComment,
        author: user.id
      };
      
      const response = await commentService.createComment(commentData);
      console.log('Comment response:', response);
      setNewComment('');
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      // Show error message to user
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(post.id);
        // The parent component will handle refreshing the posts list
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <PostCard>
      <PostHeader>
        <img 
          src={post.author.avatar || 'https://via.placeholder.com/40'} 
          alt={post.author.username} 
        />
        <div>
          <h3>{post.author.username}</h3>
          <p>Student</p>
        </div>
      </PostHeader>
      
      <PostContent>
        <p>{post.content}</p>
      </PostContent>
      
      {post.post_image && (
        <PostImage 
          src={`${process.env.REACT_APP_API_URL}${post.post_image}`} 
          alt="Post image" 
        />
      )}
      
      <PostActions>
        <button 
          className={isLiked ? 'liked' : ''} 
          onClick={handleLike}
          disabled={isLoading}
        >
          <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
          <span>Like ({likeCount})</span>
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          <i className="far fa-comment"></i>
          <span>Comment</span>
        </button>
        <button>
          <i className="far fa-share-square"></i>
          <span>Share</span>
        </button>
      </PostActions>
      
      {showComments && (
        <CommentSection>
          <CommentInput>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit} disabled={isLoading}>
              Post
            </button>
          </CommentInput>
          
          <CommentList>
            {isLoading ? (
              <div>Loading comments...</div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <Comment key={comment.id}>
                  <div className="comment-author">{comment.author.username}</div>
                  <div className="comment-content">{comment.content}</div>
                </Comment>
              ))
            ) : (
              <div>No comments yet</div>
            )}
          </CommentList>
        </CommentSection>
      )}
    </PostCard>
  );
};

export default Post; 