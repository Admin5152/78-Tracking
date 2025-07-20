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
import { account } from '../lib/appwriteConfig';

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
        setUsername('there');
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
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Hi {username}! 👋</Text>
          <Text style={styles.subtext}>
            Ready to join or create your <Text style={styles.highlight}>Circle</Text>?
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/Family.png')}
            style={styles.familyImage}
            accessible
            accessibilityLabel="Family illustration"
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            A Circle is your family's private space to share moments, 
            stay connected, and create lasting memories together.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
  },
  highlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
  imageContainer: {
    marginBottom: 48,
  },
  familyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    marginBottom: 48,
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});