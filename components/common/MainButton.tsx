import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";
import Clickable from "./Clickable";

interface MainButtonProps {
  children?: React.ReactNode;
  title?: string;
  containerClassName?: string;
  backgroundClassName?: string;
  titleClassName?: string;
  onPress?: (e: any) => void;
  isButtonEnabled?: boolean;
}

const MainButton = ({
  children,
  title,
  containerClassName,
  backgroundClassName,
  titleClassName,
  onPress,
  isButtonEnabled = true,
}: MainButtonProps) => {
  return (
    <Clickable
      onPress={isButtonEnabled ? onPress : undefined}
      className={`${isButtonEnabled ? `${backgroundClassName || "bg-primary"}` : "bg-gray-300"} items-center justify-center py-4 rounded-2xl ${!isButtonEnabled ? "pointer-events-none" : ""} ${containerClassName}`}
    >
      {children || (
        <Text
          className={`text-xl text-white font-KelsonBold ${titleClassName}`}
        >
          {title || ""}
        </Text>
      )}
    </Clickable>
  );
};

export default memo(MainButton);
