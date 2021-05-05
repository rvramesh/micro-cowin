import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { useHistory } from "react-router";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  auth_date: number;
  hash: number;
}

type LoggedInUser = {
  firstName: string;
  lastName: string;
  roles: string[];
  jwtToken: string;
  isAuthenticated: true;
  isAdmin:boolean;
};

type AnonymousUser = {
  isAuthenticated: false;
};

type User = LoggedInUser | AnonymousUser;

type LoginUser = AnonymousUser & {
  setTelegramDetails: (loginDetails: TelegramUser) => void;
};

type UserContextProperties = (LoggedInUser & {
  logout:()=>void;
}) | LoginUser;

const getAuthorizedUserToken = async (loginDetails: TelegramUser) => {
  const { data } = await axios.post<{
    isAuthenticated: boolean;
    roles: string[];
    jwtToken: string;
  }>("/api/authorization/user/getToken", loginDetails);
  return data;
};

const AuthContext = createContext<UserContextProperties>({
  isAuthenticated: false,
  setTelegramDetails: (loginDetails: TelegramUser) => {},
});

export const useAuthContext=()=>useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<User>({ isAuthenticated: false });
  const history = useHistory();
  console.log("History", history);
  let providerValue;
  if (data.isAuthenticated) {
    providerValue = {...data,logout:()=>{setData({isAuthenticated:false})}};
  } else {
    const setTelegramDetails = async (loginDetails: TelegramUser) => {
      var loginStatus = await getAuthorizedUserToken(loginDetails);
      if (loginStatus.isAuthenticated) {
        setData({
          isAuthenticated: true,
          firstName: loginDetails.first_name,
          lastName: loginDetails.last_name,
          roles: loginStatus.roles,
          jwtToken: loginStatus.jwtToken,
          isAdmin:loginStatus.roles.includes("Admin")
        });
      }
    };
    providerValue = { ...data, setTelegramDetails };
  }

  useEffect(()=>{
    if(data.isAuthenticated) {
      const handle = setTimeout(()=>{
        setData({ isAuthenticated: false });
        alert("Timed out!");
      },20*60*1000);
      return ()=>{
        clearTimeout(handle);
      }
    }
  },[data.isAuthenticated])
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};
