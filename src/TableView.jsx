import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GuestItem from "./GuestItem";
import Context from "./Context";
import TableContext from "./TableProvider";
import Order from "./Order";

function TableView() {
  const { tables, bookings } = useContext(Context);
  const { selectedGuest, setSelectedGuest } = useContext(TableContext);
  const { number } = useParams();
  const [currentTable, setCurrentTable] = useState({});
  const [currentBooking, setCurrentBooking] = useState({});

  //find current table and current booking
  useEffect(() => {
    if (tables.length > 0 && bookings.length > 0) {
      const foundTable = tables.find(table => table.number === Number(number));
      if (foundTable) {
        const foundBooking = bookings.find(booking => booking.tableId === foundTable.id);
        setCurrentBooking(foundBooking);
        setCurrentTable(foundTable);
        foundBooking?.tableGuests?.length > 0 && setSelectedGuest(foundBooking.tableGuests[0]);
      }
    }

    return () => setSelectedGuest({});
  }, [tables, bookings]);

  return (
    <div className="flex flex-col p-4 gap-5">
      <div className="flex justify-between items-center">
        <span className="text-5xl font-bold">Asztal {currentTable.number}</span>
        <button className="btn btn-error disabled:!btn-error disabled:!bg-error disabled:opacity-50" disabled>Asztal felszabadítása</button>
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
              <button className="btn text-md font-bold border-2" onClick={() => setSelectedGuest({})}>Összes</button>
            </div>
          </div>
          <div className="flex flex-col gap-4 overflow-auto h-full">
            {
              currentTable?.orders?.length > 0 ?
              currentTable.orders.map((order) => <Order key={order.id} order={order}/>) :
              <span>Nincsenek rendelések</span>
            }
          </div>
          <span className="text-lg font-bold self-end">Összesen: 2400 Ft</span>
        </div>

      </div>
    </div>
  )
}

export default TableView;
