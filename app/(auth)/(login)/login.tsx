import { LoginStatus, useLoginStore } from "@/business/store/auth/loginStore";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import OAuthenticationMethods, {
  AuthMethod,
} from "@/components/auth/OAuthenticationMethods";
import CircularIcon from "@/components/common/CircularIcon";
import LoadingView from "@/components/common/LoadingView";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/assets";
import ScreenRoutes from "@/constants/screenRoutes";
import useAccessToken from "@/hooks/useAccessToken";
import useValidators from "@/hooks/useValidators";
import { Entypo, Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { emailValidator, passwordValidator } = useValidators();

  const {
    form: { email, password },
    setFormField,
    errorMessage,
    status,
    setError,
    onLogin,
    reset,
  } = useLoginStore();

  const isButtonEnabled = useMemo(() => {
    return !emailValidator(email) && !passwordValidator(password);
  }, [email, password, emailValidator, passwordValidator]);

  const oAuthMethods = useMemo(
    () => [AuthMethod.Google, AuthMethod.Facebook],
    [],
  );

  const { setAccessToken } = useAccessToken();

  const loginWithEmailAndPassword = useCallback(async () => {
    try {
      const {
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
        refreshTokenExpiryDate,
      } = await onLogin(email, password);

      if (!accessToken) {
        return;
      }

      await setAccessToken(
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
        refreshTokenExpiryDate,
      );

      Toast.show({
        type: "success",
        text2: "Welcome back to #astrochat",
      });

      router.replace(ScreenRoutes.home);
    } catch (error) {
      console.log(error);
    }
  }, [email, password, onLogin, setAccessToken]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (errorMessage) {
      Toast.show({
        type: "error",
        text2: errorMessage,
      });

      setError(undefined);
    }
  }, [errorMessage, setError]);

  return (
    <>
      <LoadingView isLoading={status === LoginStatus.LOADING} />
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
        <MainTextField
          label="Email"
          type="email"
          value={email}
          keyboardType="email-address"
          validator={emailValidator}
          onChangeText={useCallback(
            (value: string) => setFormField("email", value),
            [setFormField],
          )}
          prefix={useMemo(
            () => (
              <CircularIcon>
                <Entypo name="email" size={24} color="#247cff" />
              </CircularIcon>
            ),
            [],
          )}
        />
        <MainTextField
          label="Password"
          type="password"
          keyboardType="default"
          value={password}
          validator={passwordValidator}
          onChangeText={useCallback(
            (value: string) => setFormField("password", value),
            [setFormField],
          )}
          prefix={useMemo(
            () => (
              <CircularIcon>
                <Entypo name="lock" size={24} color="#247cff" />
              </CircularIcon>
            ),
            [],
          )}
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

        <Link
          href={ScreenRoutes.forgotPassword}
          className="text-primary my-2 font-KelsonBold self-end"
        >
          Forgot password?
        </Link>
        <MainButton
          title="Login now"
          isButtonEnabled={isButtonEnabled}
          onPress={loginWithEmailAndPassword}
        />
        <OAuthenticationMethods
          methods={oAuthMethods}
          onPress={useCallback((method: AuthMethod) => {}, [])}
        />
        <View className="flex flex-row gap-1 self-center mt-2">
          <Text className="text-center text-black font-KelsonBold">
            Don't have an account?
          </Text>
          <Link
            href={"/(auth)/(register)/register"}
            className="text-primary font-KelsonBold"
          >
            Register
          </Link>
        </View>
      </AuthMainLayout>
    </>
  );
};

export default LoginScreen;
