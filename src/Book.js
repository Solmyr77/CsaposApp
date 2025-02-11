import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";

function Book() { 
  const { locations, previousRoutes } = useContext(Context);  
  const { name } = useParams(); 
  const [record, setRecord] = useState({});
  
  useEffect(()=> {
    if (locations.length > 0) {
      console.log(name);
      setRecord(locations.find(record => record.name === name));
      console.log(record);
    }
  }, [locations, record])

  return (
    <div className="min-h-screen bg-grey text-white font-play font-bold px-4 py-8">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="font-bold text-xl text-center">Asztalok</p>
      <div className="flex flex-col w-full gap-y-2">
        <div className="flex w-full h-28 rounded-md bg-dark-grey">
        </div>
      </div>
    </div>
  );
}

export default Book;
