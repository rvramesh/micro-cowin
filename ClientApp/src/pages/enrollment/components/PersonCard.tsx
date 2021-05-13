import { Button, Label } from "@windmill/react-ui";
import classNames from "classnames";
import React from "react";
import { useApplicationContext } from "../../../context/ApplicationContext";
import { ArrowCircleDown } from "../../../icons";
import { EnrollmentResponse } from "../types/Person";

function PersonCard({
  index,
  isExpanded,
  onClick,
  data,
  colorCss,
  onWithdraw,
}: {
  index: number;
  isExpanded: boolean;
  onClick: (index: number) => void;
  data: EnrollmentResponse;
  colorCss: string;
  onWithdraw: (index: number) => void;
}) {
  const { enrollmentStatus, vaccines, identifierName } =
    useApplicationContext();
  return (
    <div
      className={classNames(
        "min-w-0 -m-0.5 rounded-t-lg transition-all duration-500 shadow-xs overflow-hidden bg-white dark:bg-gray-700 shadow-xl",
        isExpanded ? "mb-4 rounded-b-lg " : "-mb-2"
      )}
    >
      <div
        className={classNames(
          "pb-5 p-4 flex justify-between font-semibold text-gray-100 cursor-pointer filter drop-shadow-lg",
          data.status !== "W" ? colorCss : "bg-gray-600"
        )}
        onClick={() => onClick(index)}
      >
        <div className="flex-none">
          {data.name} - {enrollmentStatus[data.status]}
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
          " relative transition-all overflow-hidden "
        )}
        style={isExpanded?{maxHeight:"600px"}:{maxHeight:"0px"}}
      >
        <div className="p-4 text-lg text-gray-700 dark:text-gray-500 flex flex-col justify-start flex-wrap md:flex-row">
          <div className="w-full md:w-1/4 p-1">
            <div className="font-semibold">Enrollment Id</div>
            <div>{data.id}</div>
          </div>
          <div className="w-full md:w-1/4 p-1">
            <div className="font-semibold">Year of Birth</div>
            <div>{data.yob}</div>
          </div>
          <div className="w-full md:w-1/4 p-1">
            <div className="font-semibold">Schedule from</div>
            <div>
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                new Date(data.scheduleFrom)
              )}
            </div>
          </div>
          <div className="w-full md:w-1/4 p-1">
            <div className="font-semibold">{identifierName}</div>
            <div>{data.unit}</div>
          </div>
          <div className="w-full p-1">
            <div className="font-semibold">Order of Preference</div>
            {data.vaccinesPreference.map((vax, index) => (
              <div key={`vax-pref-order-label-${index}`}>{`${index + 1} - ${
                vaccines[vax]
              }`}</div>
            ))}
          </div>
        </div>
        {(data.status === "E" || data.status === "S") && (
          <div className="p-4 pt-0">
            <Button onClick={() => onWithdraw(data.id)}>Withdraw</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonCard;
