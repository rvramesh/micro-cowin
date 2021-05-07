import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import React from "react";
import { useFormContext,get } from "react-hook-form";
import { useApplicationContext } from "../../../context/ApplicationContext";

function YOBField({ parentName }: { parentName: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { minYear, maxYear } = useApplicationContext();

  const yobFieldName = `${parentName}.yob`;
  const yobError = get(errors, yobFieldName);

  return (
    <Label>
      <span className="text-lg text-gray-700 dark:text-gray-500">
        Year of Birth
      </span>
      <Input
        valid={yobError !== undefined ? false : undefined}
        type="number"
        maxLength={20}
        {...register(yobFieldName, {
          min: {
            value: maxYear,
            message: `Year of birth should be above ${maxYear}`,
          },
          max: {
            value: minYear,
            message: `Year of birth should be below ${minYear}`,
          },
          required: { value: true, message: "Year of Birth is required" },
        })}
      />
      <ErrorMessage
        errors={errors}
        name={yobFieldName}
        render={({ message }) => (
          <HelperText className="text-base" valid={false}>
            {message}
          </HelperText>
        )}
      />
    </Label>
  );
}

export default YOBField;