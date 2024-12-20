import { StyleSheet, View } from "react-native";
import Displaytasks from "./DisplayTasks";
import { Menu } from "./Menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Main component to display the menu and tasks

export default function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <Menu />
      <Displaytasks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
