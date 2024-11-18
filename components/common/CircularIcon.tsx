import { View } from "react-native";
import React, { memo, ReactNode } from "react";

interface CircularIconProps {
  children: ReactNode;
}

const CircularIcon = ({ children }: CircularIconProps) => {
  return <View className="bg-white rounded-full p-2">{children}</View>;
};

export default memo(CircularIcon);
