import { Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { Circleadd } from "./Icons";

// AddButton component to add a new task

export const AddButton = () => (
  <Link asChild href="/create">
    <Pressable style={{ marginRight: 20 }}>
      {({ pressed }) => (
        <Circleadd size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
      )}
    </Pressable>
  </Link>
);
