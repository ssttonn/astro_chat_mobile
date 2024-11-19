import { LoginStatus, useLoginStore } from "@/business/store/auth/loginStore";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import OAuthenticationMethods, {
  AuthMethod,
} from "@/components/auth/OAuthenticationMethods";
import CircularIcon from "@/components/common/CircularIcon";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/Assets";
import useValidators from "@/hooks/useValidators";
import { Entypo, Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import DBKey from "@/constants/DBKey";

const LoginScreen = () => {
  const { emailValidator, passwordValidator } = useValidators();

  const {
    form: { email, password },
    status,
    errorMessage,
    token,
    refreshToken,
    accessTokenExpiryDate,
    refreshTokenExpiryDate,
    setFormField,
    setFieldValue,
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

  const loginWithEmailAndPassword = useCallback(() => {
    onLogin(email, password);
  }, [email, password, onLogin]);

  useEffect(() => {
    if (
      token &&
      refreshToken &&
      accessTokenExpiryDate &&
      refreshTokenExpiryDate
    ) {
      Promise.all([
        SecureStore.setItemAsync(DBKey.TOKEN, token),
        SecureStore.setItemAsync(DBKey.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync(
          DBKey.TOKEN_EXPIRY_DATE,
          accessTokenExpiryDate,
        ),
        SecureStore.setItemAsync(
          DBKey.REFRESH_TOKEN_EXPIRY_DATE,
          refreshTokenExpiryDate,
        ),
      ]).then(() => {
        router.replace("/home");
      });
    }
  }, [token, refreshToken, accessTokenExpiryDate, refreshTokenExpiryDate]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

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
      <MainTextField
        label="Email"
        value={email}
        keyboardType="email-address"
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
        keyboardType="default"
        value={password}
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
        href={"/forgot-password"}
        className="text-primary my-2 font-KelsonBold self-end"
      >
        Forgot password?
      </Link>
      <MainButton
        title="Login"
        isButtonEnabled={isButtonEnabled}
        onPress={loginWithEmailAndPassword}
        containerClassName={`${isButtonEnabled ? "" : "opacity-50"}`}
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
  );
};

export default LoginScreen;
