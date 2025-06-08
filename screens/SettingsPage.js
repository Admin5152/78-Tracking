import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { account } from '../lib/appwriteConfig';

const { width, height } = Dimensions.get('window');

export default function SettingsPage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await account.deleteSession('current');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Logout Failed', error.message || 'An error occurred while logging out.');
            }
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>LOADING USER INFORMATION PLEASE WAIT ... </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Settings Coming Soon...</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',  // brighter gray background
    paddingHorizontal: '5%',
    paddingTop: Platform.OS === 'android' ? 30 : 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: width * 0.045,
    color: '#6b7280',  // medium gray
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  backButton: {
    marginRight: 20,
    padding: 8,
  },
  backText: {
    fontSize: width * 0.08, // larger back arrow
    color: '#374151', // dark gray
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#111827', // almost black
  },
  infoBox: {
    backgroundColor: '#e5e7eb', // lighter gray box
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    color: '#6b7280',
    fontSize: width * 0.04,
    marginBottom: 6,
  },
  info: {
    color: '#111827',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  section: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#6b7280',
    fontSize: width * 0.045,
    fontStyle: 'italic',
  },
  logoutButton: {
    marginTop: height * 0.55,
    backgroundColor: '#ef4444', // bright red
    paddingVertical: height * 0.018,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
});
