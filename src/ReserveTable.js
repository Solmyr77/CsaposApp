import React, { useState, forwardRef, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "./BackButton";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import styled from "styled-components";
import hu from 'date-fns/locale/hu';
import { LuCalendar,  LuCheck,  LuClock, LuMapPin } from "react-icons/lu";
import TableItem from "./TableItem";
import Context from "./Context";
import InviteFriendItem from "./InviteFriendItem";
import { MdOutlineTableRestaurant } from "react-icons/md";
import AvatarGroupItem from "./AvatarGroupItem";
import getAccessToken from "./refreshToken";
import axios from "axios";
registerLocale('hu', hu);

const StyledDatePickerWrapper = styled.div`
  .react-datepicker-popper {
    left: 1em !important;
  }

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
    background-color: #1c1c1c;
  }

  .react-datepicker__day--selected{
    color: white;
    background-color: #007AFF !important;
  }

  .react-datepicker__day:hover {
    color: white;
    background-color: #4c98ff !important;
  }
  
  .react-datepicker__day--disabled {
    color: grey;
  }

  .react-datepicker__day--disabled:hover {
    color: grey;
    background-color: unset;
  }

  .react-datepicker__triangle {
    stroke: #1c1c1c;
    color: #1c1c1c !important;
    fill: #1c1c1c !important;
  }
`;

function ReserveTable() {
  const { previousRoutes, getLocationTables, selectedTable, locations, friends, tableFriends, setTableFriends, setSelectedTable, getBookingsByUser, logout } = useContext(Context);
  const { name } = useParams();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [locationTables, setLocationTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(null);
  const [counter, setCounter] = useState(3);
  const modalRef = useRef();
  const ExampleCustomInput = forwardRef(
      ({ value, onClick, className }, ref) => (
        <button className={className} onClick={onClick} ref={ref}>
          <span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">{value}</span> <hr className="w-8 rotate-90 rounded-md"/> <LuCalendar/>
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
      response.status === 200 && setIsBooked(true);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          handleAddToTable(bookingId);
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

  async function handleTableBooking() {
    setIsLoading(true);
    try {
      const bookedFromTime = new Date(startDate);
      bookedFromTime.setHours(Number(selectedTime.slice(0,2)) + 1);
      bookedFromTime.setMinutes(Number(selectedTime.slice(3)));
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/book-table`, {
        tableId: selectedTable.id,
        bookedFrom: bookedFromTime
      }, config);
      const data = response.data;
      if (response.status === 200) {
        tableFriends.length > 0 && await handleAddToTable(data.id);
        setIsBooked(true);
        await getBookingsByUser();
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          handleTableBooking();
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
  }

  function generateTimeSlots() {
    let slots = [];
    let start = new Date();
    let minutes = start.getMinutes();
    start.setMinutes(Math.ceil(minutes / 15) * 15);
    start.setSeconds(0);
    start.setMilliseconds(0);

    for (let i = 0; i < (24 * 60) / 15; i++) {
        slots.push(new Date(start).toTimeString().slice(0, 5));
        start = new Date(start.getTime() + 15 * 60000);
    }
    return slots;
  }

  useEffect(() => {
    if (isBooked) {
      setIsLoading(false);
      modalRef.current.inert = false;
      modalRef.current.showModal();
      modalRef.current.inert = true;
      const interval = setInterval(() => {
        setCounter(state => {
          console.log(state);
          if (state > 0) {
            return state - 1;
          }
          else {
            clearInterval(interval);
            navigate("/");
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    setTableFriends([]);
    setSelectedTable({});
    if (locations.length > 0) {
      setCurrentLocation(() => {
        const foundLocation = locations.find(location => location.name === name);
        if (foundLocation) return foundLocation;
        else {
          navigate("/");
          return 0;
        }
      });
      if (Object.hasOwn(currentLocation, "id")) {
        const run = async () => {
          setLocationTables(await getLocationTables(currentLocation.id));
        }
        run();
      }
    }
  }, [locations, currentLocation, isBooked])

  return (
    <div className="min-h-screen w-full bg-grey text-white overflow-y-scroll flex flex-col py-8 px-4 font-bold gap-8">
      <div className="">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
          <BackButton/>
        </Link>
        <p className="text-xl text-center">{currentLocation?.name}</p>
      </div>
      <div className="flex flex-col gap-3">
          <p className="text-lg">Időpont választása</p>
          <StyledDatePickerWrapper>
              <DatePicker
              selected={startDate} 
              onChange={(date) => {
              setStartDate(date);
              }}
              dateFormat={"yyyy.MM.dd"} 
              minDate={new Date()} 
              maxDate={addDays(new Date(), 7)}
              locale={"hu"}
              timeCaption="Idő"
              className="font-play"
              customInput={<ExampleCustomInput className="bg-dark-grey px-4 py-2 rounded-lg text-lg flex flex-row items-center"/>}/>
          </StyledDatePickerWrapper>
          <div className="flex gap-2 overflow-x-scroll">
              {
                generateTimeSlots().map(time => <button className={`btn w-fit bg-dark-grey hover:bg-dark-grey border-0 text-white text-sm ${selectedTime === time && "bg-gradient-to-tr from-blue to-sky-400 hover:bg-gradient-to-tr"}`} onClick={() => setSelectedTime(time)}>{time}</button>)
              }
          </div>
      </div>
      <div className={`flex flex-col gap-3 ${!selectedTime && "opacity-50"}`}>
        <p className="text-lg">Asztal választása</p>
        <div className="grid grid-cols-2 gap-2">
          {
            locationTables?.length > 0 &&
            locationTables?.sort((a, b) => {
              if (a?.capacity === b?.capacity) return a?.number - b?.number;
              return a?.capacity - b?.capacity;
            }).map(table => <TableItem table={table} time={selectedTime}/>)
          }
        </div>
      </div>
      <div className={`flex flex-col gap-3 ${!Object.hasOwn(selectedTable, "id") && "opacity-50"}`}>
        <div>
          <p className="text-lg">Barátok meghívása</p>
          <p className={`text-gray-300 font-normal ${!Object.hasOwn(selectedTable, "id") && "hidden"}`}>Max: {selectedTable?.capacity - 1} fő</p>
        </div>
        <div className="flex flex-col max-h-80 flex-grow gap-2 overflow-y-auto">
          {
            friends.every(friend => Object.hasOwn(friend, "id")) &&
            friends.map(friend => <InviteFriendItem friend={friend}/>)
          }
        </div>
      </div>
      <div className={`flex flex-col gap-3 text-md ${!(selectedTime && Object.hasOwn(selectedTable, "id")) && "hidden"}`}>
        <p className="text-lg">Összegzés</p>
        <div className="flex flex-col bg-dark-grey rounded-lg p-2 font-normal">
          <p className="text-lg font-bold">{currentLocation?.name}</p>
          <div className="flex items-center gap-1 text-gray-300 mb-2">
            <LuMapPin/>
            <p className="text-sm font-normal">{currentLocation?.address || "2889 Súr"}</p>
          </div>
          <div className="flex items-center gap-2">
            <LuCalendar/>
            <p>{startDate.toLocaleDateString("hu").slice(5)}</p>
          </div>
          <div className="flex items-center gap-2">
            <LuClock/>
            <p>{selectedTime || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineTableRestaurant/>
            <p>Asztal <span className="text-gray-300">#{selectedTable?.number}</span></p>
          </div>
          <p className={`font-bold ${tableFriends?.length === 0 && "hidden"} mb-1`}>Meghívott barátok</p>
          <div className="avatar-group -space-x-4 rtl:space-x-reverse">
            {
              tableFriends?.length > 0 &&
              tableFriends?.map(friend => <AvatarGroupItem imageUrl={friend.imageUrl}/>)
            }
          </div>
        </div>
      </div>
      {
        isLoading ? 
        <span className="loading loading-spinner text-sky-400 w-20 self-center"></span> :
        <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 text-white w-56 h-20 self-center text-xl shadow-[0_4px_4px_rgba(0,0,0,.25)] disabled:text-white disabled:opacity-50" onClick={() => handleTableBooking()} disabled={!(selectedTime && Object.hasOwn(selectedTable, "id"))}>Foglalás</button>
      }
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box flex flex-col items-center bg-grey">
          <p className="bg-gradient-to-t from-blue to-sky-400 text-transparent bg-clip-text text-lg font-bold">Sikeres foglalás!</p>
          <LuCheck className="fill-none stroke-[url(#gradient)] h-12 w-12"/>
          <div className="flex items-center mt-2 font-normal gap-1 text-gray-300">
            <p>Visszatérés a kezdőoldalra...</p>
            <span className="countdown">
              <span style={{"--value" : counter}} aria-live="polite" aria-label={counter}></span>
            </span>
          </div>
        </div>
      </dialog>
      <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
    </div>
  )
}

export default ReserveTable;
