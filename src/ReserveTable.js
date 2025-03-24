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
import getAccessToken from "./refreshToken";
import axios from "axios";
import bookingConnection from "./signalRBookingConnection";
import UserImage from "./UserImage";
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
  const { previousRoutes, getLocationTables, selectedTable, locations, friends, tableFriends, setTableFriends, setSelectedTable, getBookingsByUser, logout, setAllBookings } = useContext(Context);
  const { name } = useParams();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [locationTables, setLocationTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(null);
  const [bookingsForLocation, setBookingsForLocation] = useState([]);
  const [counter, setCounter] = useState(3);
  const [timeSlots, setTimeSlots] = useState([]);
  const [openTime, setOpenTime] = useState(new Date());
  const modalRef = useRef();
  const CustomInput = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        <span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">{value}</span> <hr className="w-8 rotate-90 rounded-md"/> <LuCalendar/>
      </button>
    )
  );

  //add friends to table booking
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
          await handleAddToTable(bookingId);
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

  //book selected table
  async function handleTableBooking() {
    setIsLoading(true);
    try {
      const bookedFromTime = new Date(startDate);
      if (selectedTime === "Most") {
        bookedFromTime.setHours(bookedFromTime.getHours() + 1);
        bookedFromTime.setMinutes(bookedFromTime.getMinutes());
      }
      else {
        bookedFromTime.setHours(Number(selectedTime.slice(0,2)) + 1);
        bookedFromTime.setMinutes(Number(selectedTime.slice(3)));
      }
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
        const bookings = await getBookingsByUser();
        setAllBookings(state => {
          const newBooking = bookings.find(booking => booking.id === data.id);
          console.log(newBooking);
          if (newBooking) return [...state, newBooking]
          return state;
        });
        bookingConnection.invoke("JoinBookingGroup", data.id)
        .then(() => console.log("✅ Joined booking group", data.id))
        .catch(err => console.log("Failed to join booking group", err));
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

  //fetch bookings for current location
  async function getBookingsForLocation(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/bookings/bookings-for-location?locationId=${id}`, config);
      const data = await response.data;
      if (response.status === 200) {
        setBookingsForLocation(data);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          getBookingsForLocation(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
  }

  //select todays opening and closing time
  function getDayOfTheWeek(startDate) {
    switch (startDate.getDay()) {
      case 1:
        return {open: currentLocation.businessHours.mondayOpen, close: currentLocation.businessHours.mondayClose};
      
      case 2:
        return {open: currentLocation.businessHours.tuesdayOpen, close: currentLocation.businessHours.tuesdayClose};
        
      case 3:
        return {open: currentLocation.businessHours.wednesdayOpen, close: currentLocation.businessHours.wednesdayClose};
      
      case 4:
        return {open: currentLocation.businessHours.thursdayOpen, close: currentLocation.businessHours.thursdayClose};
      
      case 5:
        return {open: currentLocation.businessHours.fridayOpen, close: currentLocation.businessHours.fridayClose};

      case 6:
        return {open: currentLocation.businessHours.saturdayOpen, close: currentLocation.businessHours.saturdayClose};

      case 0:
        return {open: currentLocation.businessHours.sundayOpen, close: currentLocation.businessHours.sundayClose};
    }
  }

  //generate timeslots in 15 mintues interval from opening time to closing time
  function generateTimeSlots(startDate) {
    setSelectedTable({});
    setSelectedTime("");

    const currentDay = getDayOfTheWeek(startDate);
    const slots = [];

    //parse the day's closing time
    const closingTime = new Date(startDate);
    const [closeHour, closeMinute] = currentDay.close.split(":").map(Number);
    closingTime.setHours(closeHour, closeMinute, 0, 0);

    //subtract 45 minutes from closing time
    const latestTime = new Date(closingTime.getTime() - 45 * 60000);

    // set the starting time to now or the date's open time, whichever is later
    let now = new Date();
    const [openHour, openMinute] = currentDay.open.split(":").map(Number);
    if (startDate.toDateString() !== now.toDateString() || now.getHours() < openHour) {
      //if not today, set "now" to the opening time
      now = new Date(startDate);
      now.setHours(openHour, openMinute, 0, 0);
    }

    // Round up to the next 15-minute interval
    const minutes = now.getMinutes();
    now.setMinutes(Math.ceil(minutes / 15) * 15);
    now.setSeconds(0);
    now.setMilliseconds(0);
    console.log(now)

    //Adjust latestTime if close time is after midnight
    if (Number(currentDay.open.split(":")[0]) > latestTime.getHours()) latestTime.setDate(latestTime.getDate() + 1);

    // Generate time slots from now to 45 minutes before closing
    while (now < latestTime) {
      slots.push(now);
      now = new Date(now.getTime() + 15 * 60000);
    }
    return slots;
  }

  //handle successful booking, essential function calls
  useEffect(() => {
    if (isBooked) {
      setIsLoading(false);
      modalRef.current.inert = false;
      modalRef.current.showModal();
      modalRef.current.inert = true;
      const interval = setInterval(() => {
        setCounter(state => {
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
      const foundLocation = locations.find(location => location.name === name);
      if (foundLocation && foundLocation?.isOpen) {
        setCurrentLocation(foundLocation);
        const run = async () => {
          setLocationTables(await getLocationTables(foundLocation.id));
          await getBookingsForLocation(foundLocation.id);
        }
        run();
      }
      else navigate("/");
    }
  }, [locations, isBooked]);

  //add bookings to tables as a new property
  useEffect(() => {
    if (locationTables?.length > 0 && bookingsForLocation.length > 0) {
      for (let locationTable of locationTables) {
        const newObject = {};
        bookingsForLocation.map((locationBooking, i) => {
          if (locationBooking.tableId === locationTable.id) {
            newObject[i] = locationBooking.bookedFrom;
            locationTable.bookings = newObject;
          }
        })
      }
    }
  }, [locationTables, bookingsForLocation]);

  //set todays opening time, generate timeslots
  useEffect(() => {
    if (startDate, currentLocation.businessHours) {
      const currentDay = getDayOfTheWeek(startDate);
      const currentDate = new Date();
      currentDate.setHours(Number(currentDay.open.split(":")[0]), Number(currentDay.open.split(":")[1]));
      setOpenTime(currentDate);
      setTimeSlots(generateTimeSlots(startDate));
    }
  }, [startDate, currentLocation]);

  return (
    <div className="min-h-screen w-full bg-grey text-white overflow-y-auto flex flex-col py-8 px-4 font-bold gap-8">
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
              customInput={<CustomInput className="bg-dark-grey px-4 py-2 rounded-lg text-lg flex flex-row items-center"/>}/>
          </StyledDatePickerWrapper>
          {
            startDate.getDate() === new Date().getDate() ?
              <div className="flex gap-2">
                {
                  timeSlots.length > 0  ?
                  <div className="flex gap-2 overflow-x-auto"> 
                    {
                      openTime.getTime() < new Date().getTime() && <button className={`btn w-fit bg-dark-grey hover:bg-dark-grey border-0 text-white text-sm ${selectedTime === "Most" && "bg-gradient-to-tr from-blue to-sky-400 hover:bg-gradient-to-tr"}`} onClick={() => setSelectedTime("Most")}>Most</button>
                    }
                    <div className="flex gap-2 overflow-x-auto">
                    {
                      timeSlots.map((time, i) => <button key={i} className={`btn w-fit bg-dark-grey hover:bg-dark-grey border-0 text-white text-sm ${selectedTime === time.toTimeString().slice(0, 5) && "bg-gradient-to-tr from-blue to-sky-400 hover:bg-gradient-to-tr"}`} onClick={() => setSelectedTime(time.toTimeString().slice(0,5))}>{time.toTimeString().slice(0,5)}</button>)
                    }
                    </div>
                  </div> :
                  <div className="flex w-full justify-center items-center">
                    <span className="text-gray-300 font-normal">A mai napra már nem tudsz asztalt foglalni</span>
                  </div>
                }
              </div> :
              <div className="flex gap-2 overflow-x-auto">
                {
                  timeSlots.map((time, i) => <button key={i} className={`btn w-fit bg-dark-grey hover:bg-dark-grey border-0 text-white text-sm ${selectedTime === time.toTimeString().slice(0, 5) && "bg-gradient-to-tr from-blue to-sky-400 hover:bg-gradient-to-tr"}`} onClick={() => setSelectedTime(time.toTimeString().slice(0,5))}>{time.toTimeString().slice(0,5)}</button>)
                }
              </div>
          }
      </div>
      <div className={`flex flex-col gap-3 ${!selectedTime && "opacity-50"}`}>
        <p className="text-lg">Asztal választása</p>
        <div className="grid grid-cols-2 gap-2">
          {
            locationTables?.length > 0 &&
            locationTables?.sort((a, b) => {
              if (selectedTime === "Most") {
                const newDate = new Date();
                startDate.setHours(newDate.getHours(), newDate.getMinutes());
              }
              else startDate.setHours(Number(selectedTime.slice(0,2)), Number(selectedTime.slice(3)), 0)
              if (a?.capacity === b?.capacity) return a?.number - b?.number;
              return a?.capacity - b?.capacity;
            }).map(table => {
              return <TableItem key={table.id} table={table} date={startDate} time={selectedTime}/>;
            })
          }
        </div>
      </div>
      {
        friends.length > 0 &&
        <div className={`flex flex-col gap-3 ${!Object.hasOwn(selectedTable, "id") && "opacity-50"}`}>
          <div>
            <p className="text-lg">Barátok meghívása</p>
            <p className={`text-gray-300 font-normal ${!Object.hasOwn(selectedTable, "id") && "hidden"}`}>Max: {selectedTable?.capacity - 1} fő</p>
          </div>
          <div className="flex flex-col max-h-80 flex-grow gap-2 overflow-y-auto">
            {
              friends.every(friend => Object.hasOwn(friend, "id")) &&
              friends.map(friend => <InviteFriendItem key={friend.id} friend={friend}/>)
            }
          </div>
        </div>
      }
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
              tableFriends?.map(friend => <UserImage key={friend.id} record={friend} width={"w-10"} border/>)
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
