import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { loginUser } from "./services/auth"; // Corrected import path

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
      alert("Login successful!");
      navigation.navigate("HomeScreen"); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go Drives</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Don't have an account? Sign up now!" onPress={() => navigation.navigate("RegisterScreen")} style={styles.registerText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  registerText: {
    fontSize: 8, // Smaller font size for register text
    color: "blue",
    marginTop: 10,
  },
});
