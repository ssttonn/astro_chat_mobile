import AuthMainLayout from "@/components/auth/AuthMainLayout";
import OAuthenticationMethods, {
  AuthMethod,
} from "@/components/auth/OAuthenticationMethod";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/assets";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";

const LoginScreen = () => {
  return (
    <AuthMainLayout>
      <LottieView
        style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
        source={Assets.animations.login}
        autoPlay
        loop
      />
      <Text className="text-5xl font-KelsonExtraBold">Login to</Text>
      <Text className="text-primary text-5xl font-KelsonExtraBold">
        #astrochat
      </Text>
      <MainTextField label="Email" />
      <MainTextField
        label="Password"
        icon={<Entypo name="lock" size={24} color="#247cff" />}
      />

      <Link
        href={"/forgot-password"}
        className="text-primary my-2 font-KelsonBold self-end"
      >
        Forgot password?
      </Link>
      <MainButton title="Login" />
      <OAuthenticationMethods
        methods={[AuthMethod.Google, AuthMethod.Facebook]}
        onPress={(method) => {}}
      />
      <View className="flex flex-row gap-1 self-center mt-2">
        <Text className="text-center text-black font-KelsonBold">
          Don't have an account?
        </Text>
        <Link href={"/register"} className="text-primary font-KelsonBold">
          Register
        </Link>
      </View>
    </AuthMainLayout>
  );
};

export default LoginScreen;
