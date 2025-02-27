import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { PaperProvider, ProgressBar } from "react-native-paper"; // Ensure correct Provider
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.title}>Go Drives</Text>
      <ProgressBar style={styles.progressBar} progress={0.5} color="green" />
      <Button title="Login" onPress={() => navigation.navigate("LoginScreen")} />
      <Button title="Don't have an account? Sign up now!" onPress={() => navigation.navigate("RegisterScreen")} />
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: 'green' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome" }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "Register" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 20,
    color: "darkgreen",
    marginBottom: 5,
  },
  title: {
    fontSize: 50, // Increased font size
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  progressBar: {
    width: "80%",
    height: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
