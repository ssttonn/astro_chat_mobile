import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import React from "react";

interface ClickableProps {
  children?: React.ReactNode;
  className?: string;
  onPress?: (e: any) => void;
}

const Clickable = ({ className, children, onPress }: ClickableProps) => {
  return (
    <TouchableOpacity
      onPress={(e) => {
        Keyboard.dismiss();
        onPress?.(e);
      }}
      className={className}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Clickable;
