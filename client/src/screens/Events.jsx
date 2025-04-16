import React from 'react';
import { Box, Card, Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';

const EventCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const EventImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
});

const ImageOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
  zIndex: 1,
});

const DateBox = styled(Box)({
  position: 'absolute',
  right: '24px',
  top: '24px',
  background: 'white',
  padding: '16px',
  borderRadius: '12px',
  textAlign: 'center',
  minWidth: '80px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  zIndex: 2,
});

const EventContent = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '24px',
  color: 'white',
  zIndex: 2,
});

const events = [
  {
    id: 1,
    title: 'Whitecliffe Fashion Week',
    date: { day: '24', month: 'JUN' },
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Technology Exhibition',
    date: { day: '17', month: 'JUL' },
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Design Innovation',
    date: { day: '25', month: 'OCT' },
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Art Gallery Exhibition',
    date: { day: '24', month: 'DEC' },
    image: 'https://images.unsplash.com/photo-1594799295965-1c8ed10d05e7?auto=format&fit=crop&w=1200&q=80'
  }
];

const Events = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1a1a1a'
          }}
        >
          Upcoming Events
        </Typography>
        
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={6} key={event.id}>
              <EventCard elevation={0}>
                <EventImage 
                  src={event.image} 
                  alt={event.title}
                  loading="lazy"
                />
                <ImageOverlay />
                <DateBox>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1a1a1a',
                    fontSize: '1.75rem',
                    lineHeight: 1
                  }}>
                    {event.date.day}
                  </Typography>
                  <Typography sx={{ 
                    color: '#666',
                    fontWeight: 500,
                    marginTop: '4px'
                  }}>
                    {event.date.month}
                  </Typography>
                </DateBox>
                <EventContent>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {event.title}
                  </Typography>
                </EventContent>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Events;
