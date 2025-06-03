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
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation

export default function FriendPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [peopleYouTrack, setPeopleYouTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation(); // ✅ Get navigation object

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
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
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
        <ActivityIndicator size="large" color="#fff" />
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
        />
      )}

      <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency}>
        <Text style={styles.emergencyText}>🚨 Emergency</Text>
      </TouchableOpacity>

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
            <Pressable style={styles.modalItem} onPress={() => handleMenuPress("Map View")}>
              <Text style={styles.modalText}>🗺️ Map View</Text>
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

// ... (styles unchanged)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 40,
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
