// App.tsx (create this in the root of your project)
import React from "react";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { NotesProvider } from "./src/context/NotesContext";
import { Navigation } from "./src/navigation";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotesProvider>
          <Navigation />
          <StatusBar />
        </NotesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
