import axios from "axios";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

axios.interceptors.request.use(
  (request) => {
    // Edit request config
    return request;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data.data.message;
    } else {
      return "An error occurred";
    }
  },
);

axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response.data;
  },
  (error) => {
    return Promise.reject(
      axios.isAxiosError(error)
        ? error.response?.data.data.message
        : "An error occurred",
    );
  },
);

const AxiosClient = axios;

export default AxiosClient;
