import React, { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { TasksData } from "../models/Tasks";
import Toast from "react-native-toast-message";

// Displaytasks component to display all tasks
// fetched from the server

type TaskProps = {
  task: TasksData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Task = ({ task, onPress, backgroundColor, textColor }: TaskProps) => (
  // Display task details in a card view
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}>
    <View style={styles.task}>
      <Text style={[styles.title, { color: textColor }]}>{task.titleName}</Text>
      <Text style={[styles.date, { color: textColor }]}>
        Start Date: {new Date(task.startDate).toISOString().split("T")[0]}
      </Text>
      <Text style={[styles.status, { color: textColor }]}>
        Status:{" "}
        {task.status === "not_started"
          ? "Not Started"
          : task.status === "in_progress"
          ? "In Progress"
          : "Completed"}
      </Text>
    </View>
  </TouchableOpacity>
);

const Displaytasks = () => {
  // Fetch tasks from the server
  const [tasks, setTasks] = useState<TasksData[]>([]);

  const fetchTasks = async () => {
    try {
      await axios
        .get("http://192.168.10.17:3000/api/tasks", {
          timeout: 5000,
        })
        .then((tasks) => {
          setTasks(tasks.data);
        });
    } catch (error) {
      alert("Error fetching tasks: " + error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [selectedId, setSelectedId] = useState<string>();

  // Render each task in a card view
  const renderItem = ({ item }: { item: TasksData }) => {
    const backgroundColor = "#dedede";
    const color = "black";

    return (
      <Task
        task={item}
        onPress={() => item.idTasks && setSelectedId(item.idTasks.toString())}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  // Display all tasks in a FlatList or a message if there are no tasks
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: tasks.length === undefined ? "center" : "flex-start",
          alignItems: tasks.length === undefined ? "center" : "stretch",
        },
      ]}>
      {tasks.length === undefined ? (
        <Text
          style={{
            color: "Black",
            fontSize: 36,
          }}>
          There are no tasks...
        </Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => (item.idTasks ?? "").toString()}
          extraData={selectedId}
        />
      )}
      <Toast position="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    width: "100%",
  },
  task: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Displaytasks;
