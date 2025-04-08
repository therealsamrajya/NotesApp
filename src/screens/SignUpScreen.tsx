import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await signUp(name, email, password);
      if (success) {
        // SignUp successful - navigation will be handled by the Auth Context
      } else {
        Alert.alert(
          "Registration Failed",
          "Email already exists. Please use a different email."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
      <View className="flex-1 p-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Sign up to start taking notes
          </Text>
        </View>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          autoCapitalize="words"
          error={errors.name}
        />

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

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button
          title="Sign Up"
          onPress={handleSignUp}
          loading={loading}
          style="mt-4"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <Text
            className="text-blue-500 font-bold"
            onPress={() => navigation.navigate("SignIn")}>
            Sign In
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
