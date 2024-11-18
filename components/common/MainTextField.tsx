import React, { memo, useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";

interface MainTextFieldProps {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
  prefix?: React.ReactNode;
  suffix?:
    | React.ReactNode
    | ((
        obscured: boolean,
        setObscured: (obscured: boolean) => void,
      ) => React.ReactNode);
}

const MainTextField = ({
  label,
  prefix,
  suffix,
  containerClassName,
  inputClassName,
  ...props
}: MainTextFieldProps & TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTextObscured, setIsObscured] = useState(label === "Password");

  return (
    <View
      className={`flex flex-row items-center gap-2 bg-whiteGrey-100 p-3 rounded-2xl w-full ${isFocused ? "border-2 border-primary" : "border-2 border-transparent"} ${containerClassName}`}
    >
      {prefix}
      <TextInput
        className={`flex-1 font-KelsonRegular text-[15px] placeholder:self-center ${inputClassName}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={isTextObscured}
        placeholder={label}
        placeholderTextColor="#757d90"
        {...props}
      />

      {typeof suffix === "function"
        ? suffix(isTextObscured, setIsObscured)
        : suffix}
    </View>
  );
};

export default memo(MainTextField);
