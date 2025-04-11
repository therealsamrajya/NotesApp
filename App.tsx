import React, { useEffect } from "react";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { NotesProvider } from "./src/context/NotesContext";
import { Navigation } from "./src/navigation";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "./src/screens/LoadingScreen";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  if (isLoading) return <LoadingScreen />;

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
