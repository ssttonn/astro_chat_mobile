import { APIRoutes } from "@/constants/apiRoutes";
import DBKey from "@/constants/dbKey";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

axios.interceptors.request.use(
  async (request) => {
    // Edit request config

    let accessToken = await SecureStore.getItemAsync(DBKey.ACCESS_TOKEN);
    let refreshToken: any = await SecureStore.getItemAsync(DBKey.REFRESH_TOKEN);
    const accessTokenExpiryDate = await SecureStore.getItemAsync(
      DBKey.ACCESS_TOKEN_EXPIRY_DATE
    );
    const refreshTokenExpiryDate = await SecureStore.getItemAsync(
      DBKey.REFRESH_TOKEN_EXPIRY_DATE
    );

    if (!accessToken || !accessTokenExpiryDate) {
      return request;
    }

    const hasAccessTokenExpired = !(
      new Date(accessTokenExpiryDate) > new Date()
    );

    if (hasAccessTokenExpired) {
      if (!refreshToken || !refreshTokenExpiryDate) {
        return request;
      }

      const hasRefreshTokenExpired = !(
        new Date(refreshTokenExpiryDate) > new Date()
      );

      if (hasRefreshTokenExpired) {
        return request;
      }

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
          newAccessTokenExpiryDate
        ),
        SecureStore.setItemAsync(
          DBKey.REFRESH_TOKEN_EXPIRY_DATE,
          newRefreshTokenExpiryDate
        ),
      ]);

      accessToken = newAccessToken;
    }

    request.headers.Authorization = `Bearer ${accessToken}`;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(
      axios.isAxiosError(error)
        ? error.response?.data.data?.message
        : "An error occurred"
    );
  }
);

let AxiosClient = axios;

export default AxiosClient;
