import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import GuestItem from "./GuestItem";
import Context from "./Context";
import TableContext from "./TableProvider";
import Order from "./Order";
import getAccessToken from "./refreshToken";
import axios from "axios";

function TableView() {
  const { tables, bookings, setBookings, logout } = useContext(Context);
  const { selectedGuest, setSelectedGuest } = useContext(TableContext);
  const { number } = useParams();
  const [currentTable, setCurrentTable] = useState({});
  const [currentBooking, setCurrentBooking] = useState({});
  const [currentTotal, setCurrentTotal] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const modalRef = useRef();

  async function handleRemoveBooking() {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Content-Type" : "application/json"
        },
        data: {
          bookingId: currentBooking.id
        }
    }
      const response = await axios.delete(`https://backend.csaposapp.hu/api/bookings/remove-booking`, config);

      setIsLoading(false);
      setIsSuccessful(true);
      setTimeout(() => {
        modalRef.current.close();
        setIsSuccessful(false);
        setBookings(state => {
          return [...state.filter(booking => booking.id !== currentBooking.id)];
        });
        setCurrentBooking({});
        setIsActive(false);
      }, 1000);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await handleRemoveBooking();
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  //setting timout for state update
  function setIsActiveTimeout(foundBooking) {
    const currentTime = new Date().getTime();
    const bookedFromTime = new Date(foundBooking.bookedFrom).getTime();
    const timeout = setTimeout(() => {
      setIsActive(true);
    }, bookedFromTime - currentTime);

    return () => clearTimeout(timeout);
  }

  //find current table and current booking
  useEffect(() => {
    if (tables?.length > 0) {
      const foundTable = tables.find(table => table.number === Number(number));
      foundTable && setCurrentTable(foundTable);
      console.log(foundTable)
      if (bookings?.length > 0) {
        const foundBooking = bookings.find(booking => booking.tableId === foundTable.id);
        if (foundBooking) {
          setCurrentBooking(foundBooking);
          if (new Date(foundBooking.bookedFrom).getTime() < new Date().getTime()) {
            setIsActive(true);
          }
          else setIsActiveTimeout(foundBooking);
        }
      }
      else {
        setIsActive(false);
        setCurrentBooking({});
      } 
    }

    return () => setSelectedGuest({});
  }, [tables, bookings]);

  //filter orders
  useEffect(() => {
    if (selectedGuest.id) {
      setFilteredOrders(currentTable.orders.filter(order => order.userId === selectedGuest.id));
    }
    else {
      console.log(currentTable.orders)
      setFilteredOrders(currentTable.orders);
    }
  }, [selectedGuest, currentTable.orders]);

  //calculate total
  useEffect(() => {
    console.log(filteredOrders?.length);
    if (filteredOrders?.length > 0) {
      let subTotal = 0;
      filteredOrders.map(order => order.orderItems.map(item => subTotal += item.quantity * item.unitPrice));
      setCurrentTotal(subTotal);
    }
    else setCurrentTotal(0);
  }, [filteredOrders?.length]);

  return (
    <div className="flex flex-col p-4 gap-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold">Asztal {currentTable.number}</span>
          {
            isActive ?
            <div className="badge badge-success badge-xl font-bold">Aktív</div> :
            null
          }
        </div>
        {
          currentBooking?.id &&
          <button className="btn btn-error disabled:!btn-error disabled:!bg-error disabled:opacity-50" onClick={() => {
            modalRef.current.inert = true;
            modalRef.current.showModal();
            modalRef.current.inert = false;
          }} disabled={isActive && currentTable.orders?.length > 0}>Foglalás törlése</button>
        }
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div className="flex flex-col border-2 rounded-md p-2 gap-4 col-span-2">
          <span className="text-xl font-bold">Vendégek</span>
          <div className="flex flex-col gap-4 overflow-auto">
            {
              currentBooking?.tableGuests?.length > 0 ?
              currentBooking.tableGuests.map(guest=> <GuestItem key={guest.id} guest={guest}/>) :
              <span>Nincsenek vendégek</span>
            }
          </div>
        </div>

        <div className="flex flex-col border-2 rounded-md p-2 gap-4 col-span-3 row-span-2 h-full" style={{maxHeight: "calc(100vh - 14rem)"}}>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Rendelések</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">{selectedGuest.number ? `Vendég ${selectedGuest.number}` : "Összes"}</span>
              <button className="btn text-md font-bold border-2 shadow" onClick={() => setSelectedGuest({})}>Összes</button>
            </div>
          </div>
          <div className="flex flex-col gap-4 overflow-auto h-full">
            {
              filteredOrders?.length > 0 ?
              filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order, i) => <Order key={i} order={order}/>) :
              <span>Nincsenek rendelések</span>
            }
          </div>
          <span className="text-lg font-bold self-end">Összesen: {currentTotal} Ft</span>
        </div>
      </div>

      <dialog className="modal" ref={modalRef}>
        <div className="modal-box">
            {
              isSuccessful ? 
              <span className="text-lg text-center font-bold">Sikeres törlés!</span> :
              <div className="flex flex-col gap-4">
                <span className="font-bold text-lg">Biztosan törölni szeretnéd?</span>
                <div className="flex gap-4 items-center justify-center">
                  <button className="btn btn-error basis-1/2 text-md disabled:!text-error-content disabled:!bg-error disabled:opacity-50" onClick={() =>handleRemoveBooking()}>
                    Igen
                    {
                      isLoading === true &&
                      <div className="loading loading-spinner"></div>
                    }
                  </button>
                  <button className="btn border-2 shadow basis-1/2 text-md" onClick={() => modalRef.current.close()}>Mégsem</button>
                </div>
              </div>
            }
        </div>
        <form method="dialog" className="modal-backdrop"><button></button></form>
      </dialog>
    </div>
  )
}

export default TableView;
