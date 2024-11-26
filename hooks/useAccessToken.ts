import DBKey from "@/constants/dbKey";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

const useAccessToken = () => {
  const getAccessToken = useCallback(async () => {
    let [accessToken, accessTokenExpiryDate] = await Promise.all([
      SecureStore.getItemAsync(DBKey.ACCESS_TOKEN),
      SecureStore.getItemAsync(DBKey.ACCESS_TOKEN_EXPIRY_DATE),
    ]);

    if (!accessToken || !accessTokenExpiryDate) {
      throw new Error("Something went wrong. Please try again.");
    }

    if (new Date(accessTokenExpiryDate) < new Date()) {
      throw new Error("Access token has expired. Please login again.");
    }

    return accessToken;
  }, []);

  const setAccessToken = useCallback(
    (
      accessToken: string,
      accessTokenExpiryDate: string,
      refreshToken: string,
      refreshTokenExpiryDate: string,
    ) => {
      return Promise.all([
        SecureStore.setItemAsync(DBKey.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(
          DBKey.ACCESS_TOKEN_EXPIRY_DATE,
          accessTokenExpiryDate,
        ),
        SecureStore.setItemAsync(DBKey.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync(
          DBKey.REFRESH_TOKEN_EXPIRY_DATE,
          refreshTokenExpiryDate,
        ),
      ]);
    },
    [],
  );

  const removeAccessToken = useCallback(() => {
    return Promise.all([
      SecureStore.deleteItemAsync(DBKey.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(DBKey.ACCESS_TOKEN_EXPIRY_DATE),
      SecureStore.deleteItemAsync(DBKey.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(DBKey.REFRESH_TOKEN_EXPIRY_DATE),
    ]);
  }, []);

  return {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
  };
};

export default useAccessToken;
