import React, { useCallback } from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import { Text } from "react-native";
import MainTextField from "@/components/common/MainTextField";
import MainButton from "@/components/common/MainButton";
import { router } from "expo-router";
import CircularIcon from "@/components/common/CircularIcon";
import { AntDesign, Entypo } from "@expo/vector-icons";
import LoadingView from "@/components/common/LoadingView";
import {
  RegisterStatus,
  RegisterStep,
  useRegisterStore,
} from "@/business/store/auth/registerStore";

const SubmitRegisterInfoScreen = () => {
  const {
    form: { username, password, email, confirmPassword },
    status,
    setFormField,
    onSubmitUserInfo,
    setStep,
  } = useRegisterStore();

  return (
    <>
      <LoadingView isLoading={status === RegisterStatus.LOADING} />
      <AuthMainLayout
        onBackPress={useCallback(() => {
          setStep(RegisterStep.registerEmail);
          router.back();
        }, [setStep])}
      >
        <LottieView
          style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
          source={Assets.animations.submitInfo}
          autoPlay
          loop
        />
        <Text className="text-5xl font-KelsonExtraBold">Almost there</Text>
        <Text className="text-xl font-KelsonMedium">
          Please enter your details to complete the registration
        </Text>
        <MainTextField
          label="Username"
          keyboardType="default"
          value={username}
          onChangeText={useCallback(
            (value: string) => {
              setFormField("username", value);
            },
            [setFormField],
          )}
          prefix={
            <CircularIcon>
              <AntDesign name="user" size={24} color="#247cff" />
            </CircularIcon>
          }
        />
        <MainTextField
          label="Password"
          keyboardType="default"
          value={password}
          onChangeText={useCallback(
            (value: string) => {
              setFormField("password", value);
            },
            [setFormField],
          )}
          prefix={
            <CircularIcon>
              <Entypo name="lock" size={24} color="#247cff" />
            </CircularIcon>
          }
        />
        <MainTextField
          label="Confirm Password"
          keyboardType="default"
          value={confirmPassword}
          onChangeText={useCallback(
            (value: string) => {
              setFormField("confirmPassword", value);
            },
            [setFormField],
          )}
          prefix={
            <CircularIcon>
              <Entypo name="lock" size={24} color="#247cff" />
            </CircularIcon>
          }
        />
        <MainButton
          title="Create account now"
          onPress={() => {
            router.replace("/home");
          }}
        />
      </AuthMainLayout>
    </>
  );
};

export default SubmitRegisterInfoScreen;
