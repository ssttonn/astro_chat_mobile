import { useCallback } from "react";

const useValidators = () => {
  const emailValidator = useCallback((email: string) => {
    if (!email) return "Email is required";

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return "Invalid email address";

    return undefined;
  }, []);

  const passwordValidator = useCallback((password: string) => {
    if (!password) return "Password is required";

    if (password.length < 8)
      return "Password must be at least 8 characters long";

    return undefined;
  }, []);

  const fieldValidator = useCallback((field: string, value: string) => {
    if (!value) return `${field} is required`;

    return undefined;
  }, []);

  return {
    emailValidator,
    passwordValidator,
    fieldValidator,
  };
};

export default useValidators;
