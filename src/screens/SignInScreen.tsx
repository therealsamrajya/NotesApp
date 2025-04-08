import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await signIn(email, password);
      if (!success) {
        Alert.alert("Login Failed", "Invalid email or password.");
      }
      // If successful, navigation will be handled by the Auth Context
    } catch (error) {
      Alert.alert("Error", "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
      <View className="flex-1 p-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Sign in to access your notes
          </Text>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        <Button
          title="Sign In"
          onPress={handleSignIn}
          loading={loading}
          style="mt-4"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Text
            className="text-blue-500 font-bold"
            onPress={() => navigation.navigate("SignUp")}>
            Sign Up
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInScreen;
