import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import { useFormContext, get } from "react-hook-form";

function ScheduleDate({ parentName }: { parentName: string }) {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();
  const dateOnwardsFieldName = `${parentName}.scheduleFrom`;
  const dateOnwardsFieldError = get(errors, dateOnwardsFieldName);
  const initialValue = (getValues(dateOnwardsFieldName) || new Date().toISOString()).split("T")[0];
  return (
    <Label>
      <span className="text-lg text-gray-700 dark:text-gray-500">
        Schedule from
      </span>
      <Input
        valid={dateOnwardsFieldError !== undefined ? false : undefined}
        type="date"
        defaultValue={initialValue}
        min={initialValue}
        maxLength={20}
        {...register(dateOnwardsFieldName, {
          min: {
            value: initialValue,
            message: `Preferred Vaccination date should be above ${initialValue}`,
          },
          required: {
            value: true,
            message: "Schedule from is required",
          },
        })}
      />
      <ErrorMessage
        errors={errors}
        name={dateOnwardsFieldName}
        render={({ message }) => (
          <HelperText className="text-base" valid={false}>
            {message}
          </HelperText>
        )}
      />
    </Label>
  );
}

export default ScheduleDate;
