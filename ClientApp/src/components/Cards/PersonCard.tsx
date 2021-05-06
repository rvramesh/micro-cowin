import classNames from "classnames";
import { ArrowCircleDown } from "../../icons";
import EnrollmentForm from "./EnrollmentForm";

export type Person = {
  initials?:string,
  yob?:number,
  vax?:[],
  fromDate?:Date
}
function PersonCard({
  index,
  isExpanded,
  onClick,
  data,
  colorCss,
}: {
  index:number;
  isExpanded: boolean;
  onClick: (index:number)=>void;
  data: Person;
  colorCss:string;
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
          {data.initials ?? `Person ${index + 1}`}
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
        <div className="p-4"><EnrollmentForm index={index}></EnrollmentForm></div>
      </div>
    </div>
  );
}

export default PersonCard;
