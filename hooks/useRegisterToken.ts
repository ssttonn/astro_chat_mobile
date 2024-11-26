import DBKey from "@/constants/dbKey";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

const useRegisterToken = () => {
  const getRegisterToken = useCallback(async () => {
    let registerToken = await SecureStore.getItemAsync(DBKey.REGISTER_TOKEN);
    let registerTokenExpiryDate = await SecureStore.getItemAsync(
      DBKey.REGISTER_TOKEN_EXPIRY_DATE,
    );

    if (!registerToken || !registerTokenExpiryDate) {
      throw new Error("Something went wrong. Please try again.");
    }

    if (new Date(registerTokenExpiryDate) < new Date()) {
      throw new Error("OTP has expired. Please request a new OTP.");
    }

    return registerToken;
  }, []);

  const saveRegisterToken = useCallback(
    async (registerToken: string, registerTokenExpiryDate: string) => {
      await Promise.all([
        SecureStore.setItemAsync(DBKey.REGISTER_TOKEN, registerToken),
        SecureStore.setItemAsync(
          DBKey.REGISTER_TOKEN_EXPIRY_DATE,
          registerTokenExpiryDate,
        ),
      ]);
    },
    [],
  );

  return { getRegisterToken, saveRegisterToken };
};

export default useRegisterToken;
