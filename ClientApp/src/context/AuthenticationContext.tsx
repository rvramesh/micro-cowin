import  axios, { AxiosInstance } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { useHistory } from "react-router";
import authAxios from "./custom-axios";
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

type UserContextProperties =
  | (LoggedInUser & { refetchToken: () => void; logout: () => void; getAxiosWithToken:()=>AxiosInstance; })
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
  console.log("History", history);
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
      getAxiosWithToken:() => {
        return authAxios(data.jwtToken);
      }
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
        alert("Timed out!");
      }, 20 * 60 * 1000);
      return () => {
        clearTimeout(handle);
      };
    }
  }, [data.isAuthenticated]);
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};
