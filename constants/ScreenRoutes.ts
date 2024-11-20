import { Href } from "expo-router";

const ScreenRoutes = {
  register: "/(auth)/(register)/register" as Href,
  verifyRegisterOtp: "/(auth)/(register)/verify-register-otp" as Href,
  submitRegisterInfo: "/(auth)/(register)/submit-register-info" as Href,
};

export default ScreenRoutes;
