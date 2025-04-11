import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types";
import { useAuth } from "./AuthContext";

interface NotesContextData {
  notes: Note[];
  addNote: (title: string, description: string) => Promise<void>;
  updateNote: (id: string, title: string, description: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loading: boolean;
}

const NotesContext = createContext<NotesContextData>({} as NotesContextData);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    try {
      if (!user) {
        setNotes([]);
        setLoading(false);
        return;
      }

      const storedNotes = await AsyncStorage.getItem("@NotesApp:notes");
      if (storedNotes) {
        const parsedNotes: Note[] = JSON.parse(storedNotes);
        // Filter notes for current user and sort by created date (newest first)
        const userNotes = parsedNotes
          .filter((note) => note.userId === user.id)
          .sort((a, b) => b.createdAt - a.createdAt);
        setNotes(userNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error loading notes", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotesToStorage = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(
        "@NotesApp:notes",
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.error("Error saving notes", error);
    }
  };

  const addNote = async (title: string, description: string) => {
    try {
      if (!user) return;

      const newNote: Note = {
        id: String(Date.now()),
        title,
        description,
        createdAt: Date.now(),
        userId: user.id,
      };

      const storedNotes = await AsyncStorage.getItem("@NotesApp:notes");
      let updatedNotes: Note[] = [];

      if (storedNotes) {
        updatedNotes = [...JSON.parse(storedNotes), newNote];
      } else {
        updatedNotes = [newNote];
      }

      await saveNotesToStorage(updatedNotes);

      // Update state with the user's notes sorted by created date
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const updateNote = async (id: string, title: string, description: string) => {
    try {
      const storedNotes = await AsyncStorage.getItem("@NotesApp:notes");
      if (storedNotes) {
        const parsedNotes: Note[] = JSON.parse(storedNotes);
        const updatedNotes = parsedNotes.map((note) => {
          if (note.id === id) {
            return { ...note, title, description };
          }
          return note;
        });

        await saveNotesToStorage(updatedNotes);

        // Update state with the user's notes
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id ? { ...note, title, description } : note
          )
        );
      }
    } catch (error) {
      console.error("Error updating note", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const storedNotes = await AsyncStorage.getItem("@NotesApp:notes");
      if (storedNotes) {
        const parsedNotes: Note[] = JSON.parse(storedNotes);
        const updatedNotes = parsedNotes.filter((note) => note.id !== id);

        await saveNotesToStorage(updatedNotes);

        // Update state by removing the deleted note
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, loading }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
