import React, { memo } from "react";
import { Image } from "react-native";

interface UserAvatarProps {
  size?: number;
  avatarUrl?: string;
  className?: string;
}

const UserAvatar = ({ size, avatarUrl, className }: UserAvatarProps) => {
  return (
    <Image
      source={{
        uri: avatarUrl,
      }}
      resizeMode="cover"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
};

export default memo(UserAvatar);
