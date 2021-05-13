import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@windmill/react-ui";
import EnrollmentCard from "./EnrollmentCard";
import { colorNames } from "../utils/colors";
import { EnrollmentRequest } from "../types/Person";

const fieldName = "persons";

function EditEnrollmentForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: EnrollmentRequest) => void;
  onCancel: () => void;
  initialData: EnrollmentRequest;
}) {
  const formMethods = useForm({
    defaultValues: initialData,
  });
  const { fields } = useFieldArray({
    control: formMethods.control,
    name: fieldName,
    keyName: "id",
  });

  return (
    <form
      className="form"
      onSubmit={formMethods.handleSubmit<EnrollmentRequest>((data) =>
        onSubmit(data)
      )}
    >
      <FormProvider {...formMethods}>
        {fields.map((item, index) => (
          <EnrollmentCard
            title={initialData.persons[index].name}
            index={index}
            colorCss={colorNames[index % 8]}
            name={fieldName}
            onCancel={onCancel}
            key={item.id}
          />
        ))}
        <div className="flex justify-between">
          <Button
            disabled={fields.length === 0}
            onClick={formMethods.handleSubmit<EnrollmentRequest>(
              (data) => onSubmit(data),
              (error) => console.log(error)
            )}
          >
            Update
          </Button>
        </div>
      </FormProvider>
    </form>
  );
}

export default EditEnrollmentForm;
