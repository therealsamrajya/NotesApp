import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onDelete }) => {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {note.title}
          </Text>
          <Text className="text-gray-600 mb-2" numberOfLines={2}>
            {note.description}
          </Text>
          <Text className="text-gray-500 text-xs">{formattedDate}</Text>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="w-8 h-8 items-center justify-center rounded-full bg-red-100">
          <Text className="text-red-500 font-bold">X</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;
