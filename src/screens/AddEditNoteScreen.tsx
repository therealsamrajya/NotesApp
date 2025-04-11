import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNotes } from "../context/NotesContext";
import Input from "../components/Input";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "AddEditNote">;

const AddEditNoteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { noteId } = route.params || {};
  const { notes, addNote, updateNote } = useNotes();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (noteId) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setDescription(note.description);
        setIsEditing(true);
        navigation.setOptions({ title: "Edit Note" });
      }
    } else {
      navigation.setOptions({ title: "Add Note" });
    }
  }, [noteId, notes]);

  const validate = () => {
    let valid = true;
    const newErrors = {
      title: "",
      description: "",
    };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing && noteId) {
        await updateNote(noteId, title, description);
        Alert.alert("Success", "Note updated successfully");
      } else {
        await addNote(title, description);
        Alert.alert("Success", "Note added successfully");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving the note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
      <View className="flex-1 p-6">
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter note title"
          error={errors.title}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter note description"
          multiline
          numberOfLines={10}
          style={{ height: 150, textAlignVertical: "top" }}
          error={errors.description}
        />

        <View className="flex-row justify-between mt-4">
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            style="bg-gray-300 flex-1 mr-2"
          />
          <Button
            title={isEditing ? "Update" : "Save"}
            onPress={handleSave}
            loading={loading}
            style="flex-1 ml-2"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddEditNoteScreen;
