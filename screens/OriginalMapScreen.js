import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

export default function OriginalMapScreen() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [networkStatus, setNetworkStatus] = useState("Checking...");
  const [isUserLocation, setIsUserLocation] = useState(false);
  const [showLocationMessage, setShowLocationMessage] = useState(false);
  const [selectedLocationTitle, setSelectedLocationTitle] = useState("");
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    getLocation();
    getNetworkStatus();
  }, []);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (searchQuery) {
        searchLocation();
      } else {
        setSearchResults([]);
      }
    }, 1500);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch user's location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setIsUserLocation(true);
  };

  // Fetch network status
  const getNetworkStatus = () => {
    NetInfo.fetch().then((state) => {
      setNetworkStatus(state.isConnected ? "Online" : "Offline");
    });
  };

  // Search for locations using OpenStreetMap (Nominatim API)
  const searchLocation = async () => {
    if (!searchQuery) {
      getLocation();
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      if (response.data.length > 0) {
        const sortedResults = response.data.sort((a, b) => {
          const distanceA = getDistanceFromLatLonInKm(
            location.latitude,
            location.longitude,
            parseFloat(a.lat),
            parseFloat(a.lon)
          );
          const distanceB = getDistanceFromLatLonInKm(
            location.latitude,
            location.longitude,
            parseFloat(b.lat),
            parseFloat(b.lon)
          );
          return distanceA - distanceB;
        });
        setSearchResults(sortedResults); // Store sorted results in state
        console.log("Search Results:", sortedResults); // Log search results
      } else {
        alert("Location not found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  // Calculate distance between two coordinates
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lat2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Set map location when user selects from search results
  const selectLocation = (selectedLocation) => {
    setLocation({
      latitude: parseFloat(selectedLocation.lat),
      longitude: parseFloat(selectedLocation.lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setIsUserLocation(false);
    setSearchResults([]); // Clear search results
    setSearchQuery(selectedLocation.display_name); // Set selected location name
    setSelectedLocationTitle(selectedLocation.display_name); // Set selected location title
    Keyboard.dismiss(); // Close keyboard
  };

  // Toggle location message
  const toggleLocationMessage = () => {
    setShowLocationMessage(!showLocationMessage);
  };

  const handleSearch = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    searchLocation();
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <StatusBar style={darkMode ? "light" : "dark"} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          returnKeyType="search"
          onSubmitEditing={handleSearch} // Trigger search on submit
        />
      </View>

      {/* Search Results List */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          style={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => selectLocation(item)}
            >
              <Text style={styles.resultText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Map View */}
      <MapView
        style={styles.map}
        region={location}
        customMapStyle={darkMode ? darkMapStyle : []}
      >
        {location && (
          <Marker
            coordinate={location}
            title={showLocationMessage ? selectedLocationTitle : "Your Location"}
            onPress={toggleLocationMessage}
          />
        )}
      </MapView>
    </View>
  );
}

// Dark Mode Styling
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkContainer: { backgroundColor: "#121212" },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  resultsList: {
    position: "absolute",
    top: 90,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 3,
    elevation: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
  },
  map: { flex: 1 },
  bottomPanel: {
    position: "absolute",
    bottom: 40,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  networkStatus: {
    color: "white",
    fontSize: 16,
  },
});
