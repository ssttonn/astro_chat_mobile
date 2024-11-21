import axios from "axios";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

axios.interceptors.request.use(
  (request) => {
    // Edit request config
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response.data;
  },
  (error) => {
    console.log("abc: ", error.response?.data.data.message);
    return Promise.reject(
      axios.isAxiosError(error)
        ? error.response?.data.data.message
        : "An error occurred",
    );
  },
);

const AxiosClient = axios;

export default AxiosClient;
