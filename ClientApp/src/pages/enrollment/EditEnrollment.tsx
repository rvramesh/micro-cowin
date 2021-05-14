import PageTitle from "../../components/Typography/PageTitle";

import { useAuthenticatedContext } from "../../context/AuthenticationContext";
import { EnrollmentRequest, EnrollmentResponse } from "./types/Person";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router";
import EditEnrollmentForm from "./components/EditEnrollmentForm";

function EditEnrollment() {
  const history = useHistory();
  const { first_name: firstName, getAxiosWithToken } =
    useAuthenticatedContext();
  const { id } = useParams<{ id: string }>();

  const gotoEnrollments = () => history.push("/app/enrollment");
  const gotoNotAuthorized = () => history.push("/app/notauthorized");

  const idNumber = parseInt(id, 10);
  if (isNaN(idNumber)) {
    gotoNotAuthorized();
  }

  const fetchEnrollmentsApi = async () =>
    (await getAxiosWithToken().get<EnrollmentResponse>(`/api/enrollment/${id}`))
      .data;

  const editEnrollmentApi = ({
    id,
    data,
  }: {
    id: number;
    data: EnrollmentRequest;
  }) => getAxiosWithToken().post(`/api/enrollment/${id}`, data.persons[0]);

  const { data, isLoading, isError } = useQuery<EnrollmentResponse>(
    `enrollment-${id}`,
    fetchEnrollmentsApi
  );

  const { mutate: editEnrollment } = useMutation(
    "enrollments-withdraw",
    editEnrollmentApi
  );

  const onSubmit = (data: EnrollmentRequest) => {
    editEnrollment(
      { id: idNumber, data },
      {
        onSuccess: () => {
          gotoEnrollments();
        },
      }
    );
  };
  return (
    <>
      <PageTitle className="mt-0">Hi {firstName}!</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid mb-8">
        <div>
          {isError && (
            <div>
              Unable to load current enrollment. Please try again later.
            </div>
          )}
          {!isLoading && !isError && data && (
            <EditEnrollmentForm
              initialData={{
                persons: [
                  {
                    name: data.name,
                    scheduleFrom: data.scheduleFrom,
                    vaccinePreferences: data.vaccinesPreference,
                    yob: data.yob,
                  },
                ],
              }}
              onCancel={gotoEnrollments}
              onSubmit={onSubmit}
            ></EditEnrollmentForm>
          )}
        </div>
      </div>
    </>
  );
}

export default EditEnrollment;
