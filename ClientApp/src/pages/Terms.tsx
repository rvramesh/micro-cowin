import CTA from "../components/CTA";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import {
  Input,
  HelperText,
  Label,
  Select,
  Textarea,
  Button,
  Card,
  CardBody,
} from "@windmill/react-ui";

import { MailIcon } from "../icons";
import {
  useAuthContext,
  useAuthenticatedContext,
} from "../context/AuthenticationContext";
import { useApplicationContext } from "../context/ApplicationContext";
import React, { useState } from "react";
import SelectSearch, { SelectSearchOption } from "react-select-search";
import { Redirect, useHistory } from "react-router";

function Terms() {
  const {
    organizingBodyName,
    organizingBodyMemberName,
    identifierName,
  } = useApplicationContext();
  const {
    getAxiosWithToken,
    first_name: firstName,
    last_name,
    username,
    refetchToken,
    hasAcceptedTerms,
  } = useAuthenticatedContext();
  const history = useHistory();
  const [unitId, setUnitId] = useState<string | undefined>();

  const getOptions = (query: string) =>
    new Promise<SelectSearchOption[]>((resolve, reject) => {
      getAxiosWithToken()
        .get<string[]>(`/api/idservice/search?val=${query}`)
        .then((response) => {
          resolve(
            response.data.map((unit: string) => ({
              value: unit,
              name: unit,
            }))
          );
        })
        .catch(reject);
    });

  const acceptTerms = async () => {
    await getAxiosWithToken().post("/api/authorization/user/acceptTerms", {
      unitId: unitId,
      firstName: firstName,
      lastName:last_name,
      userName:username
    });
    refetchToken();
  };
  return hasAcceptedTerms ? (
    <Redirect to="/app/enrollment" />
  ) : (
    <>
      <div className="min-h-screen  bg-gray-50 dark:bg-gray-900">
        <Card className="mb-8 shadow-md w-100">
          <CardBody>
            <PageTitle>Hi {firstName}!</PageTitle>
            <p className="pb-4 text-gray-700 dark:text-gray-200">
              Before you proceed, we would like you to understand the below.
            </p>
            <ul className="list-disc pl-10">
              <li>
                <p className="pb-4 text-gray-700 dark:text-gray-200">
                  This system is{" "}
                  <b>
                    exclusive for {organizingBodyMemberName} of{" "}
                    {organizingBodyName}{" "}
                  </b>
                  . You will be required to produce <b>{organizingBodyName}</b>{" "}
                  ID card for vaccination. If the value selected in this page is
                  not matching, you will not be allowed for vaccination.
                </p>
              </li>
              <li>
                <p className="pb-4 text-gray-700 dark:text-gray-200">
                  Expressing your interest here does not gurantee vaccination.
                  This helps in reducing the crowd at vaccination center and
                  also in planning for vaccination drive.
                </p>
              </li>
              <li>
                <p className="pb-4 text-gray-700 dark:text-gray-200">
                  Consult your doctor before vaccination, and follow atmost
                  caution during vaccination process.
                </p>
              </li>
              <li>
                <p className="pb-4 text-gray-700 dark:text-gray-200">
                  This is a volunteer initiative and is provided as a service
                  without any profit.
                </p>
              </li>
              <li>
                <p className="pb-4 text-gray-700 dark:text-gray-200">
                  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY
                  KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
                  ADMIN OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                  OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
              </li>
            </ul>
            <p className="pb-4 text-gray-700 dark:text-gray-200">
              By providing your {identifierName} and clicking on Proceed you are
              agreeing to the above terms. You may choose to close the window if
              you are in diagreeement to the above terms.
            </p>
            <div>
              <label className="flex flex-col md:flex-row">
                <span className="mr-5 pb-2">I am residing at :</span>{" "}
                <SelectSearch
                  options={[{ value: "ABC", name: "ABC" }]}
                  value={unitId}
                  onChange={(val: any) => {
                    setUnitId(val);
                  }}
                  getOptions={(query) => getOptions(query)}
                  search
                  placeholder="Type to filter"
                />
              </label>
            </div>
            <div className="pt-10">
              <Button
                className="sm:w-full md:w-60"
                onClick={acceptTerms}
                disabled={unitId === undefined}
              >
                I Agree
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Terms;
