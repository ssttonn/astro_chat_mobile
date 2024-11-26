import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Assets from "@/constants/assets";

interface LoadingViewProps {
  isLoading: boolean;
}

const LoadingView = ({ isLoading = false }: LoadingViewProps) => {
  return (
    <View
      className={`absolute left-0 right-0 z-10 w-full h-full justify-center ${isLoading ? "opacity-1" : "opacity-0 pointer-events-none"}`}
    >
      <View className="absolute w-full h-full bg-black opacity-45" />
      <View className="w-[40%] self-center bg-white rounded-3xl py-5">
        <LottieView
          style={{
            width: "80%",
            aspectRatio: 1.1,
            alignSelf: "center",
          }}
          source={Assets.animations.loading}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default LoadingView;
