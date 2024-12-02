import React, { memo } from "react";
import { Keyboard, TouchableOpacity } from "react-native";

export interface ClickableProps {
  children?: React.ReactNode;
  className?: string;
  shouldDismissKeyboardWhenClicked?: boolean;
  onPress?: (e: any) => void;
}

const Clickable = ({
  className,
  children,
  onPress,
  shouldDismissKeyboardWhenClicked = true,
}: ClickableProps) => {
  return (
    <TouchableOpacity
      onPress={(e) => {
        if (shouldDismissKeyboardWhenClicked) {
          Keyboard.dismiss();
          console.log("Keyboard dismissed");
        }
        onPress?.(e);
      }}
      disabled={!onPress}
      className={className}
    >
      {children}
    </TouchableOpacity>
  );
};

export default memo(Clickable);
