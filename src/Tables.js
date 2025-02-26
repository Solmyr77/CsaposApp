import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import TableItem from "./TableItem";

function Tables() { 
  const { locations, previousRoutes, getLocationTables } = useContext(Context);  
  const { name } = useParams(); 
  const [record, setRecord] = useState({});
  const [locationTables, setLocationTables] = useState([]);

  useEffect(() => {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      if (Object.hasOwn(record, "id")) {
        const run = async () => {
          setLocationTables(await getLocationTables(record.id));
        }
        run();
      }
    }
  }, [locations, record]);

  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="font-bold text-xl text-center">{name}</p>
      <p className="text-lg mb-2 bg-grey mt-8">Asztalok</p>
      <div className="flex flex-col w-full flex-grow max-h-full gap-y-3 overflow-y-scroll">
        {
          locationTables?.length > 0 && locationTables?.some(table => table.isBooked === false) === true ?
          locationTables.sort((a,b) => {
            if (a.isBooked === b.isBooked) {
              if (a.capacity === b.capacity) {
                return a.number - b.number;
              }
              return a.capacity - b.capacity;
            }
            return a.isBooked - b.isBooked;
          }).map(record => <TableItem name={name} record={record}/>) :
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <p className="font-normal text-center">Jelenleg nincsenek szabad asztalok.</p>
          </div>
        }
      </div>
    </div>
  );
}

export default Tables;
