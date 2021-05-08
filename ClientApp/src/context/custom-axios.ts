import axios from "axios";

const customAxios = (token:string) => {
  // axios instance for making requests
  const axiosInstance = axios.create();

  // request interceptor for adding token
  axiosInstance.interceptors.request.use((config) => {
    // add token to request headers
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });


  return axiosInstance;
};

export default customAxios;
