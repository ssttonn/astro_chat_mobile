import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface MainButtonProps {
  children?: React.ReactNode;
  title?: string;
  containerClassName?: string;
  titleClassName?: string;
}

const MainButton = ({
  children,
  title,
  containerClassName,
  titleClassName,
}: MainButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-primary items-center justify-center py-4 rounded-2xl ${containerClassName}`}
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

export default MainButton;
