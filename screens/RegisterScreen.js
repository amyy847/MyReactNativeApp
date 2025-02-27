import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { registerUser } from "../services/auth";

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/email-already-in-use":
      return "The email address is already in use by another account.";
    case "auth/weak-password":
      return "The password is too weak.";
    // Add more cases as needed
    default:
      return "An unknown error occurred. Please try again.";
  }
};

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email and password cannot be empty.");
      return;
    }
    try {
      await registerUser(email, password);
      alert("Registration successful!");
      navigation.navigate("LoginScreen"); // Redirect to login after registration
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Go Drives</Text>
          <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
          <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} style={styles.input} />
          <Button title="Register" onPress={handleRegister} />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <Button title="Already have an account? Sign in here!" onPress={() => navigation.navigate("LoginScreen")} style={styles.loginText} />
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
    fontSize: 50, // Larger font size for title
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  loginText: {
    fontSize: 8, // Smaller font size for login text
    color: "blue",
    marginTop: 10,
  },
});
