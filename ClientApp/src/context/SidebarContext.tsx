import {
  createContext,
  useCallback,
  useState,
  useMemo,
  ReactNode,
} from "react";

interface SidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}
// create context
export const SidebarContext = createContext<SidebarContextProps>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(!isSidebarOpen), [
    isSidebarOpen,
  ]);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
    }),
    [isSidebarOpen, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
