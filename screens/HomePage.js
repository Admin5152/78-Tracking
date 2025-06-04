import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function HomePage() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to view the map.');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => {
          setLocation(loc.coords);
          setLoading(false);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleMenuPress = (option) => {
    setModalVisible(false);
    switch (option) {
      case 'FriendPage':
        navigation.navigate('Friends');
        break;
      case 'Home':
        navigation.navigate('Home');
        break;
      case 'MapPage':
        navigation.navigate('MapPage');
        break;
      case 'Settings':
        navigation.navigate('Settings');
        break;
      default:
        Alert.alert(`You pressed ${option}`);
    }
  };

  const handleEmergency = () => {
    Alert.alert('🚨 Emergency Alert', 'Emergency services have been contacted.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Tracker App</Text>
      </View>

      {/* Content Box */}
      <View style={styles.contentBox}>
        <Text style={styles.welcomeText}>Welcome 👋</Text>
        <Text style={styles.contentText}>
          Use the menu to explore features like the map, friends list, and settings.
        </Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {loading || !location ? (
          <ActivityIndicator size="large" color="#38bdf8" />
        ) : (
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="You are here"
              pinColor="blue"
            />
          </MapView>
        )}
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency}>
        <Text style={styles.emergencyText}>🚨 Tap for Emergency</Text>
      </TouchableOpacity>

      {/* Modal Menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Navigation Menu</Text>

            <Pressable style={styles.modalItem} onPress={() => handleMenuPress('MapPage')}>
              <Text style={styles.modalText}>🗺️ Map View</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress('FriendPage')}>
              <Text style={styles.modalText}>👥 Friends</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress('Settings')}>
              <Text style={styles.modalText}>⚙️ Settings</Text>
            </Pressable>
            <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>✖ Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  mapContainer: {
    height: '40%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  menuButton: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#1E293B',
    borderRadius: 10,
  },
  menuText: {
    fontSize: 24,
    color: '#F8FAFC',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  contentBox: {
    backgroundColor: '#1E293B',
    padding: 25,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentText: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 22,
  },
  emergencyBtn: {
    marginTop: 50,
    backgroundColor: '#DC2626',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#0F172A',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  modalText: {
    fontSize: 18,
    color: '#1E293B',
  },
  modalClose: {
    marginTop: 25,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
