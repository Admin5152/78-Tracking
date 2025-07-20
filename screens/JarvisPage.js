import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from "react-native";
import axios from "axios";

export default function App({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I am JARVIS. How can I assist you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleBack = () => {
    // Option 1: If using React Navigation
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } 
    // Option 2: If using a different navigation system, you can replace this with your navigation logic
    // For example: props.onBack() or your custom navigation function
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    setIsLoading(true);

    const systemPrompt = `You are JARVIS (Just A Rather Very Intelligent System), Tony Stark's AI assistant. Respond concisely, formally, and intelligently.`;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCfV7ZB5cO3OUUP3EMEee6jAn3dzPndlpY",
        {
          contents: [
            { parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage.text}` }] },
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 200,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            key: "AIzaSyCfV7ZB5cO3OUUP3EMEee6jAn3dzPndlpY", // <-- put your key here
          },
        }
      );

      const botText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I apologize, but I am unable to respond at the moment.";

      const botReply = {
        id: Math.random().toString(),
        text: botText,
        sender: "bot",
      };

      setMessages((prev) => [botReply, ...prev]);
    } catch (error) {
      console.error("Gemini error:", error?.response?.data || error.message);
      setMessages((prev) => [
        {
          id: Math.random().toString(),
          text:
            "⚠️ Huh, well that's weird. Give me a minute.",
          sender: "bot",
        },
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user" ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>JARVIS</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, isLoading && styles.statusDotActive]} />
                <Text style={styles.headerSubtitle}>
                  {isLoading ? "Processing..." : "AI Assistant Online"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#1a3d64"
              style={styles.input}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: input.trim() && !isLoading ? 1 : 0.5 },
              ]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? "⋯" : "→"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f6fafd" 
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#000000ff",
    borderBottomWidth: 1,
    borderBottomColor: "#1a3d64",
    shadowColor: "#4a7fa7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a3d64",
    borderWidth: 1,
    borderColor: "#4a7fa7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4a7fa7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: "#b3cfe5",
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: "#b3cfe5",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginLeft: -40, // Compensate for back button to keep title centered
  },
  headerTitle: {
    fontSize: 32,
    color: "#eaeef1ff",
    fontWeight: "700",
    letterSpacing: 3,
    textShadowColor: "#b3cfe5",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4a7fa7",
    marginRight: 8,
    opacity: 0.6,
  },
  statusDotActive: {
    opacity: 1,
    shadowColor: "#4a7fa7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#b3cfe5",
    fontWeight: "500",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f6fafd",
  },
  messageList: { 
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 16,
    marginVertical: 8,
    borderRadius: 24,
    shadowColor: "#1a3d64",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4a7fa7",
    borderTopRightRadius: 8,
    shadowColor: "#4a7fa7",
    shadowOpacity: 0.2,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#b3cfe5",
    borderTopLeftRadius: 8,
  },
  messageText: { 
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  userText: { 
    color: "#ffffff",
    fontWeight: "500",
  },
  botText: { 
    color: "#0A1931",
  },
  inputContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#b3cfe5",
    shadowColor: "#1a3d64",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f6fafd",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#b3cfe5",
    paddingLeft: 4,
    shadowColor: "#1a3d64",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0A1931",
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxHeight: 120,
    lineHeight: 22,
  },
  sendButton: {
    margin: 4,
    backgroundColor: "#4a7fa7",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4a7fa7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
});






//.  AIzaSyCfV7ZB5cO3OUUP3EMEee6jAn3dzPndlpY //