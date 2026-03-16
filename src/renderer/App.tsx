import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { WeatherData, GroupedWeatherData } from './types';

const API_URL = 'http://localhost:3000/api/weather';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<GroupedWeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<WeatherData[]>(API_URL);
      const grouped = groupByLocation(response.data);
      setWeatherData(grouped);
    } catch (err) {
      setError('Не вдалося завантажити дані. Перевірте, чи працює API сервер.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupByLocation = (data: WeatherData[]): GroupedWeatherData[] => {
    const grouped: { [key: string]: GroupedWeatherData } = {};

    data.forEach((item) => {
      if (!grouped[item.location]) {
        grouped[item.location] = {
          location: item.location,
          forecasts: [],
        };
      }

      if (item.type === 'current') {
        grouped[item.location].current = item;
      } else {
        grouped[item.location].forecasts.push(item);
      }
    });

    return Object.values(grouped);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(22, 33, 62, 0.9)' }}>
        <Toolbar>
          <WbSunnyIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Погода в Україні
          </Typography>
          <Button
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={fetchWeatherData}
            disabled={loading}
          >
            Оновити
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && weatherData.length === 0 && (
          <Alert severity="info">
            Немає даних для відображення. Натисніть "Оновити" для завантаження.
          </Alert>
        )}

        <Grid container spacing={3}>
          {weatherData.map((cityData, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  background: 'rgba(22, 33, 62, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  {/* Заголовок з назвою міста */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: '#667eea' }} />
                    <Typography variant="h5" component="div" fontWeight="bold">
                      {cityData.location}
                    </Typography>
                  </Box>

                  {/* Поточна погода */}
                  {cityData.current && (
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="overline" sx={{ color: '#a0a0a0' }}>
                        Зараз
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ThermostatIcon sx={{ mr: 1, color: '#ff6b6b' }} />
                            <Typography variant="h3" fontWeight="bold">
                              {cityData.current.temperature}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                            {cityData.current.condition}
                          </Typography>
                        </Box>
                        <WbSunnyIcon sx={{ fontSize: 64, color: '#ffd93d', opacity: 0.8 }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: '#a0a0a0' }} />
                          <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
                            {cityData.current.date}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#a0a0a0' }} />
                          <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
                            {cityData.current.time}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Прогноз */}
                  {cityData.forecasts.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <Typography variant="overline" sx={{ color: '#a0a0a0', mb: 1, display: 'block' }}>
                        Прогноз
                      </Typography>
                      {cityData.forecasts.map((forecast, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            mb: 1,
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.08)',
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {forecast.date} {forecast.time}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              {forecast.condition}
                            </Typography>
                          </Box>
                          <Chip
                            label={forecast.temperature}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default App;
