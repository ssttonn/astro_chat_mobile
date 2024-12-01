export const APIRoutes = {
  login: "/auth/login",
  register: "/auth/register",
  verifyRegisterOtp: "/auth/register/verify",
  submitRegisterInfo: "/auth/register/submit-info",
  resendRegisterOtp: "/auth/register/resend-otp",
  refreshToken: "/auth/refresh-token",
  getProfile: "/profile/me",
  updateProfile: "/profile/me",
  getConversations: "/chat/conversation/me",
  getConversationMessages: (conversationId: string) =>
    `/chat/conversation/${conversationId}/messages`,
};
