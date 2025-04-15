import React from 'react';
import { Box, Card, CardContent, Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';

const EventCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
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
});

const DateBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  background: 'white',
  padding: theme.spacing(2),
  textAlign: 'center',
  minWidth: '100px',
}));

const events = [
  {
    id: 1,
    title: 'Whitecliffe Fashion Week',
    date: { day: '24', month: 'JUN' },
    image: '/images/fashion-week.jpg',
  },
  {
    id: 2,
    title: 'Technology Exhibition',
    date: { day: '17', month: 'JUL' },
    image: '/images/tech-exhibition.jpg',
  },
  {
    id: 3,
    title: 'Design Innovation',
    date: { day: '25', month: 'OCT' },
    image: '/images/design-innovation.jpg',
  },
  {
    id: 4,
    title: 'Art Gallery Exhibition',
    date: { day: '24', month: 'DEC' },
    image: '/images/art-gallery.jpg',
  },
];

const Events = () => {
  return (
    <>
        <Navbar />
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Upcoming Events
      </Typography>
      
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} key={event.id}>
            <EventCard>
              <Box sx={{ width: '100%', position: 'relative' }}>
                <EventImage
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${event.image})`,
                  }}
                />
                <DateBox>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {event.date.day}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
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
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
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
