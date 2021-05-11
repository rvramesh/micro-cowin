import classNames from "classnames";
import React from "react";
import { ArrowCircleDown } from "../../../icons";
import { Person } from "../types/Person";

function PersonCard({
  index,
  isExpanded,
  onClick,
  data,
  colorCss,
  name,
}: {
  index: number;
  isExpanded: boolean;
  onClick: (index: number) => void;
  data: Person;
  colorCss: string;
  name: string;
}) {
  return (
    <div
      className={classNames(
        "min-w-0 -m-0.5 rounded-t-lg transition-all duration-500 shadow-xs overflow-hidden bg-white dark:bg-gray-800 shadow-xl",
        {
          "mb-4 rounded-b-lg ": isExpanded,
        }
      )}
    >
      <div
        className={classNames(
          "pb-5 p-4 flex justify-between font-semibold text-gray-100 cursor-pointer filter drop-shadow-lg",
          colorCss
        )}
        onClick={() => onClick(index)}
      >
        <div className="flex-none">
          {data.name ?? `Person ${index + 1}`}
        </div>
        <div
          className={classNames("transform transition-all", {
            "rotate-180": isExpanded,
          })}
        >
          <ArrowCircleDown />
        </div>
      </div>

      <div
        className={classNames(
          "flex relative items-center transition-all overflow-hidden "
        )}
      >
        <div className="p-4">
          <h1>Hello World</h1>
        </div>
      </div>
    </div>
  );
}

export default PersonCard;
