export enum RegisterStatus {
  IDLE = "idle",
  LOADING = "loading",
}

interface RegisterStore {
  form: {
    email: string;
  };
  errorMessage?: string;
  status: RegisterStatus;
  setFieldValue: (key: string, value: string) => void;
  setFormField: (key: string, value: string) => void;
  onRegister: (email: string) => void;
  reset: () => void;
}
