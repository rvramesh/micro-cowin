import NameField from "./NameField";
import YOBField from "./YOBField";
import ScheduleDate from "./SchduledDate";
import VaccinesPref from "./VaccinesPref";

function EnrollmentForm({ name }: { name: string }) {
  return (
    <div className="flex flex-col justify-around flex-wrap md:flex-row">
      <div className="w-full md:w-1/3 p-1">
        <NameField parentName={name}></NameField>
      </div>
      <div className="w-full md:w-1/3 p-1">
        <YOBField parentName={name}></YOBField>
      </div>
      <div className="w-full md:w-1/3 p-1">
        <ScheduleDate parentName={name} />
      </div>
      <div className="w-full p-1">
        <VaccinesPref parentName={name}></VaccinesPref>
      </div>
    </div>
  );
}

export default EnrollmentForm;




