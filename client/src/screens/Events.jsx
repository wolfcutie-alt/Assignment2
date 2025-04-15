import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getImagePath } from '../utils/imageUtils';
import Navbar from '../components/Navbar';

const EventCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  minHeight: '200px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
}));

const EventImage = styled('div')({
  width: '100%',
  height: '200px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#f0f0f0',
  position: 'relative',
});

const DateBox = styled(Box)({
  position: 'absolute',
  right: '20px',
  top: '20px',
  background: 'white',
  padding: '15px',
  textAlign: 'center',
  minWidth: '80px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
});

const EventOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))',
  zIndex: 1,
});

const events = [
  {
    id: 1,
    title: 'Whitecliffe Fashion Week',
    date: { day: '24', month: 'JUN' },
    image: getImagePath('fashion-week.png'),
  },
  {
    id: 2,
    title: 'Technology Exhibition',
    date: { day: '17', month: 'JUL' },
    image: getImagePath('tech-exhibition.png'),
  },
  {
    id: 3,
    title: 'Design Innovation',
    date: { day: '25', month: 'OCT' },
    image: getImagePath('design-innovation.png'),
  },
  {
    id: 4,
    title: 'Art Gallery Exhibition',
    date: { day: '24', month: 'DEC' },
    image: getImagePath('art-gallery.png'),
  },
];

const Events = () => {
  const [imageLoadStatus, setImageLoadStatus] = useState({});

  useEffect(() => {
    // Preload images and check if they exist
    events.forEach(event => {
      const img = new Image();
      img.onload = () => {
        setImageLoadStatus(prev => ({
          ...prev,
          [event.id]: true
        }));
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${event.image}`);
        setImageLoadStatus(prev => ({
          ...prev,
          [event.id]: false
        }));
      };
      img.src = event.image;
    });
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Upcoming Events
        </Typography>
        
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} key={event.id}>
              <EventCard>
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <EventImage
                    style={{
                      backgroundImage: imageLoadStatus[event.id] 
                        ? `url(${event.image})`
                        : 'linear-gradient(45deg, #f0f0f0 25%, #e0e0e0 25%, #e0e0e0 50%, #f0f0f0 50%, #f0f0f0 75%, #e0e0e0 75%, #e0e0e0)',
                      backgroundSize: imageLoadStatus[event.id] ? 'cover' : '20px 20px',
                    }}
                  />
                  <EventOverlay />
                  <DateBox>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {event.date.day}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#666' }}>
                      {event.date.month}
                    </Typography>
                  </DateBox>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                  </Box>
                </Box>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Events;
