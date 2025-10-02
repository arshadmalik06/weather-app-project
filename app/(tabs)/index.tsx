import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, SafeAreaView, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import axios from 'axios';

// --- Paste your API key from OpenWeatherMap here ---
const API_KEY = "ENTER_API_KEY_FROM_OPENWEATHER";
const BASE_URL = `https://api.openweathermap.org/data/2.5`;

// --- Interfaces to define the structure of our data ---
// For current weather
interface WeatherData {
  name: string;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number; };
  weather: { main: string; description: string; icon: string; }[];
  wind: { speed: number; };
}

// NEW: For the 5-day forecast list items
interface ForecastItem {
  dt_txt: string;
  main: { temp: number; temp_min: number; temp_max: number; };
  weather: { main: string; icon: string; }[];
}

// --- Main App Component ---
export default function WeatherApp() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[] | null>(null); // NEW: State for forecast

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // MODIFIED: Fetch both current weather and forecast at the same time
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
          axios.get<WeatherData>(`${BASE_URL}/weather`, { params: { lat: latitude, lon: longitude, appid: API_KEY, units: 'metric' } }),
          axios.get<{ list: ForecastItem[] }>(`${BASE_URL}/forecast`, { params: { lat: latitude, lon: longitude, appid: API_KEY, units: 'metric' } })
        ]);

        setWeatherData(currentWeatherResponse.data);

        // NEW: Process the forecast data to get one entry per day
        const dailyForecasts = forecastResponse.data.list.filter(item =>
          item.dt_txt.includes("12:00:00") // Filter to get the forecast for midday
        );
        setForecastData(dailyForecasts);

      } catch (error) {
        console.error("Error fetching weather data:", error);
        setErrorMsg('Could not fetch weather data. Check your connection or API key.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // NEW: Helper function to get the day of the week from a date string
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  // --- Conditional Rendering for Loading/Error states ---
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#007BFF" /><Text style={styles.loadingText}>Fetching weather...</Text></View>;
  }
  if (errorMsg) {
    return <View style={styles.container}><Text style={styles.errorText}>{errorMsg}</Text></View>;
  }
  if (!weatherData) {
    return <View style={styles.container}><Text style={styles.errorText}>No weather data available.</Text></View>;
  }

  // --- Main App UI ---
  return (
    <SafeAreaView style={styles.container}>
      
      
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
       <Image
        source={require('/home/oem/weather-app-pro/assets/images/clublogo3.png')}
        style={styles.logo} 
        /> 
        
        {/* Current Weather Section */}
        <Text style={styles.locationName}>{weatherData.name}</Text>
        <View style={styles.weatherIconContainer}>
          <Image source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` }} style={styles.weatherIcon} />
          <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
        </View>
        <Text style={styles.weatherDescription}>{weatherData.weather[0].main}</Text>
        <Text style={styles.tempRange}>H: {Math.round(weatherData.main.temp_max)}°  L: {Math.round(weatherData.main.temp_min)}°</Text>
        
        {/* NEW: 5-Day Forecast Section */}
        {forecastData && (
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            {forecastData.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{getDayName(item.dt_txt)}</Text>
                <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }} style={styles.forecastIcon} />
                <Text style={styles.forecastTemps}>
                  {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles for all components ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0D1B2A', // Deep Space Blue
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  contentContainer: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 18, color: '#E0E0E0' },
  errorText: { fontSize: 18, color: '#FF6B6B', textAlign: 'center', paddingHorizontal: 20 },
  locationName: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#E0E0E0', // Starlight White
    marginBottom: 10, 
    textAlign: 'center' 
  },
  weatherIconContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weatherIcon: { width: 150, height: 150 },
  temperature: { 
    fontSize: 72, 
    fontWeight: '200', 
    color: '#33A1F2', // Electric Blue accent
    marginLeft: 10 
  },
  logo: {
    position: 'absolute', // This "lifts" the logo out of the normal layout flow
    top: 20,              // 50 pixels from the top of the screen
    right: 20,            // 20 pixels from the right of the screen
    width: 50,            // Set the width of the logo
    height: 60,           // Set the height of the logo
    zIndex: 10,           // Ensures the logo stays on top of other content
  },

  weatherDescription: { fontSize: 24, color: '#E0E0E0', textTransform: 'capitalize', marginBottom: 5 },
  tempRange: { fontSize: 18, color: '#94A3B8', marginBottom: 40 },
  forecastContainer: { width: '100%', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#334155' },
  forecastTitle: { fontSize: 22, fontWeight: 'bold', color: '#E0E0E0', marginBottom: 15, textAlign: 'center' },
  forecastItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#334155' },
  forecastDay: { fontSize: 18, color: '#E0E0E0', flex: 1 },
  forecastIcon: { width: 50, height: 50 },
  forecastTemps: { fontSize: 18, color: '#94A3B8', flex: 1, textAlign: 'right' },
});
