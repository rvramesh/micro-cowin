import classNames from "classnames";
import React from "react";
import { XCircle } from "../../../icons";
import EnrollmentForm from "./EnrollmentForm";
import NameField from "./NameField";
import ScheduleDate from "./SchduledDate";
import VaccinesPref from "./VaccinesPref";
import YOBField from "./YOBField";

function EnrollmentCard({
  index,
  onCancel: onRemove,
  colorCss,
  name,
  title,
}: {
  index: number;
  onCancel?: (index: number) => void;
  colorCss: string;
  name: string;
  title:string;
}) {
  return (
    <div className="min-w-0 -m-0.5 rounded-t-lg transition-all duration-500 shadow-xs overflow-hidden bg-white dark:bg-gray-800 shadow-xl mb-4 rounded-b-lg">
      <div
        className={classNames(
          "pb-5 p-4 flex justify-between font-semibold text-gray-100 cursor-pointer filter drop-shadow-lg",
          colorCss
        )}
      >
        <div className="flex-none">{title}</div>
        <div className="transform transition-all rotate-180">
          <XCircle onClick={() => onRemove?.(index)} />
        </div>
      </div>

      <div className="flex relative items-center transition-all overflow-hidden ">
        <div className="p-4">
          <div className="flex flex-col justify-around flex-wrap md:flex-row">
            <div className="w-full md:w-1/3 p-1">
              <NameField parentName={`${name}.${index}`}></NameField>
            </div>
            <div className="w-full md:w-1/3 p-1">
              <YOBField parentName={`${name}.${index}`}></YOBField>
            </div>
            <div className="w-full md:w-1/3 p-1">
              <ScheduleDate parentName={`${name}.${index}`} />
            </div>
            <div className="w-full p-1">
              <VaccinesPref parentName={`${name}.${index}`}></VaccinesPref>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentCard;
