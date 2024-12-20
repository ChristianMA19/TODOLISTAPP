import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backbutton } from "./Icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { TasksData } from "../models/Tasks";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// CreateTask component to create a new task and send it to the server

export const CreateTask = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Get today and tomorrow's date
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // States to store task details
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("not_started");
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setendDate] = useState<Date>(tomorrow);
  const [submit, setSubmit] = useState(false);

  // Check if all fields are filled and enable submit button
  useEffect(() => {
    if (taskName && taskDescription && startDate && endDate) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [taskName, taskDescription, startDate, endDate]);

  // Function to handle submit button and send task details to the server

  const showToast = (type: string, text: string) => {
    Toast.show({
      type: "success",
      text1: "Task created successfully",
    });
  };

  const ipLocal = process.env.EXPO_PUBLIC_IPLOCAL || "localhost";
  const port = process.env.EXPO_PUBLIC_PORT || "3000";

  const handleSubmit = async () => {
    const Task: TasksData = {
      titleName: taskName,
      description: taskDescription,
      status: selectedStatus,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };

    try {
      await axios
        .post(`http://${ipLocal}:${port}/api/tasks`, Task)
        .then((response) => {
          setTimeout(() => {
            showToast("success", "Task created successfully");
          }, 0);
          //reset the form
          setTaskName("");
          setTaskDescription("");
          setStartDate(today);
          setendDate(tomorrow);
          setSelectedStatus("not_started");
          router.push("/");
        });
    } catch (error) {
      setTimeout(() => {
        showToast("error", "Error creating task " + error);
      }, 0);
    }
  };

  return (
    <View
      style={
        (styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom })
      }>
      <Toast autoHide={false} position="bottom" />

      <View style={styles.top}>
        <Link asChild href="/">
          <Pressable style={{ marginLeft: 20 }}>
            {({ pressed }) => (
              <Backbutton size={40} style={{ opacity: pressed ? 0.5 : 1 }} />
            )}
          </Pressable>
        </Link>
        <Text style={{ fontSize: 24, marginRight: 20 }}>Create Task</Text>
      </View>
      {/* input for task name */}
      <Text style={styles.text}>Task Name</Text>
      <TextInput
        value={taskName}
        onChangeText={(name) => {
          setTaskName(name);
        }}
        style={styles.input}></TextInput>
      {/* input for task description */}
      <Text style={styles.text}>Task Description</Text>
      <TextInput
        value={taskDescription}
        onChangeText={(desc) => setTaskDescription(desc)}
        style={styles.input}></TextInput>
      {/* picker for status */}
      <Text style={styles.text}>Status</Text>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}>
        <Picker.Item label="Not started" value="not_started" />
        <Picker.Item label="In progress" value="in_progress" />
      </Picker>
      {/* date picker for start and end date */}
      <Text style={styles.text}>Start Date</Text>
      <DateTimePicker
        value={startDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          if (date) {
            setStartDate(date);
          }
        }}
      />
      <Text style={styles.text}>Due Date</Text>
      <DateTimePicker
        value={endDate}
        mode="date"
        display="default"
        minimumDate={startDate}
        onChange={(event, enddate) => {
          if (enddate) {
            setendDate(enddate);
          }
        }}
      />
      {/* submit button */}
      <Pressable
        disabled={!submit}
        onPress={() => handleSubmit()}
        style={[
          styles.submit,
          {
            opacity: submit ? 1 : 0.5,
            backgroundColor: submit ? "#10910c" : "grey",
          },
        ]}>
        {({ pressed }) => (
          <Text style={{ color: pressed ? "black" : "white" }}>Submit</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  pickerContainer: {
    margin: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  submit: {
    margin: 20,
    padding: 10,
    backgroundColor: "#10910c",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 10,
  },
});
