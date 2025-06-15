import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function FriendPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFriendId, setNewFriendId] = useState("");
  const [peopleYouTrack, setPeopleYouTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    // Animate header on load
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMenuPress = (option) => {
    setModalVisible(false);
    switch (option) {
      case "Home":
        navigation.navigate("Home");
        break;
      case "Map View":
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
    Alert.alert("Emergency", "Emergency services have been contacted.");
  };

  const handleAddFriend = () => {
    if (newFriendId.trim().length > 0) {
      Alert.alert(
        "Friend Request Sent", 
        `A friend request has been sent to ${newFriendId}. They will appear in your friends list once they accept.`,
        [
          {
            text: "OK",
            onPress: () => {
              setNewFriendId("");
              setAddFriendModalVisible(false);
            }
          }
        ]
      );
    }
  };

  const renderStatus = (color) => (
    <View style={[styles.statusContainer]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.dotPulse, { backgroundColor: color }]} />
    </View>
  );

  const API_URL = "https://your-backend-url.com/api/friends";

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Simulate API call with mock data - but show placeholder instead
        setTimeout(() => {
          // Setting empty array to show placeholder
          setPeopleYouTrack([]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setError("Unable to load friends list.");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const filteredPeople = peopleYouTrack.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriendCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={styles.avatarBorder} />
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {renderStatus(item.statusColor)}
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityIcon}>🏃</Text>
            <Text style={styles.details}>{item.activity}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.time}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Placeholder component for friends
  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>👥</Text>
      <Text style={styles.placeholderTitle}>Friends to be added soon</Text>
      <Text style={styles.placeholderSubtitle}>
        This feature is still in development. You'll be able to track your friends' locations here once it's ready!
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header with gradient background */}
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerBackground} />
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuButton}>
                <Text style={styles.menuText}>☰</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.header}>People You Track</Text>
                <Text style={styles.subtitle}>Coming soon...</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationText}>🔔</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>0</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Enhanced Search Input */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Friends List or Placeholder */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading friends...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : peopleYouTrack.length === 0 ? (
            renderPlaceholder()
          ) : (
            <FlatList
              data={filteredPeople}
              keyExtractor={(item) => item.name}
              renderItem={renderFriendCard}
              contentContainerStyle={styles.listContainer}
              style={styles.friendsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.addFriendButton, { width: screenWidth * 0.42 }]} 
              onPress={() => setAddFriendModalVisible(true)}
            >
              <Text style={styles.addFriendIcon}>👥</Text>
              <Text style={styles.addFriendText}>Add Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.emergencyBtn, { width: screenWidth * 0.42 }]} 
              onPress={handleEmergency}
            >
              <Text style={styles.emergencyIcon}>🚨</Text>
              <Text style={styles.emergencyText}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Enhanced Menu Modal with Consistent Styling */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
            <View style={styles.modalContainer}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Menu</Text>
              
              <View style={styles.modalContent}>
                {[
                  { name: "Home", icon: "🏠" },
                  { name: "Map View", icon: "🗺️" },
                  { name: "Settings", icon: "⚙️" }
                ].map((item) => (
                  <Pressable 
                    key={item.name} 
                    style={styles.modalItem} 
                    onPress={() => handleMenuPress(item.name)}
                  >
                    <View style={styles.modalIconContainer}>
                      <Text style={styles.modalItemIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.modalTextContainer}>
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      <Text style={styles.modalItemSubtext}>Navigate to {item.name.toLowerCase()}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Enhanced Add Friend Modal - Slides up from bottom */}
        <Modal
          animationType="slide"
          transparent
          visible={addFriendModalVisible}
          onRequestClose={() => setAddFriendModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable 
              style={styles.modalBackdrop} 
              onPress={() => setAddFriendModalVisible(false)} 
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.addFriendModalContainer}>
                <View style={styles.modalHandle} />
                
                <View style={styles.addFriendModalHeader}>
                  <Text style={styles.addFriendModalTitle}>Add New Friend</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseIcon}
                    onPress={() => setAddFriendModalVisible(false)}
                  >
                    <Text style={styles.modalCloseIconText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.addFriendDescription}>
                  Enter your friend's unique tracking ID to start following their location and activities
                </Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🆔</Text>
                  <TextInput
                    style={styles.addFriendInput}
                    placeholder="Enter friend's ID (e.g. @username or #12345)"
                    placeholderTextColor="#94a3b8"
                    value={newFriendId}
                    onChangeText={setNewFriendId}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={handleAddFriend}
                  />
                </View>
                
                <View style={styles.addFriendActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setNewFriendId("");
                      setAddFriendModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.addButton, 
                      { opacity: newFriendId.trim().length > 0 ? 1 : 0.5 }
                    ]}
                    disabled={newFriendId.trim().length === 0}
                    onPress={handleAddFriend}
                  >
                    <Text style={styles.addButtonText}>Add Friend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationText: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    height: 50,
    opacity: 0.5,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#64748B',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Placeholder styles
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  placeholderIcon: {
    fontSize: 80,
    marginBottom: 24,
    opacity: 0.6,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  friendsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },
  statusContainer: {
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dotPulse: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.6,
    transform: [{ scale: 1.5 }],
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  details: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 8,
  },
  moreButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  addFriendButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addFriendIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addFriendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  emergencyBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emergencyIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  // Consistent Modal Styles (from your provided styles)
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
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    maxHeight: height * 0.7,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 24,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalItemIconText: {
    fontSize: 18,
  },
  modalTextContainer: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  modalItemSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  modalClose: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  // Enhanced Add Friend Modal Styles
  keyboardAvoidingView: {
    justifyContent: 'flex-end',
  },
  addFriendModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    maxHeight: height * 0.6,
  },
  addFriendModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addFriendModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  modalCloseIconText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: 'bold',
  },
  addFriendDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minHeight: 56,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#64748B',
  },
  addFriendInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  addFriendActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
  });