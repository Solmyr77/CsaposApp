import React, { forwardRef, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import BackButton from "./BackButton";
import { CalendarIcon, CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
  
  .react-datepicker__time-list-item--disabled:hover {
    background-color: unset !important;
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
  const { locations, tables, currentTable, setCurrentTable, previousRoutes, tableFriends, setTableFriends, bookings, getBookings, logout } = useContext(Context);  
  const { name, number } = useParams(); 
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(3);
  const ExampleCustomInput = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        {value} <hr className="w-8 rotate-90 rounded-md"/> <CalendarIcon className="w-6"/>
      </button>
    )
  );

  async function handleAddToTable(bookingId) {
    try {
      const userIds = Array.from(tableFriends.map(friend => friend.id));
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/add-to-table`, {
        userIds: userIds,
        bookingId: bookingId
      }, config);
      const data = response.data;
      console.log(data);
      response.status === 200 && setIsBooked(true);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          handleAddToTable(bookingId);
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
    console.log(tableFriends);
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/book-table`, {
        tableId: currentTable.id,
        bookedFrom: new Date(startDate.setHours(startDate.getHours() + 1)),
        bookedTo: new Date()
      }, config);
      const data = response.data;
      if (response.status === 200) {
        tableFriends.length > 0 && await handleAddToTable(data.id);
        setIsBooked(true);
        getBookings();
        updateTime();
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
    const roundedMinutes = Math.ceil(new Date().getMinutes() / 15) * 15;
    const newDate = new Date();
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
          const foundTable = tables.find(table => table.locationId === location.id && table.number === Number(number) && !table.isBooked);
          if (foundTable) {
            setCurrentTable(foundTable);
            console.log(foundTable);
          }
          else navigate("/");
        }
      }
    }
    setInterval(() => {
      updateTime();
    }, 900000 - new Date().getMilliseconds());
  }, [locations, tables, number, name]);

  useEffect(() => {
    if (isBooked) {
      if (remainingSeconds <= 0) navigate("/");
      const interval = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval); 
    }
  }, [isBooked, remainingSeconds]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-hidden bg-grey text-white font-bold px-4 py-8 select-none">
      {
      !isBooked && bookings ? 
      <div className="">
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
          <p className="text-sm font-normal mb-4">Max: {Number(currentTable.capacity) - 1} fő</p>
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
            <PlusIcon className={`${tableFriends.length < Number(currentTable.capacity) - 1 ? "block" : "hidden"} w-16 bg-dark-grey text-gray-500 rounded-full hover:cursor-pointer`} onClick={() => setIsModalVisible(state => !state)}/>
          </div>
          <div className="flex h-full justify-center items-center flex-grow mt-8">
            <button className="w-64 h-20 bg-blue rounded flex justify-center items-center select-none hover:cursor-pointer text-xl" onClick={() => handleTableBooking()}>Foglalás</button>
          </div>
        </div>
      </div> :
      <div className="flex flex-col justify-center flex-grow items-center h-1/2 p-4">
        <div className="flex flex-col items-center bg-dark-grey p-4 rounded-md text-green-500 shadow-md">
          <p className="text-lg">Sikeres foglalás!</p>
          <CheckIcon className="w-12"/>
          <p className="mt-2 text-white font-normal">Vissza a főoldalra... {remainingSeconds}</p>
        </div>
      </div>
      }
    </div>
  )
}

export default ReserveTable;
