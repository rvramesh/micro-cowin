import { Redirect } from "react-router-dom";

import { useApplicationContext } from "../context/ApplicationContext";
import TelegramLoginButton from "../components/TelegramLoginButton";
import { useAuthContext } from "../context/AuthenticationContext";

function Login() {
  const {
    organizingBodyName,
    organizingBodyMemberName,
    organizingBodyFaqUrl,
    sourceUrl,
  } = useApplicationContext();
  const authContext = useAuthContext();
  
  return authContext.isAuthenticated === false ? (
    <main className="h-full overflow-y-auto p-6">
      <div className="items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row dark:bg-gray-800">
            <div className="h-auto md:w-1/2 p-6 pb-0">
              <h1 className="mb-4 text-xl font-semibold text-center text-gray-700 dark:text-gray-200">
                Vaccine Enrollment System
              </h1>
              <p className="pb-4 text-gray-700 dark:text-gray-200">
                This system is{" "}
                <b>
                  exclusive for {organizingBodyMemberName} of{" "}
                  {organizingBodyName}{" "}
                </b>{" "}
                They can express their interest for a vaccine and their convient
                date. The system will place the users in a queue. As the
                vaccines become available, a slot will be blocked based on first
                expressed interest, first served basis and the system will send
                a notification via Telegram app to inform when they can visit
                for vaccination.
              </p>
              <p className="pb-4 text-gray-700 dark:text-gray-200">
                This is not a replacement for GOI's CoWin system. This helps in
                managing the tokens for the user and in anticipating the demand
                to plan for the vaccination drive at a individual center level.
              </p>
              <p className="pb-4 text-gray-700 dark:text-gray-200">
                <a
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  href={organizingBodyFaqUrl}
                >
                  Click here
                </a>{" "}
                to read about the FAQ
              </p>
              <hr className="m-4" />
              <p className="pb-4 text-gray-700 dark:text-gray-200">
                If you are not a {organizingBodyMemberName} of{" "}
                {organizingBodyName} but is interested in this application, you
                can visit the source code @{" "}
                <a
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  href={sourceUrl}
                >
                  {sourceUrl}
                </a>
              </p>
              <hr className="m-4 md:invisible" />
            </div>
            <div className="flex items-center justify-center p-6 pt-0 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-center text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <div className="flex justify-center">
                  <TelegramLoginButton
                    botName="ss_microcowin_bot"
                    dataOnauth={(data) => {
                      authContext.login(data);
                    }}
                    buttonSize="large"
                    cornerRadius={4}
                    requestAccess={true}
                    usePic={false}

                  >Loading...</TelegramLoginButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  ) : (<Redirect to={"/app/terms"}/>)
}

export default Login;
