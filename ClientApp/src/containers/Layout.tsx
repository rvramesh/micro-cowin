import { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import routes from "../routes";

import ThemedSuspense from "../components/ThemedSuspense";
//import { SidebarContext } from "../context/SidebarContext";
import Main from "./Main";
import { useAuthContext } from "../context/AuthenticationContext";

const Page404 = lazy(() => import("../pages/404"));


const Terms = lazy(() => import("../pages/Terms"));

function Layout() {
  //const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  //let location = useLocation();

  // useEffect(() => {
  //   closeSidebar();
  // }, [closeSidebar, location]);
  const userData = useAuthContext();
  const acceptedTerms = userData.isAuthenticated && userData.hasAcceptedTerms;
  return (
    <Main>
      <Suspense fallback={<ThemedSuspense />}>
        <Switch>
          <Route path="/app/terms" render={()=><Terms/>}/>
          { !acceptedTerms && <Redirect to="/app/terms" />}
          {routes.map((route, i) => {
            const { component: Component } = route;
            return Component ? (
              <Route
                key={i}
                exact={true}
                path={`/app${route.path}`}
                render={() => <Component />}
              />
            ) : null;
          })}
          <Redirect exact from="/app" to="/app/dashboard" />
          <Route component={Page404} />
        </Switch>
      </Suspense>
    </Main>
  );
}

export default Layout;
