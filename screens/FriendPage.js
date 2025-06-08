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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FriendPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFriendId, setNewFriendId] = useState("");
  const [peopleYouTrack, setPeopleYouTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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

  const renderStatus = (color) => (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );

  const API_URL = "https://your-backend-url.com/api/friends";

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setPeopleYouTrack(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load friends list.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const filteredPeople = peopleYouTrack.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.header}>People You Track</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <FlatList
            data={filteredPeople}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    {renderStatus(item.statusColor)}
                  </View>
                  <Text style={styles.details}>{item.activity} • {item.location}</Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ flexGrow: 0, maxHeight: screenHeight * 0.55 }}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <TouchableOpacity style={[styles.addFriendButton, { width: screenWidth * 0.8 }]} onPress={() => setAddFriendModalVisible(true)}>
          <Text style={styles.addFriendText}>➕ Add Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.emergencyBtn, { width: screenWidth * 0.8 }]} onPress={handleEmergency}>
          <Text style={styles.emergencyText}>🚨 Emergency</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Menu</Text>
            {["Home", "Map View", "Settings"].map((item) => (
              <Pressable key={item} style={styles.modalItem} onPress={() => handleMenuPress(item)}>
                <Text style={styles.modalText}>
                  {item === "Home" && "🏠 "}
                  {item === "Map View" && "🗺️ "}
                  {item === "Settings" && "⚙️ "}
                  {item}
                </Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Friend Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={addFriendModalVisible}
        onRequestClose={() => setAddFriendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Friend</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter friend's ID"
              placeholderTextColor="#94a3b8"
              value={newFriendId}
              onChangeText={setNewFriendId}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                Alert.alert("Friend Added", `Tracking ID: ${newFriendId}`);
                setNewFriendId("");
                setAddFriendModalVisible(false);
              }}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAddFriendModalVisible(false)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // light gray background
    paddingHorizontal: '5%',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 12,
    padding: 10,
    backgroundColor: '#E2E8F0', // lighter button background
    borderRadius: 10,
  },
  menuText: {
    fontSize: 24,
    color: '#1E293B', // dark text for contrast
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  searchInput: {
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 12,
    color: '#1E293B',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  details: {
    fontSize: 14,
    color: '#475569',
  },
  time: {
    fontSize: 12,
    color: '#64748B',
  },
  addFriendButton: {
    marginTop: 550, // changed from 550 to relative spacing
    backgroundColor: '#3B82F6', // blue
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  addFriendText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emergencyBtn: {
    marginTop: 20,
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    alignSelf: 'center',
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1E293B',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomColor: '#CBD5E1',
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
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#10B981', // green
    paddingVertical: 550,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
