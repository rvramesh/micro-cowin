import classNames from "classnames";
import { ReactNode } from "react";

function PageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={classNames(
        "my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200",
        className
      )}
    >
      {children}
    </h1>
  );
}

export default PageTitle;
