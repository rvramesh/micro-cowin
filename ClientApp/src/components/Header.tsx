import { SidebarContext } from "../context/SidebarContext";
import {
  MoonIcon,
  SunIcon,
  MenuIcon,
} from "../icons";
import {
  WindmillContext,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useApplicationContext } from "../context/ApplicationContext";
import { useAuthContext } from "../context/AuthenticationContext";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { organizingBodyName } = useApplicationContext();
 const userDetails = useAuthContext();
  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        {userDetails.isAuthenticated && userDetails.isAdmin && (<button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>)}
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <h1 className="text-center text-xl font-bold text-gray-700 dark:text-gray-200">
              {organizingBodyName} Vaccine Enrollment System
            </h1>
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
