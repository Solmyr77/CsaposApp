import React, { useContext, useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import Context from "./Context";

function Order({ record, num }) {
  const { currentBooking, user, friends } = useContext(Context);
  const [total, setTotal] = useState(0);

  function calculateTotal() {
    let currentPrice = 0;
    record.orderItems.map(item => currentPrice += item.quantity * item.unitPrice);
    setTotal(currentPrice);
  }

  useEffect(() => {
    calculateTotal();
  }, [])

  return (
    <div className="bg-dark-grey w-full rounded-lg px-3 py-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-lg leading-none">Rendelés <span className="text-gray-300">#{num + 1}</span></p>
          <p className="font-normal text-gray-300 text-[14px]">Létrehozva: {`${record.updatedAt.split("T")[0].slice(5).replace("-", ".")}. ${record.updatedAt.split("T")[1].split("+")[0].slice(0, 5)}`}</p>
        </div>
      <div className="flex flex-col items-end gap-2">
        {
          record.userId === user.id ?
          <span className="badge bg-grey text-sky-400 border-0 text-xs">Saját</span> :
          <div className="flex items-center gap-1">
            <img src={`https://assets.csaposapp.hu/assets/images/${currentBooking?.tableGuests?.find(guest => guest.id === record.userId)?.imageUrl || currentBooking?.bookerId + ".webp"}`} alt="kép" className="h-6 aspect-square rounded-full border-2"/>
            <p className="text-[14px] max-w-32 line-clamp-1">{currentBooking?.tableGuests?.find(guest => guest.id === record.userId)?.displayName || friends.find(item => currentBooking?.bookerId === item.id)?.displayName}</p>
          </div>
        }
        {
          record.orderStatus === "pending" && <span className="badge bg-yellow-500 border-0 h-fit">Teljesítésre vár</span>
        }
        {
          record.orderStatus === "rejected" && <span className="badge bg-red-500 border-0 h-fit">Elutasítva</span>
        }
        {
          record.orderStatus === "completed" && <span className="badge bg-gradient-to-tr from-blue to-sky-400 border-0 h-fit">Elutasítva</span>
        }
      </div>
      </div>
      <div className="flex flex-col mt-3">
        {
          record.orderItems.map(product => (
            <OrderItem product={product} isOrdered/>
          ))
        }
      </div>
      <span className="text-md">Összesen: {total} Ft</span>
    </div>
  )
}

export default Order;
