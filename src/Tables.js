import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import TableItem from "./TableItem";
import axios from "axios";

function Tables() { 
  const { locations, previousRoutes } = useContext(Context);  
  const { name } = useParams(); 
  const [record, setRecord] = useState({});
  const [locationTables, setLocationTables] = useState([]);

  async function getLocationTables(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/Tables/location/${id}`, config);
      const data = await response.data;
      if (response.status === 200 && data.length > 0) {
        setLocationTables(data);
      }
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      if (Object.hasOwn(record, "id")) {
        getLocationTables(record.id);
      }
    }
  }, [locations, record]);

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
