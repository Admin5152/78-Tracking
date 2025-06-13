import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HelpButtonScreen() {
  const navigation = useNavigation();
  const [pressStart, setPressStart] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setPressStart(Date.now());
    setIsPressed(true);
  };

  const handlePressOut = () => {
    const heldTime = Date.now() - pressStart;
    setIsPressed(false);
    if (heldTime > 2000) {
      sendHelpAlert(); // 2 seconds or more = trigger alert
    } else {
      Alert.alert("Hold the button longer to send help");
    }
  };

  const sendHelpAlert = async () => {
    try {
      // Replace with email sending logic here
      Alert.alert("Help message sent!");
    } catch (error) {
      Alert.alert("Failed to send help message.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Help</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Emergency Assistance</Text>
          <Text style={styles.instructionText}>
            Press and hold the button below for 2 seconds to send an emergency help message
          </Text>
        </View>

        {/* Help Button with Ripple Effect */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.helpButton,
              isPressed && styles.helpButtonPressed
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonIcon}>🆘</Text>
              <Text style={styles.buttonText}>HOLD FOR HELP</Text>
              <Text style={styles.buttonSubtext}>2 seconds</Text>
            </View>
          </TouchableOpacity>
          
          {/* Outer Ring Animation */}
          <View style={[styles.outerRing, isPressed && styles.outerRingActive]} />
        </View>

        <Text style={styles.warningText}>
          This will send your location and emergency contact information
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Emergency services will be contacted</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  backText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
    textAlign: 'center',
    marginRight: 55, // Compensate for back button width
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  instructionContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  helpButton: {
    backgroundColor: '#2563eb',
    borderRadius: 120,
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 5,
    borderColor: 'white',
  },
  helpButtonPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.5,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonSubtext: {
    color: '#bfdbfe',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  outerRing: {
    position: 'absolute',
    top: -15,
    left: -15,
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 3,
    borderColor: '#93c5fd',
    opacity: 0,
  },
  outerRingActive: {
    opacity: 1,
    borderColor: '#2563eb',
    borderWidth: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
});