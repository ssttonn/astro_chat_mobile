import Assets from "@/constants/assets";
import ScreenRoutes from "@/constants/screenRoutes";
import useAccessToken from "@/hooks/useAccessToken";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
  const { getAccessToken } = useAccessToken();

  useEffect(() => {
    let timer = setTimeout(async () => {
      try {
        await getAccessToken();
        router.replace(ScreenRoutes.home);
      } catch (_) {
        router.replace(ScreenRoutes.login);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [getAccessToken]);

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
