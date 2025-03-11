import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";


export default function CameraViewsScreen() {
  const [liveStream, setLiveStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Fetch latest image URL from Firestore
  const fetchLiveStream = async () => {
    try {
      const docRef = doc(db, "cameraFeeds", "frontCamera");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const imageUrl = docSnap.data().url;
        console.log("Fetched Image URL:", imageUrl); // Debugging
        setLiveStream(imageUrl);
      } else {
        console.warn("No image found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      if (!imageUrl) return;
  
      const storage = getStorage();
      const imageRef = ref(storage, imageUrl);
  
      await deleteObject(imageRef);
      console.log("Image deleted from Firebase Storage");
  
      // Remove the document reference from Firestore
      await deleteDoc(doc(db, "cameraFeeds", "frontCamera"));
      console.log("Image reference deleted from Firestore");
  
      // Reset state
      setLiveStream(null);
      setIsStreaming(false);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  
  

  // Auto-refresh the image every second
  useEffect(() => {
    let interval;
    if (isStreaming) {
      fetchLiveStream();
      interval = setInterval(fetchLiveStream, 1000);
    } else {
      clearInterval(interval);
    }
  
    // Delete the image after a few seconds
    if (liveStream) {
      setTimeout(() => deleteImage(liveStream), 5000);
    }
  
    return () => clearInterval(interval);
  }, [isStreaming, liveStream]);
  

  return (
    <View style={styles.container}>
      {isStreaming ? (
  liveStream ? (
    <Image source={{ uri: liveStream }} style={styles.liveImage} />
  ) : (
    <Text>Loading image...</Text>
  )
) : (
  <TouchableOpacity style={styles.cameraView} onPress={() => setIsStreaming(true)}>
    <Text style={styles.cameraText}>Front Camera</Text>
  </TouchableOpacity>
)}


      <View style={[styles.cameraView, styles.offlineView]}>
        <Text style={styles.cameraText}>Back Camera</Text>
        <Text style={styles.statusText}>Currently Offline</Text>
      </View>
      <View style={[styles.cameraView, styles.offlineView]}>
        <Text style={styles.cameraText}>Other</Text>
        <Text style={styles.statusText}>Currently Offline</Text>
      </View>
      <View style={[styles.cameraView, styles.offlineView]}>
        <Text style={styles.cameraText}>Other</Text>
        <Text style={styles.statusText}>Currently Offline</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  cameraView: {
    width: "48%",
    height: "48%",
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  offlineView: {
    backgroundColor: "#aaa",
  },
  cameraText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    color: "red",
  },
  liveImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
