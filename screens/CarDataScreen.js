import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CarDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Car Data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
