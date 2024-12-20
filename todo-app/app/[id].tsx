import {
  Text,
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backbutton, EditButton } from "../components/Icons";
import { TasksData } from "../models/Tasks";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DeleteButton } from "../components/Icons";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

// view to display all the information of a task
// fetched from the server

export default function DisplayTasks() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [task, setTask] = useState<TasksData>();
  // values for the task edit modal
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  // modal to confirm task deletion
  const [modalVisible, setModalVisible] = useState(false);

  // modal to edit task
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [showstart, setShowstart] = useState(false);
  const [showend, setShowend] = useState(false);

  // function to show toast messages
  const showToast = (type: string, text: string) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const ipLocal = process.env.EXPO_PUBLIC_IPLOCAL || "localhost";
  const port = process.env.EXPO_PUBLIC_PORT || "3000";

  // fetch task details from the server
  const getTask = async () => {
    try {
      const response = await axios.get(
        `http://${ipLocal}:${port}/api/task/${id}`
      );
      const data: TasksData = response.data;
      setTask(data);
    } catch (error) {
      console.error(error);
    }
  };
  // delete task from the server
  const deleteTask = async () => {
    try {
      await axios
        .delete(`http://${ipLocal}:${port}/api/task/${id}`, {})
        .then(() => {
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

  const updateTask = async () => {
    const Task: TasksData = {
      titleName: title,
      description: description,
      status: status,
      startDate: startDate?.toISOString().split("T")[0] || "",
      endDate: endDate?.toISOString().split("T")[0] || "",
    };
    try {
      await axios
        .put(
          `http://${ipLocal}:${port}/api/tasks/${id}`,
          JSON.stringify(Task),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setTimeout(() => {
            showToast("success", "Task updated successfully");
          }, 500);
          setEditModalVisible(false);
          getTask();
        });
    } catch (error) {
      console.error(error);
      showToast("error", "Error updating task");
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  useEffect(() => {
    setTitle(task?.titleName || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "");
    setStartDate(task?.startDate ? new Date(task.startDate) : new Date());
    setEndDate(task?.endDate ? new Date(task.endDate) : new Date());
  }, [task]);

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
        {/* edit button */}
        <Pressable
          style={{ justifyContent: "flex-end" }}
          onPress={() => setEditModalVisible(true)}>
          {({ pressed }) => (
            <EditButton size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
          )}
        </Pressable>
        {/* Delete button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 20 }}>
          {({ pressed }) => (
            <DeleteButton size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
          )}
        </Pressable>
      </View>
      <View style={[styles.container]}>
        <ScrollView>
          <Text style={{ fontWeight: "bold", fontSize: 54 }}>
            {task?.titleName}
          </Text>
          <View
            style={{ height: 2, backgroundColor: "black", marginVertical: 10 }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
            Description
          </Text>
          <Text style={{ fontSize: 20, marginTop: 10 }}>
            {task?.description}
          </Text>
          <View
            style={{ height: 2, backgroundColor: "black", marginVertical: 10 }}
          />
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
        </ScrollView>
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
      {/* Modal for editing */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: "100%" }}>
              <Text>Edit title</Text>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <Text>Description</Text>
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              <Text>Status</Text>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                style={[styles.picker, { marginVertical: 100 }]}>
                <Picker.Item label="Not started" value="not_started" />
                <Picker.Item label="In progress" value="in_progress" />
                <Picker.Item label="Finished" value="finished" />
              </Picker>
              <Text style={{ margin: 20 }}>Start Date</Text>
              <Pressable
                style={{ marginLeft: 20 }}
                onPress={() => setShowstart(true)}>
                <Text
                  style={{
                    backgroundColor: "#f0f0f0",
                    width: 150,
                    borderRadius: 50,
                  }}>
                  {startDate.toDateString()}
                </Text>
              </Pressable>
              {showstart ? (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  onChange={(event, date) => {
                    setShowstart(false);
                    if (date) {
                      setStartDate(date);
                      if (date > endDate) {
                        setEndDate(date);
                      }
                    }
                  }}
                />
              ) : null}
              <Text style={{ margin: 20 }}>Due Date</Text>
              <Pressable
                style={{ marginLeft: 20 }}
                onPress={() => setShowend(true)}>
                <Text
                  style={{
                    backgroundColor: "#f0f0f0",
                    width: 150,
                    borderRadius: 50,
                  }}>
                  {endDate.toDateString()}
                </Text>
              </Pressable>
              {showend ? (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  minimumDate={startDate}
                  onChange={(event, enddate) => {
                    setShowend(false);
                    if (enddate) {
                      setEndDate(enddate);
                    }
                  }}
                />
              ) : null}
              <Pressable
                style={{
                  marginTop: 10,
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  updateTask();
                }}>
                <Text>Update Task</Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 10,
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  setEditModalVisible(false);
                }}>
                <Text>Cancel</Text>
              </Pressable>
            </ScrollView>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  picker: {
    height: 100,
    width: "100%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
