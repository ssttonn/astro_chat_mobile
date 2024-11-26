import { RegisterStatus } from "@/business/store/auth/register/registerStore";
import { useSubmitUserInfoStore } from "@/business/store/auth/register/submitUserInfoStore";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import CircularIcon from "@/components/common/CircularIcon";
import LoadingView from "@/components/common/LoadingView";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/assets";
import useAccessToken from "@/hooks/useAccessToken";
import useRegister from "@/hooks/useRegister";
import useRegisterToken from "@/hooks/useRegisterToken";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import useValidators from "@/hooks/useValidators";
import ScreenRoutes from "@/constants/screen_routes";
import Toast from "react-native-toast-message";

const SubmitRegisterInfoScreen = () => {
  const {
    form: { username, password, confirmPassword },
    status,
    setFormField,
    onSubmitUserInfo,
    errorMessage,
    setError,
    reset,
  } = useSubmitUserInfoStore();

  useRegister(errorMessage, setError, reset);

  const { getRegisterToken } = useRegisterToken();

  const { setAccessToken } = useAccessToken();

  const onSubmitRegisterInfo = useCallback(async () => {
    try {
      const registerToken = await getRegisterToken();

      let result = await onSubmitUserInfo(
        {
          username,
          password,
        },
        registerToken,
      );

      if (!result) {
        return;
      }

      const {
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
        refreshTokenExpiryDate,
      } = result;

      await setAccessToken(
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
        refreshTokenExpiryDate,
      );

      Toast.show({
        type: "success",
        text2: "Account created successfully, welcome!",
      });

      router.replace(ScreenRoutes.home);
    } catch (error) {
      console.log(error);
      setError(error as string | undefined);
    }
  }, [
    setAccessToken,
    getRegisterToken,
    onSubmitUserInfo,
    username,
    password,
    setError,
  ]);

  const { passwordValidator, confirmPasswordValidator, fieldValidator } =
    useValidators();

  const isButtonEnabled = useMemo(() => {
    return (
      !passwordValidator(password) &&
      !fieldValidator("Username", username) &&
      !confirmPasswordValidator(password, confirmPassword)
    );
  }, [
    passwordValidator,
    confirmPasswordValidator,
    fieldValidator,
    password,
    username,
    confirmPassword,
  ]);

  return (
    <>
      <LoadingView isLoading={status === RegisterStatus.LOADING} />
      <AuthMainLayout
        onBackPress={useCallback(() => {
          router.back();
        }, [])}
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
          type="text"
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
          type="password"
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
          suffix={useCallback(
            (
              isTextObscured: boolean,
              setIsObscured: (isTextObscured: boolean) => void,
            ) => (
              <TouchableOpacity
                className="mr-1"
                onPress={() => setIsObscured(!isTextObscured)}
              >
                <Feather
                  name={!isTextObscured ? "eye" : "eye-off"}
                  size={24}
                  color="#247cff"
                />
              </TouchableOpacity>
            ),
            [],
          )}
        />
        <MainTextField
          label="Confirm Password"
          type="password"
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
          suffix={useCallback(
            (
              isTextObscured: boolean,
              setIsObscured: (isTextObscured: boolean) => void,
            ) => (
              <TouchableOpacity
                className="mr-1"
                onPress={() => setIsObscured(!isTextObscured)}
              >
                <Feather
                  name={!isTextObscured ? "eye" : "eye-off"}
                  size={24}
                  color="#247cff"
                />
              </TouchableOpacity>
            ),
            [],
          )}
        />
        <MainButton
          title="Create account now"
          containerClassName={`${isButtonEnabled ? "bg-primary" : "bg-gray-300"}`}
          isButtonEnabled={isButtonEnabled}
          onPress={onSubmitRegisterInfo}
        />
      </AuthMainLayout>
    </>
  );
};

export default SubmitRegisterInfoScreen;
