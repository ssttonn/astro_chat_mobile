import loginAnimation from "../assets/animations/login.json";
import registerAnimation from "../assets/animations/register.json";
import verifyOTPAnimation from "../assets/animations/verify-otp.json";
import submitInfoAnimation from "../assets/animations/submit-info.json";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";

const animations = {
  login: loginAnimation,
  register: registerAnimation,
  verifyOTP: verifyOTPAnimation,
  submitInfo: submitInfoAnimation,
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
