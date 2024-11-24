import AxiosClient from "./data/services/axiosClient";

interface BusinessConfig {
  baseURl?: string;
  apiURl?: string;
}

let Config: BusinessConfig = {
  baseURl: "",
  apiURl: "",
};

export const setConfig = (config: BusinessConfig) => {
  Config = config;

  AxiosClient.defaults.baseURL = Config.apiURl;
};

export { Config, AxiosClient };
