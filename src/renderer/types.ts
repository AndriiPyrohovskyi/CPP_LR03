export interface WeatherData {
  type: 'current' | 'hourly_forecast';
  location: string;
  temperature: string;
  condition: string;
  date: string;
  time: string;
}

export interface GroupedWeatherData {
  location: string;
  current?: WeatherData;
  forecasts: WeatherData[];
}
