import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions, Platform, 
  Settings
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { account } from '../lib/appwriteConfig';

const { width, height } = Dimensions.get('window');

export default function SettingsPage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred while fetching user data.');
      } finally {
        setLoading(false);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header always visible */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>LOADING USER INFORMATION</Text>
            <Text style={styles.loadingSubText}>Please wait...</Text>
          </View>
        </View>
      ) : user ? (
        <>
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
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load user information</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setLoading(true);
            // Retry logic here
          }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',  // slightly brighter background
    paddingHorizontal: '5%',
    paddingTop: Platform.OS === 'android' ? 30 : 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backText: {
    fontSize: width * 0.07,
    color: '#475569',
    fontWeight: '600',
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.08,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingText: {
    fontSize: width * 0.045,
    color: '#475569',
    fontWeight: '700',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: width * 0.035,
    color: '#64748b',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    borderRadius: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    color: '#64748b',
    fontSize: width * 0.04,
    marginBottom: 8,
    fontWeight: '500',
  },
  info: {
    color: '#0f172a',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  section: {
    marginTop: height * 0.04,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: width * 0.045,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: height * 0.55,
    backgroundColor: '#dc2626',
    paddingVertical: height * 0.02,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#b91c1c',
    paddingHorizontal: width * 0.1,
    marginHorizontal: width * 0.05,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    letterSpacing: 0.5,
    paddingHorizontal: width * 0.1,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: width * 0.045,
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: width * 0.04,
  },
});




// more Settings:
// about
//chat support
// edit account make bigg