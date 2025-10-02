import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Image 
        source={require('/home/oem/weather-app-pro/assets/images/clublogo4.jpg')} 
        style={styles.profileImage} 
      /> 
      

      <Text style={styles.nameText}>
        CODEKRAFTERS
      </Text>
      
      <Text style={styles.bioText}>
        SRM RMP
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Project Details</Text>
        <Text style={styles.infoContent}>- Framework: React Native with Expo</Text>
        <Text style={styles.infoContent}>- API: OpenWeatherMap API</Text>
        <Text style={styles.infoContent}>- Features: Real-time weather, 5-day forecast, and custom UI.</Text>
        <Text style={styles.infoContent}>- Made by Arshad Malik S </Text>
      </View>

    </SafeAreaView>
  );
}

// --- Styles for Your Explore Page ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light, clean background
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // This makes the image a circle
    borderWidth: 3,
    borderColor: '#4169E1',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F4F4F', // Dark Slate text
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#696969', // Dim Gray text
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    // Add a subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4169E1',
    marginBottom: 10,
  },
  infoContent: {
    fontSize: 16,
    color: '#2F4F4F',
    lineHeight: 24, // Adds some space between lines
  },
});
