import { TextInput, TextInputProps, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

interface MainTextFieldProps {
  label: string;
  icon?: React.ReactNode;
}

const MainTextField = ({ label, icon }: MainTextFieldProps) => {
  return (
    <View className="flex flex-row gap-2 bg-whiteGrey-100 p-3 rounded-2xl w-full focus:border-primary focus:border-2">
      <View className="bg-white rounded-full p-2">
        {icon || <Entypo name={"email"} size={24} color="#247cff" />}
      </View>

      <TextInput
        className="flex-1"
        placeholder={label}
        placeholderTextColor="black"
      />
    </View>
  );
};

export default MainTextField;
