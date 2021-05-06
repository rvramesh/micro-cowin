
import PageTitle from "../components/Typography/PageTitle";
import PersonCard, { Person } from "../components/Cards/PersonCard";
import { FormProvider, useForm } from "react-hook-form";

import React, { useState } from "react";
import { useAuthContext } from "../context/AuthenticationContext";
import { Button } from "@windmill/react-ui";

function useStackableCard() {
    const [currentActive, setCurrentActive] = useState<number|null>(1);
   
    function clickHandler(clickedIndex:number) {
        if(clickedIndex===currentActive) {
            setCurrentActive(null);
        } else {
            setCurrentActive(clickedIndex);
        }
    }

    function register<T>(data:T, index:number){
            
            return {
              index: index,
              onClick: clickHandler,
              data: data,
              isExpanded: true,
            };
        }
    return {
        register:register
    }
}
function Enrollment() {
  const {register } =useStackableCard();
  const authContext = useAuthContext();
  const userName = authContext.isAuthenticated ? authContext.firstName : "";
  const formMethods = useForm({
    mode: "onTouched",
  });
   const onSubmit = (data:unknown) => {
     console.log(data);
   };
  return (
    <>
      <PageTitle>Hi {userName}!</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid mb-8">
        <form className="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <FormProvider {...formMethods}>
            <PersonCard {...register<Person>({}, 1)} colorCss="bg-pink-600" />
            <PersonCard {...register<Person>({}, 2)} colorCss="bg-blue-600" />
            <PersonCard {...register<Person>({}, 3)} colorCss="bg-purple-600" />
            <PersonCard {...register<Person>({}, 4)} colorCss="bg-green-600" />
            <Button onClick={formMethods.handleSubmit(onSubmit)}>Submit</Button>
          </FormProvider>
        </form>
      </div>
    </>
  );
}

export default Enrollment;
