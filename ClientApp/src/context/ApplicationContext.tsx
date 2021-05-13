import { useQuery } from "react-query";
import axios from "axios";
import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { Backdrop, Card, CardBody } from "@windmill/react-ui";

export interface ApplicationConfigurationProperties {
  organizingBodyName: string;
  organizingBodyMemberName: string;
  organizingBodyFaqUrl: string;
  sourceUrl: string;
  identifierName: string;
  minYear: number;
  maxYear: number;
  vaccines: { [key: number]: string };
  enrollmentStatus: { [key: string]: string };
  maxEnrollmentPerUnit: number;
}
const getApplicationConfiguration = async () => {
  const { data } = await axios.get<ApplicationConfigurationProperties>(
    "/api/configuration/ApplicationConfiguration"
  );
  return data;
};
const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

function useApplicationConfiguration() {
  return useQuery("application-configuration", getApplicationConfiguration, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: twentyFourHoursInMs,
  });
}

const initialValues : ApplicationConfigurationProperties = {
  organizingBodyName: "",
  organizingBodyMemberName: "",
  organizingBodyFaqUrl: "",
  sourceUrl: "",
  identifierName: "",
  minYear: 2021 - 18,
  maxYear: 2021 - 110,
  vaccines: {},
  enrollmentStatus : {},
  maxEnrollmentPerUnit:8
};
const ApplicationContext = createContext<ApplicationConfigurationProperties>(
  initialValues
);

export const useApplicationContext= ()=>useContext(ApplicationContext);


export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useApplicationConfiguration();
  if (isLoading) {
    return (
      <Backdrop className="flex items-center">
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
          <div className="animate-spin ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-blue-500"></div>
        </div>
      </Backdrop>
    );
  } else if (isError || !data) {
    return (
      <Backdrop className="flex items-center p-4">
        <Card className="mb-8 shadow-md">
          <CardBody>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Oops! Something went wrong. Please reload
            </p>
          </CardBody>
        </Card>
      </Backdrop>
    );
  } else {
    return (
      <ApplicationContext.Provider value={{...initialValues, ...data}}>
        {children}
      </ApplicationContext.Provider>
    );
  }
};
