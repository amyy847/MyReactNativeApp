import React, { useState } from "react";
import { 
  View, TextInput, Button, Text, StyleSheet, Alert, 
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { loginUser } from "../services/auth"; // Ensure correct import
import * as Location from "expo-location"; // Import Expo Location API

// Function to handle Firebase authentication errors
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/user-disabled":
      return "The user account has been disabled.";
    case "auth/user-not-found":
      return "There is no user corresponding to this email.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "The password is invalid.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password cannot be empty.");
      return;
    }
    try {
      await loginUser(email, password);
      Alert.alert("Success", "Login successful!");

      // Request location permissions after login
      let { status } = await Location.requestForegroundPermissionsAsync();
      let userLocation = null;
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        userLocation = location.coords;
      }

      // Navigate to MapScreen with userLocation
      navigation.navigate("Dashboard", { userLocation });
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage); // Show alert if login fails
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Go Drives</Text>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            style={styles.input}
          />
          <Button title="Login" onPress={handleLogin} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="Don't have an account? Sign up now!"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

