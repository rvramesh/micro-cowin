import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Page404 = lazy(() => import('../pages/404'))
const Page401 = lazy(() => import("../pages/401"));

const Enrollment = lazy(()=>import("../pages/enrollment/Enrollment"));
const EditEnrollment = lazy(() => import("../pages/enrollment/EditEnrollment"));
/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/enrollment", // the url
    component: Enrollment, // view rendered
  },
  {
    path: "/enrollment/:id",
    component: EditEnrollment,
  },
  {
    path: "/notfound",
    component: Page404,
  },
  {
    path: "/unauthorized",
    component: Page401,
  }
];

export default routes
