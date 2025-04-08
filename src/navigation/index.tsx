import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import NotesScreen from "../screens/NotesScreen";
import AddEditNoteScreen from "../screens/AddEditNoteScreen";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Notes: undefined;
  AddEditNote: { noteId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could add a splash screen here
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {user ? (
        // User is signed in
        <>
          <Stack.Screen
            name="Notes"
            component={NotesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddEditNote"
            component={AddEditNoteScreen}
            options={{ title: "Add Note" }}
          />
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
