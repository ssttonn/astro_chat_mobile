import { Href } from "expo-router";

const ScreenRoutes = {
  login: "/(auth)/(login)/login" as Href,
  register: "/(auth)/(register)/register" as Href,
  verifyRegisterOtp: "/(auth)/(register)/verify-register-otp" as Href,
  submitRegisterInfo: "/(auth)/(register)/submit-register-info" as Href,
  forgotPassword: "/(auth)/(forgot-password)/forgot-password" as Href,
  resetPassword: "/(auth)/(forgot-password)/reset-password" as Href,
  home: "/(tabs)/home" as Href,
  profile: "/(tabs)/profile" as Href,
  notifications: "/(tabs)/notifications" as Href,
  recentMessages: "/(tabs)/conversations" as Href,
  conversationDetail: (conversationId: string) =>
    `/(messages)/conversation-room?conversationId=${conversationId}` as Href,
  newConversation: "/(messages)/new-conversation" as Href,
};

export default ScreenRoutes;
