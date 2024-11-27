import React, { memo, useState } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

interface MainTextFieldProps {
  label: string;
  type: string;
  containerClassName?: string;
  inputClassName?: string;
  prefix?: React.ReactNode;
  validator?: (value: string) => string | undefined;
  suffix?:
    | React.ReactNode
    | ((
        obscured: boolean,
        setObscured: (obscured: boolean) => void,
      ) => React.ReactNode);
}

const MainTextField = (
  {
    label,
    type,
    prefix,
    suffix,
    containerClassName,
    inputClassName,
    value,
    validator,
    ...props
  }: MainTextFieldProps & TextInputProps,
  ref?: any,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTextObscured, setIsObscured] = useState(type === "password");

  console.log("MainTextField rendered: ", label);
  return (
    <View
      ref={ref}
      className={`flex items-center gap-2 bg-whiteGrey-100 p-3 rounded-2xl ${isFocused ? "border-2 border-primary" : "border-2 border-transparent"} ${containerClassName}`}
    >
      <View className="flex flex-row items-center">
        {prefix}
        <TextInput
          className={`flex-1 font-KelsonRegular text-[15px] placeholder:self-center ${inputClassName}`}
          value={value}
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

      <View
        className={`absolute bg-white border-red-500 border-2 px-2 py-1 rounded-xl bottom-[-10] z-10 ${(value ? validator?.call(this, value) : undefined) ? "opacity-1" : "opacity-0"}`}
      >
        <Text className=" text-red-500 font-KelsonBold text-[12px]">
          {validator?.call(this, value!)}
        </Text>
      </View>
    </View>
  );
};

export default memo(React.forwardRef(MainTextField));
