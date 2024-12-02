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
  fetchConversation: (conversationId: string) =>
    `/chat/conversation/${conversationId}`,
  sendMessage: "/chat/conversation/message",
  editMessage: (messageId: string) => `/chat/conversation/message/${messageId}`,
  deleteMessage: (messageId: string) =>
    `/chat/conversation/message/${messageId}`,
};
