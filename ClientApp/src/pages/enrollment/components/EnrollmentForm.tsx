import NameField from "./NameField";
import YOBField from "./YOBField";
import ScheduleDate from "./SchduledDate";
import VaccinesPref from "./VaccinesPref";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { Button } from "@windmill/react-ui";
import EnrollmentCard from "./EnrollmentCard";
import { useApplicationContext } from "../../../context/ApplicationContext";
import { colorNames } from "../utils/colors";
import { EnrollmentRequest } from "../types/Person";

const fieldName = "persons";

function EnrollmentForm({
  onSubmit,
  currentlyEnrolled,
}: {
  onSubmit: (data: EnrollmentRequest, onSuccess: () => void) => void;
  currentlyEnrolled: number;
}) {
  const formMethods = useForm();
  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: fieldName,
    keyName: "id",
  });

  useEffect(() => {
    if (currentlyEnrolled === 0) {
      append({});
    }
  }, [append, currentlyEnrolled]);

  const { maxEnrollmentPerUnit } = useApplicationContext();

  return (
    <form
      className="form"
      onSubmit={formMethods.handleSubmit<EnrollmentRequest>((data) =>
        onSubmit(data, () => formMethods.reset())
      )}
    >
      <FormProvider {...formMethods}>
        {fields.map((item, index) => (
          <EnrollmentCard
            title={`Person ${currentlyEnrolled + index + 1}`}
            index={index}
            colorCss={colorNames[(currentlyEnrolled + index) % 8]}
            name={fieldName}
            onCancel={() => {
              remove(index);
            }}
            key={item.id}
          />
        ))}
        <div className="flex justify-between">
          <Button
            disabled={
              currentlyEnrolled + fields.length >= maxEnrollmentPerUnit
                ? true
                : undefined
            }
            onClick={() => {
              append({});
            }}
            className="mr-4 bg-pink-600 border border-transparent active:bg-pink-600 hover:bg-pink-700 focus:shadow-outline-pink"
          >
            Add Additional Member
          </Button>
          <Button
            disabled={fields.length === 0}
            onClick={formMethods.handleSubmit<EnrollmentRequest>(
              (data) => onSubmit(data, () => formMethods.reset()),
              (error) => console.log(error)
            )}
          >
            Enroll {fields.length} Person{fields.length > 1 ? "s" : ""}
          </Button>
        </div>
      </FormProvider>
    </form>
  );
}

export default EnrollmentForm;
