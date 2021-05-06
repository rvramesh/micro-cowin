import { ReactNode } from "react";

function Main({ children }:{children: ReactNode}) {
  return (
    <main className="h-full overflow-y-auto p-6">
      <div className="container grid mx-auto">{children}</div>
    </main>
  );
}

export default Main
