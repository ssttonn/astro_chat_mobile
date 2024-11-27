import { View } from "react-native";
import React, { memo, ReactNode } from "react";
import Clickable, { ClickableProps } from "./Clickable";

interface CircularIconProps {
  children?: ReactNode;
  className?: string;
}

const CircularIcon = ({
  children,
  className,
  ...props
}: CircularIconProps & ClickableProps) => {
  console.log(
    "CircularIcon rendered: ",
    props.shouldDismissKeyboardWhenClicked,
  );
  return (
    <Clickable {...props} className={`bg-white rounded-full p-2 ${className}`}>
      {children}
    </Clickable>
  );
};

export default memo(CircularIcon);
