import { TouchableHighlight, Text } from "react-native";

export const AddButton = () => (
  <TouchableHighlight
    underlayColor={"#4c87ba"}
    onPress={() => {
      alert("You pressed me");
    }}
    style={{
      width: 130,
      height: 70,
      marginRight: 20,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0469c2",
    }}>
    <Text style={{ color: "#ffff", fontSize: 18 }}>Add Task</Text>
  </TouchableHighlight>
);
