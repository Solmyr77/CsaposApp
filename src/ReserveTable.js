import React, { useState, forwardRef, useContext } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import styled from "styled-components";
import hu from 'date-fns/locale/hu';
import { LuCalendar } from "react-icons/lu";
import TableItem from "./TableItem";
import Context from "./Context";
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
  const { previousRoutes } = useContext(Context);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const ExampleCustomInput = forwardRef(
      ({ value, onClick, className }, ref) => (
        <button className={className} onClick={onClick} ref={ref}>
          <span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">{value}</span> <hr className="w-8 rotate-90 rounded-md"/> <LuCalendar/>
        </button>
      )
  );

  // async function handleAddToTable(bookingId) {
  //   try {
  //     const userIds = Array.from(tableFriends.map(friend => friend.id));
  //     const config = {
  //       headers: { 
  //         Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
  //         "Cache-Content": "no-cache"
  //       }
  //     }
  //     const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/add-to-table`, {
  //       userIds: userIds,
  //       bookingId: bookingId
  //     }, config);
  //     const data = response.data;
  //     response.status === 200 && setIsBooked(true);
  //   }
  //   catch (error) {
  //     if (error.response?.status === 401) {
  //       if (await getAccessToken()) {
  //         handleAddToTable(bookingId);
  //       }
  //       else {
  //         await logout();
  //         window.location.reload();
  //         return false;
  //       }
  //     } 
  //     else {
  //       return false;
  //     }
  //   }
  // }

  // async function handleTableBooking() {
  //   try {
  //     const config = {
  //       headers: { 
  //         Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
  //         "Cache-Content": "no-cache"
  //       }
  //     }
  //     const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/book-table`, {
  //       tableId: currentTable.id,
  //       bookedFrom: new Date(startDate.setHours(startDate.getHours() + 1)),
  //       bookedTo: new Date()
  //     }, config);
  //     const data = response.data;
  //     if (response.status === 200) {
  //       tableFriends.length > 0 && await handleAddToTable(data.id);
  //       setIsBooked(true);
  //       await getBookingsByUser();
  //       updateTime();
  //     }
  //   }
  //   catch (error) {
  //     if (error.response?.status === 401) {
  //       if (await getAccessToken()) {
  //         handleTableBooking();
  //       }
  //       else {
  //         await logout();
  //         window.location.reload();
  //         return false;
  //       }
  //     } 
  //     else {
  //       return false;
  //     }
  //   }
  // }

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

  return (
    <div className="min-h-screen w-full bg-grey text-white overflow-y-scroll flex flex-col py-8 px-4 font-bold gap-8">
      <div className="">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
          <BackButton/>
        </Link>
        <p className="text-xl text-center">Félidő söröző</p>
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
      <div className="flex flex-col gap-3">
        <p className="text-lg">Asztal választása</p>
        <div className="grid grid-cols-2 gap-2">
          <TableItem/>
        </div>
      </div>
    </div>
  )
}

export default ReserveTable;
