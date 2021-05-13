import axios from "axios";

const customAxios = (token:string, onError:(message:string)=>void) => {
  // axios instance for making requests
  const axiosInstance = axios.create();

  // request interceptor for adding token
  axiosInstance.interceptors.request.use((config) => {
    // add token to request headers
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  // response interceptor for adding token
  axiosInstance.interceptors.response.use(undefined, (error)=>{
     if (!error.response) {
       onError("NETWORK ERROR");
     } else {
       const code = error.response.status;
       if (code === 400 && error.response.data.type==="Error" && error.response.data.message) {
         onError(error.response.data.message)
       } else if (code === 400 && error.response.data.title) {
         onError(error.response.data.title);
       }
     }
     return Promise.reject(error);
  });

  return axiosInstance;
};

export default customAxios;
