import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
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

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const AnnouncementCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const AnnouncementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AnnouncementTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin: 0;
`;

const AnnouncementMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.875rem;
`;

const AnnouncementContent = styled.p`
  color: #495057;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const AnnouncementActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &.edit {
    background-color: #17a2b8;
    color: white;
    
    &:hover {
      background-color: #138496;
    }
  }
  
  &.delete {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

const NoAnnouncementsMessage = styled.div`
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

// Sample announcements data (replace with API calls later)
const sampleAnnouncements = [
  {
    id: 1,
    title: 'Campus Closure - Maintenance Work',
    content: 'The campus will be closed for maintenance work from June 15th to June 17th. All classes will be conducted online during this period.',
    author: 'Admin',
    date: '2024-06-10',
    priority: 'high'
  },
  {
    id: 2,
    title: 'New Study Resources Available',
    content: 'We have added new study resources to the library database. Students can access these materials through their student portal.',
    author: 'Library Staff',
    date: '2024-06-08',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Student ID Card Renewal',
    content: 'All students are required to renew their ID cards before the start of the next semester. Please visit the administration office with your current ID card.',
    author: 'Administration',
    date: '2024-06-05',
    priority: 'low'
  }
];

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const isModeratorOrAdmin = user?.role === 'moderator' || user?.role === 'admin';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Announcements</Title>
          {isModeratorOrAdmin && (
            <CreateButton>Create Announcement</CreateButton>
          )}
        </Header>

        {announcements.length === 0 ? (
          <NoAnnouncementsMessage>
            <p>No announcements available.</p>
          </NoAnnouncementsMessage>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id}>
              <AnnouncementHeader>
                <AnnouncementTitle>{announcement.title}</AnnouncementTitle>
                <AnnouncementMeta>
                  <span>By {announcement.author}</span>
                  <span>•</span>
                  <span>{formatDate(announcement.date)}</span>
                </AnnouncementMeta>
              </AnnouncementHeader>
              <AnnouncementContent>{announcement.content}</AnnouncementContent>
              {isModeratorOrAdmin && (
                <AnnouncementActions>
                  <ActionButton className="edit">Edit</ActionButton>
                  <ActionButton className="delete">Delete</ActionButton>
                </AnnouncementActions>
              )}
            </AnnouncementCard>
          ))
        )}
      </MainContent>
    </Container>
  );
};

export default Announcements; 