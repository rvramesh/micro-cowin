import { lazy } from "react";
import {
    Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import Header from "./components/Header";
import { useAuthContext } from "./context/AuthenticationContext";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const SessionTimeout = lazy(() => import("./pages/SessionTimeout"));
const Page404 = lazy(() => import("./pages/404"));
function App() {
  const { isAuthenticated } = useAuthContext();
  return (
    <>
      <AccessibleNavigationAnnouncer />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 false w-full">
        <div className="flex flex-col flex-1 w-full">
          <Header />

          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/sessiontimeout" component={SessionTimeout} />
            <Route
              path="/app"
              render={() =>
                isAuthenticated ? <Layout /> : <Redirect to="/sessiontimeout" />
              }
            />
            <Redirect exact from="/" to="/login" />
            <Route component={Page404} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default App;
