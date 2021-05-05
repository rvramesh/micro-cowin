import { useContext, Suspense, useEffect, lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import routes from "../routes";

import ThemedSuspense from "../components/ThemedSuspense";
import { SidebarContext } from "../context/SidebarContext";

const Page404 = lazy(() => import("../pages/404"));

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  let location = useLocation();

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar, location]);

  return (
    <Suspense fallback={<ThemedSuspense />}>
      <Switch>
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
  );
}

export default Layout;
