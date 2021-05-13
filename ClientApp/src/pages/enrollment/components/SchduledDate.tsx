import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import React, { useState } from "react";
import { useFormContext, get } from "react-hook-form";

function ScheduleDate({ parentName }: { parentName: string }) {
  const [todaysDate] = useState(() => new Date().toISOString().split("T")[0]);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const dateOnwardsFieldName = `${parentName}.scheduleFrom`;
  const dateOnwardsFieldError = get(errors, dateOnwardsFieldName);

  return (
    <Label>
      <span className="text-lg text-gray-700 dark:text-gray-500">
        Schedule from
      </span>
      <Input
        valid={dateOnwardsFieldError !== undefined ? false : undefined}
        type="date"
        //  value={todaysDate}
        defaultValue={todaysDate}
        min={todaysDate}
        maxLength={20}
        {...register(dateOnwardsFieldName, {
          min: {
            value: todaysDate,
            message: `Preferred Vaccination date should be above ${todaysDate}`,
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
