import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useApplicationContext } from "../../../context/ApplicationContext";

function VaccinesPref({ parentName }: { parentName: string }) {
  const { vaccines } = useApplicationContext();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
    control,
  } = useFormContext();
  const vaxPreferredFieldName = `${parentName}.vaxPreferred`;

  const res = useController({
    name: vaxPreferredFieldName,
    defaultValue:[],
    rules: {
      minLength: {
        value: 1,
        message: "Please select atleast one vaccine",
      },
    },
    control: control,
  });
  const vaxPreferredFieldValue :number[] = !res.field.value ? [] : res.field.value;

  console.log("render", { vaxPreferredFieldValue });
  //   const [selectedVax, changeSelectedVax] = useState<string[]>(
  //     vaxPreferredFieldValue
  //   );

  const addVax = (id: number) => {
    const newVal = [...vaxPreferredFieldValue, id];
    clearErrors(vaxPreferredFieldName);
    console.log("addVax", { newVal });
    setValue(vaxPreferredFieldName, newVal, { shouldDirty: true });
  };

  const removeVax = (id: number) => {
    const newVal = vaxPreferredFieldValue.filter((vax: any) => vax !== id);
    if (newVal.length === 0) {
      setError(vaxPreferredFieldName, {
        type: "minLength",
        message: "Please select atleast one vaccine",
        shouldFocus: true,
      });
    }
    console.log("removeVax", { newVal });

   res.field.onChange(newVal);
    //changeSelectedVax(newVal);
  };
  //console.log({ selectedVax });
  return (
    <>
      {" "}
      <div
        className="w-full text-lg text-gray-700 dark:text-gray-500"
        ref={res.field.ref}
      >
        Check Vaccines in order of preference. Check only the vaccines you
        prefer and leave others unchecked.
      </div>
      <div className="w-full flex-1 justify-between">
        {Object.keys(vaccines)
          .map(Number)
          .map((vaxId) => {
            return (<Label
              key={`${vaxPreferredFieldName}-label-${vaxId}`}
              check
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <Input
                className="m-2 h-8 w-8"
                type="checkbox"
                key={`${vaxPreferredFieldName}-input-${vaxId}`}
                value={vaxId}
                onBlur={res.field.onBlur}
                onChange={(ev) => {
                  console.log("onClick", ev.currentTarget.checked);
                  ev.currentTarget.checked ? addVax(vaxId) : removeVax(vaxId);
                }}
                checked={vaxPreferredFieldValue.includes(vaxId)}
              />
              <span className="text-lg">{vaccines[vaxId]}</span>
            </Label>
          )})}
      </div>
      <div>
        <ErrorMessage
          errors={errors}
          name={vaxPreferredFieldName}
          render={({ message }) => (
            <HelperText className="text-base" valid={false}>
              {message}
            </HelperText>
          )}
        />
      </div>
      {vaxPreferredFieldValue.length > 0 && (
        <div className="w-full text-lg m-2">
          <div className="font-semibold text-gray-700 dark:text-gray-500">
            Order of Preference
          </div>
          {vaxPreferredFieldValue.map((vax, index) => (
            <div
              key={`${vaxPreferredFieldName}-order-label-${index}`}
              className="text-gray-700 dark:text-gray-500"
            >{`${index + 1} - ${vaccines[vax]}`}</div>
          ))}
        </div>
      )}
    </>
  );
}
export default VaccinesPref;
