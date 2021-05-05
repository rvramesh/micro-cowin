import  { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Windmill } from "@windmill/react-ui";
import ThemedSuspense from "./components/ThemedSuspense";
import { SidebarProvider } from "./context/SidebarContext";
import myTheme from "./myTheme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ApplicationProvider } from "./context/ApplicationContext";
import { AuthProvider } from "./context/AuthenticationContext";

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider>
        <AuthProvider>
          <SidebarProvider>
            <Suspense fallback={<ThemedSuspense />}>
              <Windmill usePreferences={true} theme={myTheme}>
                <App />
              </Windmill>
            </Suspense>
          </SidebarProvider>
        </AuthProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
