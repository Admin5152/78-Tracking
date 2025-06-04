import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { account } from '../lib/appwriteConfig'; // ✅ Import Appwrite account instance

export default function SettingsPage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await account.get(); // Get current logged-in user's data
        setUser(response); // Set the user data
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []); // Fetch user data on component mount

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await account.deleteSession('current'); // ✅ Terminate session
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Logout Failed', error.message || 'An error occurred while logging out.');
            }
          },
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.info}>LOADING USER INFORMATION PLEASE WAIT ... </Text>
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
        {/* <Text style={styles.label}>Name:</Text>
        <Text style={styles.info}>{user.name}</Text> */}
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
    backgroundColor: '#0F172A',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    fontSize: 26,
    color: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
  },
  info: {
    color: '#f1f5f9',
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    marginTop: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: 16,
    fontStyle: 'italic',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
