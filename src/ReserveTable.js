import React, { forwardRef, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import styled from "styled-components";

const StyledDatePickerWrapper = styled.div`
  .react-datepicker {
    background-color: #1c1c1c;
    color: white;
    border-radius: .375rem;
    border-color: #1c1c1c
  }

  .react-datepicker__header {
    color: white;
    background-color: #1c1c1c;
    border-color: grey;
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__current-month,
  .react-datepicker__time-name {
    color: white;
  }

  .react-datepicker__day--selected {
    color: white;
    background-color: #007AFF;
    color: white;
  }

  .react-datepicker__day:hover {
    color: white;
    background-color: #4c98ff;
  }
  
  .react-datepicker__day--disabled {
    color: grey;
  }

  .react-datepicker__day--disabled:hover {
    color: grey;
    background-color: unset;
  }

  .react-datepicker__time {
    background-color: #1c1c1c;
  }

  .react-datepicker__time-container {
    border-color: grey;
  }

  .react-datepicker-time__header {
    color: white;
  }

  .react-datepicker__time-list-item {
    color: white;
  }

  .react-datepicker__time-list-item:hover {
    background-color: #4c98ff !important;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #007AFF !important;
  }

  .react-datepicker__triangle {
    stroke: #1c1c1c;
    color: #1c1c1c !important;
    fill: #1c1c1c !important;
  }
`;

function ReserveTable() {
  const { locations, previousRoutes } = useContext(Context);  
  const { name, number } = useParams(); 
  const navigate = useNavigate();
  const [record, setRecord] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        {value}
      </button>
    ),
  );

  useEffect(() => {
    if (locations.length > 0) {
      setRecord(locations.find(record => record.name === name));
      const roundedMinutes = Math.ceil(startDate.getMinutes() / 15) * 15;
      const newDate = new Date(startDate);
      newDate.setMinutes(roundedMinutes);
      setStartDate(newDate);
      console.log(record);
      if (!record || number > record.numberOfTables) {
        navigate("/");
      }
    }
  }, [locations, record]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8 select-none">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="text-center text-xxl">Asztal {number}</p>
      <div className="flex flex-col flex-grow w-full mt-4">
        <p className="text-xl mb-2">Időpont</p>
        <div className="flex justify-center">
          <StyledDatePickerWrapper>
            <DatePicker 
            selected={startDate} 
            onChange={(date) => {
              setStartDate(date);
            }}
            dateFormat={"yyyy.MM.dd HH:mm"} 
            showTimeSelect 
            timeFormat="HH:mm" 
            timeIntervals={15}
            minDate={new Date()} 
            maxDate={addDays(new Date(), 7)}
            customInput={<ExampleCustomInput className="bg-dark-grey px-8 py-2 rounded-md text-xl"/>}/>
          </StyledDatePickerWrapper>
        </div>
      </div>
    </div>
  )
}

export default ReserveTable;
