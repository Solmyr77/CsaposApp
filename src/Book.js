import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Context from "./Context";

function Book() { 
  const { locations } = useContext(Context);  
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
    <div className="min-h-screen bg-grey text-white font-play font-bold">
        <div className="flex flex-col items-center pt-8">
            <p className="font-bold text-xl">Asztalok</p>
        </div>
    </div>
  );
}

export default Book;
