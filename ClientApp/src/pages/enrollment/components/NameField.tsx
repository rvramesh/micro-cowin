import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import React from "react";
import { useFormContext, get } from "react-hook-form";

function NameField({ parentName }: { parentName: string }) {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext();
  const initialsFieldName = `${parentName}.name`;
  const initialsError = get(errors, initialsFieldName);
  const initialValue = getValues(initialsFieldName);
  return (
    <Label>
      <span className="text-lg text-gray-700 dark:text-gray-500">
        Name / Intials
      </span>
      <Input
        valid={initialsError !== undefined ? false : undefined}
        type="text"
        maxLength={20}
        {...register(initialsFieldName, {
          maxLength: 20,
          required: { value: true, message: "Name is required" },
        })}
        defaultValue={initialValue}
      />
      <ErrorMessage
        errors={errors}
        name={initialsFieldName}
        render={({ message }) => (
          <HelperText className="text-base" valid={false}>
            {message}
          </HelperText>
        )}
      />
    </Label>
  );
}
export default NameField;