import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    const data = await AsyncStorage.getItem("HABITS");
    if (data) {
      setHabits(JSON.parse(data));
    }
  };

  const saveHabits = async () => {
    await AsyncStorage.setItem("HABITS", JSON.stringify(habits));
  };

  const addHabit = () => {
    if (habit.trim() === "") {
      Alert.alert("Ошибка", "Введите название привычки");
      return;
    }

    setHabits([
      ...habits,
      {
        id: Date.now().toString(),
        title: habit,
        completedDates: [],
      },
    ]);
    setHabit("");
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          const completed = h.completedDates.includes(today)
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today];

          return { ...h, completedDates: completed };
        }
        return h;
      })
    );
  };

  const renderItem = ({ item }) => {
    const doneToday = item.completedDates.includes(today);

    return (
      <TouchableOpacity
        style={[styles.habit, doneToday && styles.done]}
        onPress={() => toggleHabit(item.id)}
      >
        <Text style={styles.habitText}>
          {doneToday ? "✅ " : "⬜ "} {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Новая привычка"
        value={habit}
        onChangeText={setHabit}
      />

      <TouchableOpacity style={styles.button} onPress={addHabit}>
        <Text style={styles.buttonText}>Добавить</Text>
      </TouchableOpacity>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  habit: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  done: {
    backgroundColor: "#d4edda",
  },
  habitText: {
    fontSize: 16,
  },
});