import { useFormContext, get } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { HelperText, Input, Label } from "@windmill/react-ui";
import { useApplicationContext } from "../../context/ApplicationContext";
import { useState } from "react";

function EnrollmentForm({ index }: { index: number }) {
  const [todaysDate] = useState(() => new Date().toISOString().split("T")[0]);
  const { minYear, maxYear, vaxines } = useApplicationContext();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useFormContext();
  const initials = `${index}.initials`;
  const yob = `${index}.yob`;
  const dateOnwards = `${index}.dateOnwards`;
  const vaxPreferred = `${index}.vaxPreferred`;

  const initialsError = get(errors, initials);
  console.log("initialsError", initialsError);
  const yobError = get(errors, yob);
  const dateOnwardsError = get(errors, dateOnwards);
  const vaxPreferredValue = getValues(vaxPreferred) ?? [];
  console.log(`${index}.vaxPreferred`, vaxPreferredValue);

  const [selectedVax, changeSelectedVax] = useState<string[]>(
    () => vaxPreferredValue
  );

  const addVax = (name: string) => {
    const newVal = [...selectedVax, name];
   
      clearErrors(vaxPreferred);
    
    setValue(vaxPreferred, newVal, { shouldDirty: true });
    changeSelectedVax(newVal);
  };
  const removeVax = (name: string) => {
    const newVal = selectedVax.filter((vax: any) => vax !== name);
    if (newVal.length === 0) {
      setError(vaxPreferred, {
        type: "minLength",
        message: "Please select atleast one vaccine",
        shouldFocus: true,
      });
    } 
    setValue(vaxPreferred, newVal, { shouldDirty: true });
    changeSelectedVax(newVal);
  };

  return (
    <div className="flex flex-col justify-around flex-wrap md:flex-row">
      <div className="w-full md:w-1/3 p-1">
        <Label>
          <span className="text-lg">Name / Intials</span>
          <Input
            valid={initialsError !== undefined ? false : undefined}
            type="text"
            maxLength={20}
            {...register(initials, {
              maxLength: 20,
              required: { value: true, message: "Name is required" },
            })}
          />
          <ErrorMessage
            errors={errors}
            name={initials}
            render={({ message }) => (
              <HelperText className="text-base" valid={false}>
                {message}
              </HelperText>
            )}
          />
        </Label>
      </div>
      <div className="w-full md:w-1/3 p-1">
        <Label>
          <span className="text-lg">Year of Birth</span>
          <Input
            valid={yobError !== undefined ? false : undefined}
            type="number"
            maxLength={20}
            {...register(yob, {
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
            name={yob}
            render={({ message }) => (
              <HelperText className="text-base" valid={false}>
                {message}
              </HelperText>
            )}
          />
        </Label>
      </div>
      <div className="w-full md:w-1/3 p-1">
        <Label>
          <span className="text-lg">Schedule from</span>
          <Input
            valid={dateOnwardsError !== undefined ? false : undefined}
            type="date"
            value={todaysDate}
            min={todaysDate}
            maxLength={20}
            {...register(dateOnwards, {
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
            name={dateOnwards}
            render={({ message }) => (
              <HelperText className="text-base" valid={false}>
                {message}
              </HelperText>
            )}
          />
        </Label>
      </div>

      <div className="w-full p-1">
        <div className="w-full text-lg">
          Check Vaccines in order of preference. Check only the vaccines you
          prefer and leave others unchecked.
        </div>
        <div className="w-full flex-1 justify-between">
          {vaxines.map((obj) => (
            <Label
              key={`${vaxPreferred}-label-${obj.id}`}
              check
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <Input
                className="m-2 h-8 w-8"
                type="checkbox"
                checked={selectedVax.includes(obj.name)}
                key={`${vaxPreferred}-input-${obj.id}`}
                {...register(vaxPreferred, {
                  required: "Please select atleast one vaccine",
                })}
                onChange={(ev) => {
                  console.log("onClick", ev.currentTarget.checked);
                  ev.currentTarget.checked
                    ? addVax(obj.name)
                    : removeVax(obj.name);
                }}
              />
              <span className="text-lg">{obj.name}</span>
            </Label>
          ))}
        </div>
        <div>
          <ErrorMessage
            errors={errors}
            name={vaxPreferred}
            render={({ message }) => (
              <HelperText className="text-base" valid={false}>
                {message}
              </HelperText>
            )}
          />
        </div>
        {selectedVax.length > 0 && (
          <div className="w-full text-lg m-2">
            <div className="font-semibold">Order of Preference</div>
            {selectedVax.map((vax: any, index: any) => (
              <div key={`${vaxPreferred}-order-label-${index}`}>{`${
                index + 1
              } - ${vax}`}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollmentForm;
