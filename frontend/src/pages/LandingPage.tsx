import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/system';
import { path } from '../utils/path';
import { FaRunning, FaAppleAlt, FaDumbbell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom, #4caf50, #2196f3)',
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const Icon = styled('div')({
  fontSize: '4rem',
  color: '#4caf50',
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#4caf50',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  padding: theme.spacing(2, 4),
  marginTop: '10px', // Added margin-top of 10 pixels
}));

const IconsContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(4),
  width: '100%',
  justifyItems: 'center',
}));

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <StyledContainer maxWidth={false}>
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
          mb: 6,
        }}
      >
        Track Your Fitness Journey
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          mb: 12,
        }}
      >
        Join our fitness tracking application and take the first step towards a
        healthier lifestyle.
      </Typography>

      <IconsContainer>
        <StyledCard>
          <CardContent>
            <Icon>
              <FaRunning />
            </Icon>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Track Workouts
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'gray', marginTop: '8px' }}
            >
              Monitor your workouts and progress in real-time.
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard>
          <CardContent>
            <Icon>
              <FaAppleAlt />
            </Icon>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Nutrition Plans
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'gray', marginTop: '8px' }}
            >
              Get personalized nutrition plans to fuel your workouts.
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard>
          <CardContent>
            <Icon>
              <FaDumbbell />
            </Icon>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Strength Tracking
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'gray', marginTop: '8px' }}
            >
              Monitor your strength gains and set new goals.
            </Typography>
          </CardContent>
        </StyledCard>
      </IconsContainer>

      <StyledButton
        variant="contained"
        size="large"
        onClick={() => navigate(path.LOGIN)}
      >
        Get Started
      </StyledButton>
    </StyledContainer>
  );
};

export default LandingPage;
