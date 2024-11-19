import loginAnimation from "../assets/animations/login.json";
import registerAnimation from "../assets/animations/register.json";
import verifyOTPAnimation from "../assets/animations/verify-otp.json";
import submitInfoAnimation from "../assets/animations/submit-info.json";
import forgotPasswordAnimation from "../assets/animations/forgot-password.json";
import splashAnimation from "../assets/animations/splash.json";
import loadingAnimation from "../assets/animations/loading.json";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";

const animations = {
  login: loginAnimation,
  register: registerAnimation,
  verifyOTP: verifyOTPAnimation,
  submitInfo: submitInfoAnimation,
  forgotPassword: forgotPasswordAnimation,
  splash: splashAnimation,
  loading: loadingAnimation,
};

const icons = {
  googleIcon,
  facebookIcon,
};

const Assets = {
  animations,
  icons,
};

export default Assets;
