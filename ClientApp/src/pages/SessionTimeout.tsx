import { Button, Card, CardBody } from "@windmill/react-ui";
import React from "react";
import PageTitle from "../components/Typography/PageTitle";

function SessionTimeout() {
  return (
    <div className="items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <Card className="mb-8 shadow-md text-center">
        <CardBody>
          <p className="pb-4 text-gray-700 dark:text-gray-200">
            You have been logged out due to session timeout. Please click below
            to login again
          </p>
          <p className="pb-4 text-gray-700 dark:text-gray-200">
           <Button tag="a" href="/">Goto Login page</Button>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export default SessionTimeout;
