import { Text, Modal, View, StyleSheet, Pressable } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backbutton } from "../components/Icons";
import { TasksData } from "../models/Tasks";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DeleteButton } from "../components/Icons";
import Toast from "react-native-toast-message";

// view to display all the information of a task
// fetched from the server

export default function DisplayTasks() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [task, setTask] = useState<TasksData>();
  // modal to confirm task deletion
  const [modalVisible, setModalVisible] = useState(false);

  const showToast = (type: string, text: string) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  // fetch task details from the server
  const getTask = async () => {
    try {
      const response = await fetch(`http://192.168.10.17:3000/api/task/${id}`);
      const data: TasksData = await response.json();
      setTask(data);
    } catch (error) {
      console.error(error);
    }
  };
  // delete task from the server
  const deleteTask = async () => {
    try {
      await fetch(`http://192.168.10.17:3000/api/task/${id}`, {
        method: "DELETE",
      }).then(() => {
        setTimeout(() => {
          showToast("success", "Task deleted successfully");
        }, 500);
        setModalVisible(false);
        router.push("/");
      });
    } catch (error) {
      console.error(error);
      showToast("error", "Error deleting task");
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View style={styles.top}>
        {/* Back Button */}
        <Link asChild href="/">
          <Pressable style={{ marginLeft: 20 }}>
            {({ pressed }) => (
              <Backbutton size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
            )}
          </Pressable>
        </Link>
        {/* Delete button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 20 }}>
          {({ pressed }) => (
            <DeleteButton size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
          )}
        </Pressable>
      </View>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 54 }}>
          {task?.titleName}
        </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          Descripcion {"\n"}
          {task?.description}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
          Status:{" "}
          {task?.status === "not_started"
            ? "Not Started"
            : task?.status === "in_progress"
            ? "In Progress"
            : "Completed"}
        </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          Start Date:{" "}
          {task?.startDate
            ? format(new Date(task.startDate), "yyyy-MM-dd")
            : "No date"}
        </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          End Date:
          {task?.endDate
            ? format(new Date(task.endDate), "yyyy-MM-dd")
            : "No date"}
        </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          Created at:{" "}
          {task?.createdAt
            ? format(new Date(task.createdAt), "yyyy-MM-dd")
            : "No date"}
        </Text>
      </View>
      {/* Modal view to authorize deletion */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{}}>
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              margin: 50,
              borderRadius: 20,
              alignItems: "center",
            }}>
            <Text style={{ fontSize: 20 }}>
              Are you sure you want to delete?
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Pressable
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  deleteTask();
                }}>
                <Text style={{ color: "white" }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Toast position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
