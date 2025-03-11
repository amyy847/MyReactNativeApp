import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, ActivityIndicator, Alert } from "react-native";
import { PaperProvider, ProgressBar } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Location from "expo-location"; // Import Expo Location API
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Dashboard from "./screens/Dashboard"; // Import Map Screen
import OriginalMapScreen from './screens/OriginalMapScreen';
import CameraViewsScreen from './screens/CameraViewsScreen';
import LidarScreen from './screens/LidarScreen';
import RadarScreen from './screens/RadarScreen';
import PassengerDataScreen from './screens/PassengerDataScreen';
import CarDataScreen from './screens/CarDataScreen';

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
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request location permissions on app startup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access in settings.");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setLoading(false);
    })();
  }, []);

  // Show a loading spinner while getting location
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "green" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome" }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "Register" }} />
          <Stack.Screen name="Dashboard">
            {(props) => <Dashboard {...props} userLocation={location} />}
          </Stack.Screen>
          <Stack.Screen name="OriginalMapScreen" component={OriginalMapScreen} />
          <Stack.Screen name="CameraViewsScreen" component={CameraViewsScreen} />
          <Stack.Screen name="LidarScreen" component={LidarScreen} />
          <Stack.Screen name="RadarScreen" component={RadarScreen} />
          <Stack.Screen name="PassengerDataScreen" component={PassengerDataScreen} />
          <Stack.Screen name="CarDataScreen" component={CarDataScreen} />
          <Stack.Screen name="DashBoardScreen" component={Dashboard} />
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
    fontSize: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
