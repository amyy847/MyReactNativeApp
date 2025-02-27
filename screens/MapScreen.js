import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; // Import Expo Location API
import { useFocusEffect } from "@react-navigation/native"; // Ensures it runs every time user navigates to the map

export default function MapScreen({ route }) {
  const [userLocation, setUserLocation] = useState(route.params?.userLocation || null);

  // Function to request location permission every time user enters MapScreen
  const requestLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      let { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert("Permission Denied", "Allow location access in settings.");
      }
    }
  };

  // useFocusEffect ensures the permission request runs every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      requestLocationPermission();
    }, [])
  );

  const handleAddLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 37.78825,
          longitude: userLocation ? userLocation.longitude : -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>
      {!userLocation && (
        <Button title="Add your current location" onPress={handleAddLocation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
