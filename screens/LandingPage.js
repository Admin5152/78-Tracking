import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function LandingPage({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text style={styles.logoText}>
          <FontAwesome5 name="map-marker-alt" size={48} color="#1E293B" /> Tracker 78
        </Text>
        <Text style={styles.subtitle}>Share your location with the people you love.</Text>
        <ActivityIndicator size="large" color="#1E293B" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E293B', // Dark blue
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#475569', // Slate gray
    textAlign: 'center',
    marginBottom: 30,
  },
  loader: {
    marginTop: 10,
  },
});
