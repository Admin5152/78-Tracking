import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { account } from '../lib/appwriteConfig'; // Update path if needed

export default function FamilyIntroPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUsername(user.prefs.username || 'there');
      } catch (error) {
        console.log('Error fetching user:', error);
        setUsername('there'); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>Hi {username}!</Text>
        <Text style={styles.subtext}>
          Now you can join or create your <Text style={styles.bold}>Circle</Text>
        </Text>

        <View style={{ marginVertical: 24 }}>
          <Image
            source={require('../assets/Family.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain' }}
            accessible
            accessibilityLabel="Family illustration"
          />
        </View>

        <Text style={styles.description}>
          A Circle is a private space only accessible by you and your family.
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home')} // 🔁 Navigates to 'Home' page
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inner: {
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 8,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
