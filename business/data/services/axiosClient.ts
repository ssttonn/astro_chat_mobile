import { APIRoutes } from "@/constants/APIRoutes";
import DBKey from "@/constants/DBKey";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

axios.interceptors.request.use(
  async (request) => {
    // Edit request config

    if (!request.headers["AuthRoutes"]) {
      return request;
    }

    const accessToken = await SecureStore.getItemAsync(DBKey.ACCESS_TOKEN);
    let refreshToken: any = await SecureStore.getItemAsync(DBKey.REFRESH_TOKEN);
    const accessTokenExpiryDate = await SecureStore.getItemAsync(
      DBKey.ACCESS_TOKEN_EXPIRY_DATE,
    );
    const refreshTokenExpiryDate = await SecureStore.getItemAsync(
      DBKey.REFRESH_TOKEN_EXPIRY_DATE,
    );
    if (
      accessToken &&
      accessTokenExpiryDate &&
      new Date(accessTokenExpiryDate) > new Date()
    ) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    } else if (
      refreshToken &&
      refreshTokenExpiryDate &&
      new Date(refreshTokenExpiryDate) > new Date()
    ) {
      // Call refresh token API
      const response = await AxiosClient.post(APIRoutes.refreshToken, {
        refreshToken,
      });

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiryDate: newAccessTokenExpiryDate,
        refreshTokenExpiryDate: newRefreshTokenExpiryDate,
      } = response.data.data;

      await Promise.all([
        SecureStore.setItemAsync(DBKey.ACCESS_TOKEN, newAccessToken),
        SecureStore.setItemAsync(DBKey.REFRESH_TOKEN, newRefreshToken),
        SecureStore.setItemAsync(
          DBKey.ACCESS_TOKEN_EXPIRY_DATE,
          newAccessTokenExpiryDate,
        ),
        SecureStore.setItemAsync(
          DBKey.REFRESH_TOKEN_EXPIRY_DATE,
          newRefreshTokenExpiryDate,
        ),
      ]);

      request.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response.data;
  },
  (error) => {
    return Promise.reject(
      axios.isAxiosError(error)
        ? error.response?.data.data.message
        : "An error occurred",
    );
  },
);

let AxiosClient = axios;

export default AxiosClient;
