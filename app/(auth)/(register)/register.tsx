import {
  RegisterStatus,
  useRegisterStore,
} from "@/business/store/auth/registerStore";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import OAuthenticationMethods, {
  AuthMethod,
} from "@/components/auth/OAuthenticationMethods";
import CircularIcon from "@/components/common/CircularIcon";
import LoadingView from "@/components/common/LoadingView";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/Assets";
import useValidators from "@/hooks/useValidators";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RegisterScreen = () => {
  const {
    form: { email },
    setFormField,
    status,
    onRegister,
  } = useRegisterStore();

  const { emailValidator } = useValidators();

  const isButtonEnabled = useMemo(() => {
    return !emailValidator(email);
  }, [email, emailValidator]);

  return (
    <>
      <LoadingView isLoading={status === RegisterStatus.LOADING} />
      <AuthMainLayout onBackPress={router.back}>
        <LottieView
          style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
          source={Assets.animations.register}
          autoPlay
          loop
        />
        <Text className="text-5xl font-KelsonExtraBold">Register</Text>
        <Text className="text-xl font-KelsonMedium">
          Please enter your email to continue
        </Text>
        <MainTextField
          label="Email"
          keyboardType="email-address"
          value={email}
          prefix={
            <CircularIcon>
              <Entypo name="email" size={24} color="#247cff" />
            </CircularIcon>
          }
          onChangeText={useCallback(
            (value: string) => {
              setFormField("email", value);
            },
            [setFormField],
          )}
        />
        <MainButton
          title="Let go"
          isButtonEnabled={isButtonEnabled}
          containerClassName={isButtonEnabled ? "bg-primary" : "bg-gray-300"}
          onPress={useCallback(
            (e: any) => {
              onRegister(email);
            },
            [email, onRegister],
          )}
        />
        <OAuthenticationMethods
          methods={[AuthMethod.Google, AuthMethod.Facebook]}
        />
        <View className="flex flex-row gap-1 self-center mt-2">
          <Text className="text-center text-black font-KelsonBold">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={router.back}>
            <Text className="text-primary font-KelsonBold">Login</Text>
          </TouchableOpacity>
        </View>
      </AuthMainLayout>
    </>
  );
};

export default RegisterScreen;
