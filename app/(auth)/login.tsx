import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LoginScreen = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-white flex-1">
        <ScrollView>
          <View className="flex flex-1 justify-center items-stretch w-[80%] self-center gap-2">
            <LottieView
              style={{ width: "100%", aspectRatio: 1, alignSelf: "center" }}
              source={require("../../assets/animations/login.json")}
              autoPlay
              loop
            />
            <View className="flex">
              <Text className="text-5xl text-redPink font-KelsonExtraBold">
                Login to
              </Text>
              <Text className="text-primary text-5xl font-KelsonExtraBold">
                #astrochat
              </Text>
            </View>
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
            <View className="flex flex-row gap-1 self-center mt-2">
              <Text className="text-center text-black font-KelsonBold">
                Don't have an account?
              </Text>
              <Link href={"/register"} className="text-primary font-KelsonBold">
                Register
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
