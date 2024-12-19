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

type TasksData = {
  idTasks: number;
  titleName: string;
  description: string;
  status: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
};

type TaskProps = {
  task: TasksData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Task = ({ task, onPress, backgroundColor, textColor }: TaskProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}>
    <View style={styles.task}>
      <View>
        <Text style={[styles.title, { color: textColor }]}>
          {task.titleName}
        </Text>
        <Text style={[styles.date, { color: textColor }]}>
          Start Date: {new Date(task.startDate).toISOString().split("T")[0]}
        </Text>
      </View>
      <View>
        <Text style={[styles.status, { color: textColor }]}>
          Status
          {"\n"}
          {task.status}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Displaytasks = () => {
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
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({ item }: { item: TasksData }) => {
    const backgroundColor = "#dedede";
    const color = "black";

    return (
      <Task
        task={item}
        onPress={() => setSelectedId(item.idTasks.toString())}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.idTasks.toString()}
        extraData={selectedId}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    padding: 20,
    height: 100,
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
