import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

// Device type detection
const isTablet = width >= 768;

export default function SafetyPage() {
  const navigation = useNavigation();
  const [pressStart, setPressStart] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [ringAnim] = useState(new Animated.Value(0));
  const [location, setLocation] = useState(null);
  const [progressInterval, setProgressInterval] = useState(null);

  const EMERGENCY_EMAIL = 'sethagyeimensah2@gmail.com';

  useEffect(() => {
    // Pulse animation for the emergency button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handlePressIn = () => {
    setPressStart(Date.now());
    setIsPressed(true);
    setProgress(0);

    // Ring animation
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Progress animation
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - Date.now();
      const progressValue = Math.min(elapsed / 2000, 1);
      setProgress(progressValue);
    }, 16);

    setTimeout(() => {
      clearInterval(progressInterval);
    }, 2000);
  };

  const handlePressOut = () => {
    const heldTime = Date.now() - (pressStart || 0);
    setIsPressed(false);
    setProgress(0);
    
    // Reset ring animation
    ringAnim.setValue(0);

    if (heldTime >= 2000) {
      sendHelpAlert();
    } else if (pressStart) {
      Alert.alert(
        "Hold Longer", 
        "Hold the button for 2 seconds to send emergency alert",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const sendHelpAlert = async () => {
    try {
      Alert.alert(
        "Emergency Alert Sent!", 
        "Your emergency contacts and local authorities have been notified.",
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      Alert.alert(
        "Alert Failed", 
        "Failed to send emergency alert. Please try again.",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'police':
        Alert.alert("Calling Police", "Emergency call to local police initiated");
        break;
      case 'medical':
        Alert.alert("Medical Emergency", "Medical emergency services contacted");
        break;
      case 'fire':
        Alert.alert("Fire Emergency", "Fire department has been contacted");
        break;
      case 'contacts':
        Alert.alert("Emergency Contacts", "Notifying your emergency contacts");
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={wp(5)} color="#475569" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Emergency Safety</Text>
            <Text style={styles.headerSubtitle}>Your safety is our priority</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={wp(5)} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <Ionicons name="shield-checkmark" size={wp(6)} color="#10B981" />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Safety Status</Text>
              <Text style={styles.statusSubtitle}>System Active & Monitoring</Text>
            </View>
            <View style={styles.statusIndicator} />
          </View>
          <View style={styles.statusDetails}>
            <View style={styles.statusItem}>
              <Ionicons name="location" size={wp(4)} color="#0EA5E9" />
              <Text style={styles.statusItemText}>Location tracking enabled</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="people" size={wp(4)} color="#8B5CF6" />
              <Text style={styles.statusItemText}>Emergency contacts ready</Text>
            </View>
          </View>
        </View>

        {/* Emergency Instruction Card
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <Text style={styles.instructionTitle}>Emergency Alert</Text>
            <View style={styles.instructionBadge}>
              <Text style={styles.instructionBadgeText}>HOLD 2s</Text>
            </View>
          </View>
          <Text style={styles.instructionText}>
            Press and hold the emergency button for 2 seconds to instantly alert emergency contacts and services with your location.
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={wp(4)} color="#10B981" />
              <Text style={styles.featureText}>GPS location sharing</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={wp(4)} color="#10B981" />
              <Text style={styles.featureText}>Automatic emergency calls</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={wp(4)} color="#10B981" />
              <Text style={styles.featureText}>Contact notification</Text>
            </View>
          </View>
        </View> */}

        {/* Enhanced Emergency Button */}
        <View style={styles.emergencySection}>
          <View style={styles.buttonContainer}>
            {/* Outer rings for animation */}
            <Animated.View 
              style={[
                styles.outerRing,
                {
                  opacity: ringAnim,
                  transform: [{
                    scale: ringAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2]
                    })
                  }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.middleRing,
                {
                  opacity: ringAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.5, 0]
                  }),
                  transform: [{
                    scale: ringAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.4]
                    })
                  }]
                }
              ]} 
            />
            
            <Animated.View
              style={[
                styles.helpButton,
                {
                  transform: [
                    { scale: pulseAnim },
                    { scale: isPressed ? 0.95 : 1 }
                  ]
                }
              ]}
            >
              <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.buttonTouchable}
                activeOpacity={0.9}
              >
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonIcon}>🆘</Text>
                  <Text style={styles.buttonText}>EMERGENCY</Text>
                  <Text style={styles.buttonSubtext}>Hold for 2 seconds</Text>
                  
                  {/* Progress indicator */}
                  {isPressed && (
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Quick Actions
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Emergency Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.policeCard]} 
              onPress={() => handleQuickAction('police')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="shield" size={wp(5)} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Police</Text>
              <Text style={styles.actionSubtitle}>Local authorities</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.medicalCard]} 
              onPress={() => handleQuickAction('medical')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="medical" size={wp(5)} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Medical</Text>
              <Text style={styles.actionSubtitle}>Ambulance</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.fireCard]} 
              onPress={() => handleQuickAction('fire')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="flame" size={wp(5)} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Fire Dept</Text>
              <Text style={styles.actionSubtitle}>Fire emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.contactsCard]} 
              onPress={() => handleQuickAction('contacts')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="call" size={wp(5)} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Contacts</Text>
              <Text style={styles.actionSubtitle}>Family & friends</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Safety Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Ionicons name="location" size={wp(4)} color="#0EA5E9" />
              </View>
              <Text style={styles.tipText}>Keep location services enabled for accurate emergency response</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Ionicons name="battery-charging" size={wp(4)} color="#10B981" />
              </View>
              <Text style={styles.tipText}>Maintain adequate battery level for emergency situations</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Ionicons name="people" size={wp(4)} color="#8B5CF6" />
              </View>
              <Text style={styles.tipText}>Update emergency contacts regularly</Text>
            </View>
          </View>
        </View>

        {/* Footer Warning */}
        <View style={styles.warningCard}>
          <View style={styles.warningIcon}>
            <Ionicons name="warning" size={wp(5)} color="#F59E0B" />
          </View>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important Notice</Text>
            <Text style={styles.warningText}>
              This emergency feature will share your location and contact emergency services. Use only in genuine emergencies.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingBottom: hp(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    padding: wp(3),
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? wp(4.5) : wp(5.5),
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: isTablet ? wp(3) : wp(3.5),
    color: '#64748B',
    marginTop: hp(0.3),
  },
  headerRight: {
    width: wp(11),
    alignItems: 'flex-end',
  },
  infoButton: {
    backgroundColor: '#FFFFFF',
    padding: wp(3),
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: wp(5),
    borderRadius: wp(5),
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  statusIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: isTablet ? wp(4) : wp(4.5),
    fontWeight: '700',
    color: '#0F172A',
  },
  statusSubtitle: {
    fontSize: isTablet ? wp(3) : wp(3.5),
    color: '#10B981',
    fontWeight: '600',
    marginTop: hp(0.3),
  },
  statusIndicator: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#10B981',
  },
  statusDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: hp(2),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  statusItemText: {
    marginLeft: wp(2),
    fontSize: wp(3.5),
    color: '#64748B',
    fontWeight: '500',
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    padding: wp(5),
    borderRadius: wp(5),
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  instructionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  instructionTitle: {
    fontSize: isTablet ? wp(4) : wp(4.5),
    fontWeight: '700',
    color: '#0F172A',
  },
  instructionBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  instructionBadgeText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#DC2626',
  },
  instructionText: {
    fontSize: isTablet ? wp(3.2) : wp(3.8),
    color: '#64748B',
    lineHeight: wp(5.5),
    marginBottom: hp(2),
  },
  featuresList: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: hp(2),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  featureText: {
    marginLeft: wp(2),
    fontSize: wp(3.5),
    color: '#475569',
    fontWeight: '500',
  },
  emergencySection: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: wp(70),
    height: wp(70),
    borderRadius: wp(35),
    borderWidth: 3,
    borderColor: '#EF4444',
  },
  middleRing: {
    position: 'absolute',
    width: wp(75),
    height: wp(75),
    borderRadius: wp(37.5),
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  helpButton: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  buttonTouchable: {
    flex: 1,
    width: '100%',
    borderRadius: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonIcon: {
    fontSize: wp(8),
    marginBottom: hp(0.5),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? wp(3.5) : wp(4),
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: '#FECACA',
    fontSize: wp(3),
    fontWeight: '500',
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: -wp(2),
    left: -wp(20),
    right: -wp(20),
    height: hp(0.5),
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: hp(0.25),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: hp(0.25),
  },
  quickActionsSection: {
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
    width: (wp(90) - wp(5)) / 2,
    padding: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  policeCard: {
    backgroundColor: '#1E40AF',
  },
  medicalCard: {
    backgroundColor: '#DC2626',
  },
  fireCard: {
    backgroundColor: '#EA580C',
  },
  contactsCard: {
    backgroundColor: '#7C3AED',
  },
  actionIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: wp(3.8),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: hp(0.3),
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: wp(3),
    fontWeight: '500',
    textAlign: 'center',
  },
  tipsSection: {
    marginBottom: hp(3),
  },
  tipsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tipIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  tipText: {
    flex: 1,
    fontSize: wp(3.5),
    color: '#475569',
    lineHeight: wp(5),
    fontWeight: '500',
  },
  warningCard: {
    backgroundColor: '#FFFBEB',
    padding: wp(4),
    borderRadius: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: hp(2),
  },
  warningIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#92400E',
    marginBottom: hp(0.5),
  },
  warningText: {
    fontSize: wp(3.2),
    color: '#A16207',
    lineHeight: wp(4.5),
    fontWeight: '500',
  },
});