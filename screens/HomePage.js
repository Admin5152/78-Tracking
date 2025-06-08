import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const HomePage = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
    })();
  }, []);

  const handleEmergency = () => {
      Alert.alert("Emergency", "Emergency services have been contacted!");
    };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F1F5F9" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuBtn}>
          <Ionicons name="menu" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hi there</Text>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>Welcome Back!</Text>
        <Text style={styles.greetingSubtext}>Stay safe out there.</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0EA5E9" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : (
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    {location && (
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="You are here"
        pinColor="blue"
      />
    )}
  </MapView>
        )}
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency}>
              <Text style={styles.emergencyText}>🚨 Emergency</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Menu</Text>

            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('MapPage')}>
              <Text style={styles.modalItemText}>🗺️ Map</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Friends')}>
              <Text style={styles.modalItemText}>👥 Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.modalItemText}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomePage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // light gray
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuBtn: {
    marginRight: 15,
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  greetingBox: {
    backgroundColor: '#E2E8F0',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    color: '#0EA5E9',
    fontWeight: '600',
    marginBottom: 5,
  },
  greetingSubtext: {
    fontSize: 15,
    color: '#334155',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#334155',
  },
  emergencyBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 18,
    color: '#0F172A',
  },
  modalClose: {
    marginTop: 24,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: 'bold',
  },
});
