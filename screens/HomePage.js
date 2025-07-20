import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  RefreshControl,
  Animated,
  Easing
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

// Device type detection
const isTablet = width >= 768;
const isSmallScreen = width < 375;

// Constants
const LOCATION_TIMEOUT = 10000; // 10 seconds
const TIME_UPDATE_INTERVAL = 30000; // 30 seconds (more reasonable than 1 minute)

const HomePage = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [locationName, setLocationName] = useState('Current Location');
  const [weatherData, setWeatherData] = useState({ temp: '25°C', condition: 'Sunny' });
  const [locationError, setLocationError] = useState(false);
  
  // Animation values
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(-20), []);

  // Memoized greeting to prevent unnecessary re-renders
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
  }, []);

  // Update time and date
  const updateDateTime = useCallback(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const dateString = now.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
    setCurrentTime(timeString);
    setCurrentDate(dateString);
  }, []);

  // Get location with better error handling
  const getLocation = useCallback(async () => {
    try {
      setLocationError(false);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        setLocationName('Location permission denied');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: LOCATION_TIMEOUT,
      });

      const { latitude, longitude } = locationData.coords;
      setLocation(locationData.coords);
      
      // Reverse geocode with timeout
      const geocodePromise = Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Geocoding timeout')), 5000)
      );

      try {
        const geocode = await Promise.race([geocodePromise, timeoutPromise]);
        
        if (geocode.length > 0) {
          const { city, region, country } = geocode[0];
          if (city && region) {
            setLocationName(`${city}, ${region}`);
          } else if (city) {
            setLocationName(city);
          } else if (region) {
            setLocationName(region);
          } else if (country) {
            setLocationName(country);
          }
        }
      } catch (geocodeError) {
        console.log('Geocoding failed:', geocodeError);
        setLocationName('Location found');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(true);
      setLocationName('Location unavailable');
    }
  }, []);

  // Initialize component
  useEffect(() => {
    const initializeApp = async () => {
      updateDateTime();
      await getLocation();
      setLoading(false);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    initializeApp();

    const timeInterval = setInterval(updateDateTime, TIME_UPDATE_INTERVAL);
    return () => clearInterval(timeInterval);
  }, [updateDateTime, getLocation, fadeAnim, slideAnim]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    updateDateTime();
    await getLocation();
    setRefreshing(false);
  }, [updateDateTime, getLocation]);

  // Enhanced emergency handler
  const handleEmergency = useCallback(() => {
    Alert.alert(
      "Emergency Alert", 
      "Are you sure you want to contact emergency services?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Call Now", 
          style: "destructive",
          onPress: () => {
            // In a real app, this would make an actual emergency call
            Linking.openURL('tel:0531771042');
            Alert.alert("Emergency", "Emergency services have been contacted!");
          }
        }
      ]
    );
  }, []);

  // Menu handler with haptic feedback
  const handleMenuPress = useCallback((screen) => {
    setModalVisible(false);
    // Add slight delay for modal animation
    setTimeout(() => {
      navigation.navigate(screen);
    }, 200);
  }, [navigation]);

  // Quick actions data
  const quickActions = useMemo(() => [
    {
      id: 'map',
      icon: 'map-outline',
      color: '#0EA5E9',
      text: 'Map View',
      screen: 'MapPage',
      accessibilityLabel: 'Open map view'
    },
    {
      id: 'friends',
      icon: 'people-outline',
      color: '#8B5CF6',
      text: 'Friends',
      screen: 'Friends',
      accessibilityLabel: 'View friends list'
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      color: '#10B981',
      text: 'Settings',
      screen: 'Settings',
      accessibilityLabel: 'Open settings'
    },
    {
      id: 'safety',
      icon: 'shield-checkmark-outline',
      color: '#F59E0B',
      text: 'Safety',
      screen: 'SafetyPage',
      accessibilityLabel: 'View safety features'
    }
  ], []);

  // Render action card
  const renderActionCard = useCallback(({ item }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.actionCard} 
      onPress={() => navigation.navigate(item.screen)}
      accessible={true}
      accessibilityLabel={item.accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon} size={wp(6)} color={item.color} />
      </View>
      <Text style={styles.actionText}>{item.text}</Text>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      
      <Animated.View style={[
        { flex: 1 },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0EA5E9']}
              tintColor="#0EA5E9"
            />
          }
        >
          {/* Enhanced Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)} 
                style={styles.menuBtn}
                accessible={true}
                accessibilityLabel="Open menu"
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <Ionicons name="menu" size={wp(5.5)} color="#475569" />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Hi there</Text>
                <Text style={styles.headerSubtitle}>{currentDate}</Text>
                <Text style={styles.headerTime}>{currentTime}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.notificationBtn}
                accessible={true}
                accessibilityLabel="View notifications"
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={wp(5.5)} color="#475569" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Greeting Card */}
          <View style={styles.greetingCard}>
            <View style={styles.greetingContent}>
              <View style={styles.greetingTextContainer}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.greetingSubtext}>Stay safe and connected today.</Text>
              </View>
              <View style={styles.greetingIcon}>
                <Text style={styles.greetingEmoji}>👋</Text>
              </View>
            </View>
            <View style={styles.weatherInfo}>
              <View style={styles.weatherItem}>
                <Ionicons name="sunny-outline" size={wp(4)} color="#F59E0B" />
                <Text style={styles.weatherText}>{weatherData.condition}, {weatherData.temp}</Text>
              </View>
              <View style={styles.locationItem}>
                <Ionicons name="location-outline" size={wp(4)} color="#64748B" />
                <Text style={styles.weatherText} numberOfLines={1}>{locationName}</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {quickActions.map((action) => renderActionCard({ item: action }))}
            </View>
          </View>

          {/* Enhanced Map Preview */}
          <View style={styles.mapSection}>
            <View style={styles.mapHeader}>
              <Text style={styles.sectionTitle}>Your Location</Text>
              <TouchableOpacity 
                style={styles.fullscreenBtn}
                onPress={() => navigation.navigate('MapPage')}
                accessible={true}
                accessibilityLabel="Expand map view"
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <Ionicons name="expand-outline" size={wp(4.5)} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapContainer}>
              {loading ? (
                <View style={styles.loaderContainer}>
                  <View style={styles.loaderContent}>
                    <ActivityIndicator size="large" color="#0EA5E9" />
                    <Text style={styles.loadingText}>Loading your location...</Text>
                  </View>
                </View>
              ) : locationError ? (
                <View style={styles.errorContainer}>
                  <View style={styles.errorContent}>
                    <Ionicons name="location-outline" size={wp(8)} color="#94A3B8" />
                    <Text style={styles.errorText}>Location unavailable</Text>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={() => {
                        setLoading(true);
                        getLocation().finally(() => setLoading(false));
                      }}
                    >
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
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
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  showsUserLocation={true}
                  showsMyLocationButton={false}
                >
                  {location && (
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      title="You are here"
                      description={locationName}
                    />
                  )}
                </MapView>
              )}
              <TouchableOpacity 
                style={styles.mapOverlay}
                onPress={() => navigation.navigate('MapPage')}
                accessible={true}
                accessibilityLabel="Tap to expand map"
                accessibilityRole="button"
                activeOpacity={0.8}
              >
                <View style={styles.mapOverlayContent}>
                  <Ionicons name="expand-outline" size={wp(5)} color="#FFFFFF" />
                  <Text style={styles.mapOverlayText}>Tap to expand</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Emergency Button */}
          <TouchableOpacity 
            style={styles.emergencyBtn} 
            onPress={handleEmergency}
            accessible={true}
            accessibilityLabel="Emergency button - tap for immediate help"
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <View style={styles.emergencyContent}>
              <View style={styles.emergencyIcon}>
                <Ionicons name="warning" size={wp(6)} color="#FFFFFF" />
              </View>
              <View style={styles.emergencyTextContainer}>
                <Text style={styles.emergencyText}>Emergency</Text>
                <Text style={styles.emergencySubtext}>Tap for immediate help</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Enhanced Modal */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => setModalVisible(false)}
            accessible={true}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Menu</Text>

            <View style={styles.menuGrid}>
              <Pressable 
                style={styles.modalItem} 
                onPress={() => handleMenuPress('MapPage')}
                accessible={true}
                accessibilityLabel="Go to map view"
                accessibilityRole="button"
                android_ripple={{ color: '#E2E8F0' }}
              >
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>🗺️</Text>
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>Map View</Text>
                  <Text style={styles.modalSubtext}>View you and your friends' locations</Text>
                </View>
              </Pressable>
              
              <Pressable 
                style={styles.modalItem} 
                onPress={() => handleMenuPress('Friends')}
                accessible={true}
                accessibilityLabel="Go to friends list"
                accessibilityRole="button"
                android_ripple={{ color: '#E2E8F0' }}
              >
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>👥</Text>
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>Friends</Text>
                  <Text style={styles.modalSubtext}>Your network</Text>
                </View>
              </Pressable>

              <Pressable 
                style={styles.modalItem} 
                onPress={() => handleMenuPress('Settings')}
                accessible={true}
                accessibilityLabel="Go to settings"
                accessibilityRole="button"
                android_ripple={{ color: '#E2E8F0' }}
              >
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>⚙️</Text>
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>Settings</Text>
                  <Text style={styles.modalSubtext}>App preferences</Text>
                </View>
              </Pressable>

              {/* <Pressable 
                style={styles.modalItem} 
                onPress={() => handleMenuPress('SafetyPage')}
                accessible={true}
                accessibilityLabel="Go to safety features"
                accessibilityRole="button"
                android_ripple={{ color: '#E2E8F0' }}
              >
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>🛡️</Text>
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>Safety</Text>
                  <Text style={styles.modalSubtext}>Safety features and alerts</Text>
                </View>
              </Pressable> */}
            </View>
            
            <Pressable 
              style={styles.modalClose} 
              onPress={() => setModalVisible(false)}
              accessible={true}
              accessibilityLabel="Close menu"
              accessibilityRole="button"
              android_ripple={{ color: '#E2E8F0' }}
            >
              <Text style={styles.modalCloseText}>Close Menu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuBtn: {
    marginRight: wp(4),
    backgroundColor: '#FFFFFF',
    padding: wp(3),
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isTablet ? wp(5) : wp(6),
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: hp(0.2),
  },
  headerSubtitle: {
    fontSize: isTablet ? wp(3.2) : wp(3.5),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: hp(0.2),
  },
  headerTime: {
    fontSize: isTablet ? wp(3) : wp(3.2),
    color: '#94A3B8',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    backgroundColor: '#FFFFFF',
    padding: wp(3),
    borderRadius: wp(3),
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#EF4444',
  },
  greetingCard: {
    backgroundColor: '#FFFFFF',
    padding: wp(5),
    borderRadius: wp(5),
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  greetingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: isTablet ? wp(4.5) : wp(5.5),
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  greetingSubtext: {
    fontSize: isTablet ? wp(3.2) : wp(3.8),
    color: '#64748B',
    fontWeight: '500',
  },
  greetingIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingEmoji: {
    fontSize: wp(6),
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  weatherText: {
    fontSize: isTablet ? wp(3) : wp(3.5),
    color: '#64748B',
    marginLeft: wp(1.5),
    fontWeight: '500',
  },
  quickActions: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: isTablet ? wp(4) : wp(4.5),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: hp(2),
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: isTablet ? (wp(90) - wp(7)) / 4 : (wp(90) - wp(5)) / 2,
    backgroundColor: '#FFFFFF',
    padding: wp(5),
    borderRadius: wp(4),
    alignItems: 'center',
    marginBottom: hp(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: hp(12),
    justifyContent: 'center',
  },
  actionIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  actionText: {
    fontSize: isTablet ? wp(3) : wp(3.5),
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  mapSection: {
    marginBottom: hp(3),
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  fullscreenBtn: {
    padding: wp(2),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mapContainer: {
    height: isTablet ? hp(30) : hp(25),
    borderRadius: wp(4),
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loaderContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(1.5),
    color: '#64748B',
    fontWeight: '500',
    fontSize: wp(3.5),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorContent: {
    alignItems: 'center',
  },
  errorText: {
    marginTop: hp(1),
    color: '#94A3B8',
    fontWeight: '500',
    fontSize: wp(3.5),
  },
  retryButton: {
    marginTop: hp(1),
    backgroundColor: '#0EA5E9',
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    borderRadius: wp(2),
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: wp(3.5),
  },
  mapOverlay: {
    position: 'absolute',
    bottom: wp(3),
    right: wp(3),
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderRadius: wp(5),
  },
  mapOverlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: '#FFFFFF',
    fontSize: wp(3),
    fontWeight: '600',
    marginLeft: wp(1),
  },
  emergencyBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(5),
    borderRadius: wp(4),
    marginBottom: hp(2),
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIcon: {
    marginRight: wp(3),
  },
  emergencyTextContainer: {
    alignItems: 'center',
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: isTablet ? wp(4) : wp(4.5),
    marginBottom: hp(0.3),
  },
  emergencySubtext: {
    color: '#FECACA',
    fontSize: wp(3),
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: wp(6),
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    maxHeight: hp(80),
  },
  modalHandle: {
    width: wp(10),
    height: hp(0.5),
    backgroundColor: '#E2E8F0',
    borderRadius: wp(0.5),
    alignSelf: 'center',
    marginBottom: hp(2.5),
  },
  modalTitle: {
    fontSize: isTablet ? wp(4.5) : wp(5.5),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: hp(3),
    textAlign: 'center',
  },
  menuGrid: {
    marginBottom: hp(3),
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(1),
    backgroundColor: '#F8FAFC',
    minHeight: hp(8),
  },
  modalIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalIcon: {
    fontSize: wp(5),
  },
  modalTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalText: {
    fontSize: isTablet ? wp(3.8) : wp(4.5),
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: hp(0.3),
  },
  modalSubtext: {
    fontSize: isTablet ? wp(2.8) : wp(3),
    color: '#64748B',
  },
  modalClose: {
    alignItems: 'center',
    paddingVertical: hp(2),
    backgroundColor: '#F1F5F9',
    borderRadius: wp(3),
    marginTop: hp(2),
  },
  modalCloseText: {
    fontSize: isTablet ? wp(3.5) : wp(4),
    color: '#DC2626',
    fontWeight: '600',
  },
});