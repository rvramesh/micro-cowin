import classNames from "classnames";
import { XCircle } from "../../../icons";
import EnrollmentForm from "./EnrollmentForm";

function EnrollmentCard({
  index,
  onRemove,
  colorCss,
  name,
}: {
  index: number;
  onRemove?: (index: number) => void;
  colorCss: string;
  name: string;
}) {
  return (
    <div className="min-w-0 -m-0.5 rounded-t-lg transition-all duration-500 shadow-xs overflow-hidden bg-white dark:bg-gray-800 shadow-xl mb-4 rounded-b-lg">
      <div
        className={classNames(
          "pb-5 p-4 flex justify-between font-semibold text-gray-100 cursor-pointer filter drop-shadow-lg",
          colorCss
        )}
      >
        <div className="flex-none">`Person ${index + 1}`</div>
        <div className="transform transition-all rotate-180">
          <XCircle onClick={() => onRemove?.(index)} />
        </div>
      </div>

      <div className="flex relative items-center transition-all overflow-hidden ">
        <div className="p-4">
          <EnrollmentForm name={`${name}.${index}`}></EnrollmentForm>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentCard;
