import { ErrorMessage } from "@hookform/error-message";
import { Label, Input, HelperText } from "@windmill/react-ui";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useApplicationContext } from "../../../context/ApplicationContext";

function VaccinesPref({ parentName }: { parentName: string }) {
  const { vaxines } = useApplicationContext();
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
  const vaxPreferredFieldValue = !res.field.value ? [] : res.field.value;

  console.log("render", { vaxPreferredFieldValue });
  //   const [selectedVax, changeSelectedVax] = useState<string[]>(
  //     vaxPreferredFieldValue
  //   );

  const addVax = (name: string) => {
    const newVal = [...vaxPreferredFieldValue, name];
    clearErrors(vaxPreferredFieldName);
    console.log("addVax", { newVal });
    setValue(vaxPreferredFieldName, newVal, { shouldDirty: true });
    //res.field.onChange({newVal);
    // changeSelectedVax(newVal);
  };

  const removeVax = (name: string) => {
    const newVal = vaxPreferredFieldValue.filter((vax: any) => vax !== name);
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
      <div className="w-full text-lg text-gray-700 dark:text-gray-500" ref={res.field.ref}>
        Check Vaccines in order of preference. Check only the vaccines you
        prefer and leave others unchecked.
      </div>
      <div className="w-full flex-1 justify-between">
        {vaxines.map((obj) => (
          <Label
            key={`${vaxPreferredFieldName}-label-${obj.id}`}
            check
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Input
              className="m-2 h-8 w-8"
              type="checkbox"
              key={`${vaxPreferredFieldName}-input-${obj.id}`}
              value={obj.name}
              onBlur={res.field.onBlur}
              onChange={(ev) => {
                console.log("onClick", ev.currentTarget.checked);
                ev.currentTarget.checked
                  ? addVax(obj.name)
                  : removeVax(obj.name);
              }}
              checked={vaxPreferredFieldValue.includes(obj.name)}
            />
            <span className="text-lg">{obj.name}</span>
          </Label>
        ))}
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
          {vaxPreferredFieldValue.map((vax: any, index: any) => (
            <div
              key={`${vaxPreferredFieldName}-order-label-${index}`}
              className="text-gray-700 dark:text-gray-500"
            >{`${index + 1} - ${vax}`}</div>
          ))}
        </div>
      )}
    </>
  );
}
export default VaccinesPref;
