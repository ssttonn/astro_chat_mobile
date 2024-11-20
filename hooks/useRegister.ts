import { useEffect } from "react";
import Toast from "react-native-toast-message";

const useRegister = (
  errorMessage: string | undefined,
  setError: (errorMessage: string | undefined) => void,
  reset: () => void,
) => {
  useEffect(() => {
    if (errorMessage) {
      Toast.show({
        type: "error",
        text2: errorMessage,
      });
      setError(undefined);
    }
  }, [errorMessage, setError]);

  useEffect(() => {
    reset();
  }, [reset]);
};

export default useRegister;
