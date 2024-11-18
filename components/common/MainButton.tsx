import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";

interface MainButtonProps {
  children?: React.ReactNode;
  title?: string;
  containerClassName?: string;
  titleClassName?: string;
  onPress?: (e: any) => void;
  isButtonEnabled?: boolean;
}

const MainButton = ({
  children,
  title,
  containerClassName,
  titleClassName,
  onPress,
  isButtonEnabled = true,
}: MainButtonProps) => {
  return (
    <TouchableOpacity
      onPress={isButtonEnabled ? onPress : undefined}
      className={`bg-primary items-center justify-center py-4 rounded-2xl ${!isButtonEnabled ? "pointer-events-none" : ""} ${containerClassName}`}
    >
      {children || (
        <Text
          className={`text-xl text-white font-KelsonBold ${titleClassName}`}
        >
          {title || ""}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(MainButton);
