import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
  Dimensions,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function MapPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to view the map.');
        return;
      }

      subscription = await Location.watchPositionAsync(
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
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleMenuPress = (option) => {
    setModalVisible(false);
    switch (option) {
      case "FriendPage":
        navigation.navigate("Friends");
        break;
      case "Home":
        navigation.navigate("Home");
        break;
      case "MapPage":
        navigation.navigate("MapPage");
        break;
      case "Settings":
        navigation.navigate("Settings");
        break;
      default:
        Alert.alert(`You pressed ${option}`);
    }
  };

  const handleEmergency = () => {
    Alert.alert("Emergency", "Emergency services have been contacted!");
  };

  if (loading || !location) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loaderText}>Fetching your live location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Map View</Text>
      </View>

     {/* Map */}
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />
      </MapView>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency}>
        <Text style={styles.emergencyText}>🚨 Emergency</Text>
      </TouchableOpacity>

      {/* Slide-Up Modal Menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Menu</Text>
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress("Home")}>
              <Text style={styles.modalText}>🏠 Home</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress("FriendPage")}>
              <Text style={styles.modalText}>👥 Friends</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress("Settings")}>
              <Text style={styles.modalText}>⚙️ Settings</Text>
            </Pressable>
            <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  loader: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: '#1E293B',
    fontSize: 16,
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
  },
  menuText: {
    fontSize: 24,
    color: '#0F172A',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  emergencyBtn: {
    position: 'absolute',
    bottom: height * 0.05,
    left: width * 0.1,
    right: width * 0.1,
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#EF4444',
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
