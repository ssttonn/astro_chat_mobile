import Assets from "@/constants/assets";
import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";
import MainButton from "../common/MainButton";

export enum AuthMethod {
  Google,
  Facebook,
}

interface OAuthenticationMethodProps {
  methods?: AuthMethod[];
  onPress?: (method: AuthMethod) => void;
}

const OAuthenticationMethods = ({
  methods,
  onPress,
}: OAuthenticationMethodProps) => {
  console.log("OAuthenticationMethods");
  const methodTitle = useCallback((method: AuthMethod) => {
    switch (method) {
      case AuthMethod.Google:
        return "Google";
      case AuthMethod.Facebook:
        return "Facebook";
      default:
        return "";
    }
  }, []);

  const methodIcon = useCallback((method: AuthMethod) => {
    switch (method) {
      case AuthMethod.Google:
        return <Assets.icons.googleIcon width={25} height={25} />;
      case AuthMethod.Facebook:
        return <Assets.icons.facebookIcon width={25} height={25} />;
      default:
        return null;
    }
  }, []);

  if (!methods) {
    return null;
  }

  return (
    <View className="gap-3">
      <View className="flex flex-row items-center mt-2 gap-2">
        <View className="border-2 border-whiteGrey-300 flex-1 rounded-full" />
        <Text className="font-KelsonRegular">OR CONTINUE WITH</Text>
        <View className="border-2 border-whiteGrey-300 flex-1 rounded-full" />
      </View>
      <View className="flex flex-row flex-wrap justify-between gap-2">
        {methods?.map((method, index) => (
          <MainButton
            key={index}
            onPress={() => onPress && onPress(method)}
            containerClassName="bg-whiteGrey-300 min-w-[48%] flex-row gap-2 justify-center overflow-hidden"
          >
            {methodIcon(method)}
            <Text className="text-black font-KelsonBold">
              {methodTitle(method)}
            </Text>
          </MainButton>
        ))}
      </View>
    </View>
  );
};

export default memo(OAuthenticationMethods);
