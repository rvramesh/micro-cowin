import axios from "axios";

const customAxios = (token:string, onError:(code:"400"|"401"|"404",message:string)=>void) => {
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
       onError("400", "Network Error! Please check your internet connection and try again.");
     } else {
       const code = error.response.status;
       if (code === 400 && error.response.data.type==="Error" && error.response.data.message) {
         onError("400", error.response.data.message)
       } else if (code === 400 && error.response.data.title) {
         onError("400", error.response.data.title);
       } else if(code === 401) {
         onError("401", "Not Authorized");
       } else if(code === 404) {
         onError("404", "Not Found");
       }
     }
     return Promise.reject(error);
  });

  return axiosInstance;
};

export default customAxios;
