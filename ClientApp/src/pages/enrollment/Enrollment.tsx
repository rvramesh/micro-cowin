
import PageTitle from "../../components/Typography/PageTitle";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { useAuthenticatedContext } from "../../context/AuthenticationContext";
import { Button } from "@windmill/react-ui";
import EnrollmentCard from "./components/EnrollmentCard";

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
const colorNames = ["bg-pink-600", "bg-blue-600", "bg-green-600", "bg-indigo-600","bg-red-600","bg-purple-600","bg-yellow-600","bg-blue-600"];



function Enrollment() {
  const {register } =useStackableCard();
  const authContext = useAuthenticatedContext();
  const userName =  authContext.first_name;
  const formMethods = useForm();

  
  const { fields, append, remove } = useFieldArray({
    control:formMethods.control,
    name: "person",
    keyName:"id"

  });

  useEffect(()=>{
    fields.length === 0 && append({});
  },[append, fields.length]);
  
   const onSubmit = (data:unknown) => {
     console.log(data);
   };

  return (
    <>
      <PageTitle className="mt-0">Hi {userName}!</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid mb-8">
        <form className="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <FormProvider {...formMethods}>
            {fields.map((item, index) => (
              <EnrollmentCard
                index={index}
              
                colorCss={colorNames[index % 8]}
                name={"person"}
                onRemove={() => {
                  debugger;
                  remove(index);
                }}
                key={item.id}
                
              />
            ))}
            <div className="flex justify-between">
              <Button
                disabled={fields.length >= 8 ? true : undefined}
                onClick={() => {
                  append({});
                }}
               
                className="mr-4 bg-pink-600 border border-transparent active:bg-pink-600 hover:bg-pink-700 focus:shadow-outline-pink"
               
              >
                Add Additional Member
              </Button>
              <Button
                onClick={formMethods.handleSubmit(onSubmit, (error) =>
                  console.log(error)
                )}
              >
                Submit
              </Button>
            </div>
          </FormProvider>
        </form>
      </div>
    </>
  );
}

export default Enrollment;
