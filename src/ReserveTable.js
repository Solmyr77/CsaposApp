import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

function ReserveTable() {
  const { locations, previousRoutes } = useContext(Context);  
  const { name, number } = useParams(); 
  const [record, setRecord] = useState({});
  const [dates, setDates] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      console.log(record);
      const today = new Date();
      const next7Days = [];
      for (let i = 0; i < 8; i++) {
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        next7Days.push(nextDay.toLocaleDateString("hu"));
      }
      setDates(next7Days);
      console.log(next7Days);
      if (!record || number > record.numberOfTables) {
        navigate("/");
      }
    }
  }, [locations, record]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="text-center text-xxl">Asztal {number}</p>
      <div className="flex flex-col flex-grow w-full mt-4">
        <p className="text-xl mb-2">Dátum</p>
        <div className="flex flex-row justify-center items-center w-full">
          <ChevronLeftIcon className={`w-12 rounded-md ${dateIndex === 0 ? "invisible" : "visible"}`} onClick={() => {
            if (dateIndex > 0) {
              setDateIndex(state => state - 1);
            }
          }}/>
          <p className="font-normal text-xxl bg-dark-grey px-4 rounded-md">{dates[dateIndex]}</p>
          <ChevronRightIcon className={`w-12 rounded-md ${dateIndex === 7 ? "invisible" : "visible"}`} onClick={() => {
            if (dateIndex < 7) {
              setDateIndex(state => state + 1);
            }
          }}/>
        </div>
      </div>
    </div>
  )
}

export default ReserveTable;
