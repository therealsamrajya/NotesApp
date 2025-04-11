import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import NoteCard from "../components/NoteCard";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Notes">;

const NotesScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { notes, loading, deleteNote } = useNotes();

  const handleDeleteNote = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", onPress: signOut },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">
          {user?.name}'s Notes
        </Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text className="text-blue-500">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading notes...</Text>
        </View>
      ) : (
        <>
          {notes.length === 0 ? (
            <View className="flex-1 justify-center items-center p-6">
              <Text className="text-gray-600 text-center mb-4">
                You don't have any notes yet. Create your first note!
              </Text>
              <Button
                title="Create Note"
                onPress={() => navigation.navigate("AddEditNote")}
                style="w-40"
              />
            </View>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NoteCard
                  note={item}
                  onPress={() =>
                    navigation.navigate("AddEditNote", { noteId: item.id })
                  }
                  onDelete={() => handleDeleteNote(item.id)}
                />
              )}
              contentContainerStyle={{ padding: 16 }}
            />
          )}

          <View className="p-4">
            <Button
              title="Add New Note"
              onPress={() => navigation.navigate("AddEditNote")}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default NotesScreen;
