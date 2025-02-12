import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import TableBookItem from "./TableBookItem";

function Book() { 
  const { locations, previousRoutes } = useContext(Context);  
  const { name } = useParams(); 
  const [record, setRecord] = useState({});
  
  useEffect(()=> {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      console.log(record);
    }
  }, [locations, record])

  return (
    <div className="min-h-screen max-h-screen bg-grey text-white font-play font-bold px-4 py-8">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="font-bold text-xl text-center">Asztalok</p>
      <div className="flex flex-col w-full h-[80vh] gap-y-2 mt-8 overflow-y-scroll">
        {
          Array.from({length: record.numberOfTables}).map((_, i) => <TableBookItem tableNumber={Number(i + 1)}/>)
        }
      </div>
    </div>
  );
}

export default Book;
