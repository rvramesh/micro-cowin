import PageTitle from "../../components/Typography/PageTitle";

import { useAuthenticatedContext } from "../../context/AuthenticationContext";
import useStackableCard from "./hooks/useStackableCards";
import { EnrollmentRequest, EnrollmentResponse } from "./types/Person";
import { useMutation, useQuery } from "react-query";
import PersonCard from "./components/PersonCard";
import classNames from "classnames";
import { colorNames } from "./utils/colors";
import EnrollmentForm from "./components/EnrollmentForm";

function Enrollment() {
  const { register } = useStackableCard();
  const { first_name: firstName, getAxiosWithToken } =
    useAuthenticatedContext();

  const fetchEnrollmentsApi = async () =>
    (await getAxiosWithToken().get<EnrollmentResponse[]>("/api/enrollment"))
      .data;

  const addEnrollmentApi = (data: EnrollmentRequest) =>
    getAxiosWithToken().post("/api/enrollment", data.persons);

  const withdrawEnrollmentApi = (id: number) =>
    getAxiosWithToken().post(`/api/enrollment/${id}/withdraw`);

  const { data, isLoading, isError, refetch } = useQuery(
    "enrollments",
    fetchEnrollmentsApi,
    {
      retry: false,
      staleTime: 1000 * 60 * 30, //30 MINS IN MS,
    }
  );

  const { mutate: addEnrollments } = useMutation(
    "enrollments-addition",
    addEnrollmentApi,
    {
      retry: false,
    }
  );

  const { mutate: withDrawEnrollment } = useMutation(
    "enrollments-withdraw",
    withdrawEnrollmentApi,
    {
      retry: false,
    }
  );

  const onSubmit = (data: EnrollmentRequest, onSuccess:()=>void) => {
    addEnrollments(data, {
      onSuccess: () => {
        refetch();
        onSuccess();
      },
    });
  };

  const onWithdraw = (id: number) => {
    withDrawEnrollment(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const currentlyEnrolled = data?.length ?? 0;
  return (
    <>
      <PageTitle className="mt-0">Hi {firstName}!</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid mb-8">
        <div className={classNames({ "mb-4": currentlyEnrolled > 0 })}>
          {isError && (
            <div>
              Unable to load current enrollment. Please try again later.
            </div>
          )}
          {data?.map((person, index) => (
            <PersonCard
              colorCss={colorNames[index]}
              {...register(person, index)}
              key={person.id}
              onWithdraw={onWithdraw}
            />
          ))}
          {!isLoading && !isError && (
            <EnrollmentForm
              currentlyEnrolled={currentlyEnrolled}
              onSubmit={onSubmit}
            ></EnrollmentForm>
          )}
        </div>
      </div>
    </>
  );
}

export default Enrollment;
