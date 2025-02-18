import React, { forwardRef, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import { CalendarIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from 'date-fns';
import styled from "styled-components";
import hu from 'date-fns/locale/hu';
import Friend from "./Friend";
import AddFriendToTableModal from "./AddFriendToTableModal";
import axios from "axios";
import getAccessToken from "./refreshToken";
registerLocale('hu', hu);


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
    background-color: #007AFF !important;
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
  const { locations, tables, previousRoutes, tableFriends, setTableFriends, logout } = useContext(Context);  
  const { name, number } = useParams(); 
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [table, setTable] = useState({});
  const ExampleCustomInput = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        {value} <hr className="w-8 rotate-90 rounded-md"/> <CalendarIcon className="w-6"/>
      </button>
    )
  );

  async function handleAddToTable(userId, bookingId) {
    console.log(localStorage.getItem("accessToken"));
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/add-to-table`, {
        userId: userId,
        bookingId: bookingId
      }, config);
      const data = response.data;
      console.log(data);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          handleAddToTable(userId, bookingId);
        }
        else {
          await logout();
          window.location.reload();
          return false;
        }
      } 
      else {
        return false;
      }
    }
  }

  async function handleTableBooking() {
    setStartDate(state => state.setHours(state.getHours() + 1));
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/book-table`, {
        tableId: table.id,
        bookedFrom: startDate,
        bookedTo: new Date()
      }, config);
      const data = response.data;
      if (response.status === 200) {
        console.log(data);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          handleTableBooking();
        }
        else {
          await logout();
          window.location.reload();
          return false;
        }
      } 
      else {
        return false;
      }
    }
  }

  function updateTime() {
    const roundedMinutes = Math.ceil(startDate.getMinutes() / 15) * 15;
    const newDate = new Date(startDate);
    newDate.setMinutes(roundedMinutes);
    setStartDate(newDate);
  }

  useEffect(() => {
    setTableFriends([]);
    if (locations.length > 0 && name) {
      updateTime();
      const location = locations.find(location => location.name === name);
      if (location) {
        if (tables.length > 0) {
          const foundTable = tables.find(table => table.locationId === location.id && table.number === Number(number));
          if (foundTable) {
            setTable(foundTable);
          }
          else navigate("/");
        }
      }
    }
    setInterval(() => {
      updateTime();
    }, 900000);
  }, [locations, tables, number, name]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8 select-none">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton/>
      </Link>
      <p className="text-center text-xxl">Asztal {number}</p>
      <div className="flex flex-col flex-grow w-full mt-4">
        <p className="text-lg mb-2">Időpont</p>
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
            minTime={new Date()}
            maxTime={setHours(setMinutes(new Date(), 45), 23)}
            locale={"hu"}
            timeCaption="Idő"
            className="font-play"
            customInput={<ExampleCustomInput className="bg-dark-grey px-4 py-2 rounded-md text-lg flex flex-row items-center"/>}/>
          </StyledDatePickerWrapper>
        </div>
        <p className="text-lg mt-8 mb-1">Barátok meghívása</p>
        <p className="text-sm font-normal mb-4">Max: {Number(table.capacity) - 1} fő</p>
        <div className="grid grid-cols-4 gap-2 place-items-center">
          <AddFriendToTableModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
          {
            tableFriends.map(record => (
              <div className="relative">
                <Friend record={record}/>
                <XMarkIcon className="w-6 bg-red-500 rounded-full absolute -top-1 right-0 hover:cursor-pointer" onClick={() => setTableFriends(tableFriends.filter(element => element.displayName !== record.displayName))}/>
              </div>
            ))
          }
          <PlusIcon className={`${tableFriends.length < Number(table.capacity) - 1 ? "block" : "hidden"} w-16 bg-dark-grey text-gray-500 rounded-full hover:cursor-pointer`} onClick={() => setIsModalVisible(state => !state)}/>
        </div>
        <div className="flex h-full justify-center items-center flex-grow">
          <button className="w-64 h-20 bg-blue rounded flex justify-center items-center select-none hover:cursor-pointer text-xl" onClick={() => handleTableBooking()}>Foglalás</button>
        </div>
      </div>
    </div>
  )
}

export default ReserveTable;
