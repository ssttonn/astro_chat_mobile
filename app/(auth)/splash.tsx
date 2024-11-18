import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import DBKey from "@/constants/DBKey";

const SplashScreen = () => {
  useEffect(() => {
    let timer = setTimeout(async () => {
      Promise.all([
        SecureStore.getItemAsync(DBKey.TOKEN),
        SecureStore.getItemAsync(DBKey.TOKEN_EXPIRY_DATE),
      ]).then(([token, tokenExpiryDate]) => {
        if (token && tokenExpiryDate) {
          const expiryDate = new Date(tokenExpiryDate);
          const now = new Date();
          if (expiryDate > now) {
            router.replace("/home");
          } else {
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1 justify-center items-center gap-1">
      <LottieView
        style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
        source={Assets.animations.splash}
        autoPlay
        loop
      />
      <Text className="text-5xl font-KelsonExtraBold text-center text-primary">
        #astrochat
      </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
