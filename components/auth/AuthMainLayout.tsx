import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthMainLayoutProps {
  children?: React.ReactNode;
  onBackPress?: () => void;
}

const AuthMainLayout = ({ children, onBackPress }: AuthMainLayoutProps) => {
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1 flex">
        <KeyboardAvoidingView
          className="flex-1 justify-center"
          enabled
          behavior="position"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="h-full"
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerClassName="w-[85%] sm:w-[70%] self-center grow gap-y-2 justify-center"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            className="absolute left-[28px] w-40 h-40"
          >
            <MaterialIcons name="arrow-back-ios" size={30} color="#247cff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default memo(AuthMainLayout);
