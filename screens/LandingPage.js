import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LandingPage({ navigation }) {
  useEffect(() => {
    // Wait 2 seconds, then navigate to Login
    const timer = setTimeout(() => {
      navigation.navigate('Login'); // Make sure 'Login' matches your login screen name
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer if component unmounts early
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>78 tracking</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',  // Dark background, customize if you want
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#38BDF8',  // A nice blue color for the text
  },
});
