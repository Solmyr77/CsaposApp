import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import TableItem from "./TableItem";

function Tables() { 
  const { locations, tables, previousRoutes } = useContext(Context);  
  const { name } = useParams(); 
  const [record, setRecord] = useState({});
  const [locationTables, setLocationTables] = useState([]);

  useEffect(() => {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      if (record && tables) {
        setLocationTables(tables.filter(table => table.locationId === record.id));
      }
    }
  }, [locations, record, tables]);

  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="font-bold text-xxl text-center">Asztalok</p>
      <div className="flex flex-col w-full max-h-full gap-y-3 mt-8 overflow-y-scroll">
        {
          locationTables.length > 0 ?
          locationTables.sort((a,b) => a.number - b.number).map(record => <TableItem name={name} record={record}/>) :
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <p className="font-normal text-center">Jelenleg nincsenek szabad asztalok</p>
          </div>
        }
      </div>
    </div>
  );
}

export default Tables;
