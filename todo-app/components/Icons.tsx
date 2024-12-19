import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { View, Text } from "react-native";

//manage all icons from here

export const Circleadd = (props: any) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: "black", fontSize: 20, marginRight: 4, ...props }}>
        Add tasks
      </Text>
      <AntDesign name="pluscircle" size={24} {...props} />
    </View>
  );
};

export const Backbutton = (props: any) => {
  return <Entypo name="back" size={24} {...props} />;
};
