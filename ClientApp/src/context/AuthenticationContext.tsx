import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import authAxios from "./custom-axios";
import "react-toastify/dist/ReactToastify.min.css";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  auth_date: number;
  hash: number;
}

type LoggedInUser = TelegramUser & {
  roles: string[];
  jwtToken: string;
  isAuthenticated: true;
  isAdmin: boolean;
  hasAcceptedTerms: boolean;
};

type AnonymousUser = {
  isAuthenticated: false;
};

type UserContext = LoggedInUser | AnonymousUser;

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

type UserContextProperties =
  | (LoggedInUser & {
      refetchToken: () => void;
      logout: () => void;
      getAxiosWithToken: () => AxiosInstance;
    })
  | (AnonymousUser & { login: (loginDetails: TelegramUser) => void });

const getAuthorizedUserToken = async (loginDetails: TelegramUser) => {
  const { data } = await axios.post<{
    isAuthenticated: boolean;
    roles: string[];
    jwtToken: string;
  }>("/api/authorization/user/getToken", loginDetails);
  return data;
};

const getUserContextData = async (
  loginDetails: TelegramUser
): Promise<UserContext> => {
  var loginStatus = await getAuthorizedUserToken(loginDetails);
  if (loginStatus.isAuthenticated) {
    return {
      ...loginDetails,
      isAuthenticated: true,
      roles: loginStatus.roles,
      jwtToken: loginStatus.jwtToken,
      isAdmin: loginStatus.roles.includes("Admin"),
      hasAcceptedTerms: loginStatus.roles.includes("AcceptedTerms"),
    };
  } else {
    return {
      isAuthenticated: false,
    };
  }
};
const AuthContext = createContext<UserContextProperties>({
  isAuthenticated: false,
  login: (loginDetails) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuthenticatedContext = () => {
  var authContext = useContext(AuthContext);
  if (authContext.isAuthenticated) {
    return authContext;
  } else {
    throw new Error("Not Authenticated");
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserContext>({
    isAuthenticated: false,
  });
  const history = useHistory();
  const handleAxiosErrors = (code: "400" | "401" | "404", message: string) => {
    switch (code) {
      case "400":
        toast.error(message);
        break;
      case "401":
        history.push("/app/unauthorized");
        break;
      case "404":
        history.push("/app/notfound");
        break;
    }
  };
  let providerValue: UserContextProperties;
  if (data.isAuthenticated) {
    providerValue = {
      ...data,
      logout: () => {
        setData({ isAuthenticated: false });
      },
      refetchToken: async () => {
        var loginStatus = await getUserContextData(data);
        setData(loginStatus);
      },
      getAxiosWithToken: () => {
        return authAxios(data.jwtToken, handleAxiosErrors);
      },
    };
  } else {
    providerValue = {
      ...data,
      login: async (loginDetails: TelegramUser) => {
        var loginStatus = await getUserContextData(loginDetails);
        setData(loginStatus);
      },
    };
  }

  useEffect(() => {
    if (data.isAuthenticated) {
      const handle = setTimeout(() => {
        setData({ isAuthenticated: false });
      }, 20 * 60 * 1000);
      return () => {
        clearTimeout(handle);
      };
    }
  }, [data.isAuthenticated]);
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
      <ToastContainer
        toastClassName={(context) =>
          contextClass[context?.type || "default"] +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        bodyClassName={() => "text-sm font-white font-med block p-3"}
        position="bottom-center"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </AuthContext.Provider>
  );
};
