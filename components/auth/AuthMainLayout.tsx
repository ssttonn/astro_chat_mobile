import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

interface AuthMainLayoutProps {
  children?: React.ReactNode;
  onBackPress?: () => void;
}

const AuthMainLayout = ({ children, onBackPress }: AuthMainLayoutProps) => {
  return (
    <SafeAreaView className="bg-white flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex flex-1 h-[80vh] justify-center items-stretch w-[85%] self-center gap-2">
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              className="absolute left-0 top-0"
            >
              <MaterialIcons name="arrow-back-ios" size={30} color="#247cff" />
            </TouchableOpacity>
          )}
          {children}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AuthMainLayout;
