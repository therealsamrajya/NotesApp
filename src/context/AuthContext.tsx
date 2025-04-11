import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@NotesApp:user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading stored user", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await AsyncStorage.getItem("@NotesApp:users");
      if (users) {
        const parsedUsers: User[] = JSON.parse(users);
        const foundUser = parsedUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          await AsyncStorage.setItem(
            "@NotesApp:user",
            JSON.stringify(foundUser)
          );
          setUser(foundUser);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error signing in", error);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      let users: User[] = [];
      const storedUsers = await AsyncStorage.getItem("@NotesApp:users");

      if (storedUsers) {
        users = JSON.parse(storedUsers);
        const userExists = users.some((u) => u.email === email);
        if (userExists) {
          return false;
        }
      }

      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        password,
      };

      users.push(newUser);
      await AsyncStorage.setItem("@NotesApp:users", JSON.stringify(users));
      await AsyncStorage.setItem("@NotesApp:user", JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Error signing up", error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@NotesApp:user");
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
