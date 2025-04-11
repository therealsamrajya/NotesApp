import React, { useEffect } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import { StatusBar } from "expo-status-bar";

const LoadingScreen = () => {
  // Create animated value for rotation
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Create a looping animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate spin value to rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 items-center justify-center bg-amber-100">
      <StatusBar style="dark" />

      <View className="items-center">
        {/* App logo with spin animation */}
        <Animated.View
          className="mb-8"
          style={{ transform: [{ rotate: spin }] }}>
          <View className="w-32 h-32 bg-gradient-to-b from-orange-400 to-amber-500 rounded-3xl items-center justify-center">
            <View className="w-24 h-24 bg-white rounded-lg items-center justify-center">
              <View className="flex-row mb-4">
                {[1, 2, 3].map((_, index) => (
                  <View
                    key={index}
                    className="w-4 h-4 mx-1 bg-amber-400 rounded-full"
                  />
                ))}
              </View>
              <View className="w-16">
                {[1, 2, 3].map((_, index) => (
                  <View
                    key={index}
                    className="h-2 bg-gray-400 rounded-full mb-2"
                  />
                ))}
              </View>
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-gray-100 rounded-tl-lg" />
            </View>
          </View>
        </Animated.View>

        {/* App name */}
        <Text className="text-3xl font-bold text-amber-800 mb-2">NotesApp</Text>
        <Text className="text-amber-600 mb-8">Your thoughts, organized</Text>

        {/* Loading indicator */}
        <View className="flex-row space-x-2">
          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              className="w-3 h-3 bg-amber-500 rounded-full"
              style={{
                opacity: 0.3 + index * 0.3,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default LoadingScreen;
