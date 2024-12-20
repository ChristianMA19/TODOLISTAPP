import { View, Text, StyleSheet } from "react-native";
import { AddButton } from "./AddButton";

// Menu component to display the title and add button like a navbar
export const Menu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TODOLIST</Text>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "10%",
    backgroundColor: "#10910c",
  },
  text: {
    fontSize: 30,
    marginLeft: 20,
  },
});
