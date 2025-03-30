import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import OrderItem from "./OrderItem";

function Order({ order, orderMenu }) {
  const { locationProducts, tables } = useContext(Context);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState(0);

  //format time to HH:MM
  function formatTime(date) {
    const formattedTime = new Date(date);
    return formattedTime.toTimeString().slice(0,5);
  }

  //calculate total for current order, and find current orders products
  useEffect(() => {
    if (locationProducts.length > 0) {
      let subTotal = 0;
      const orderedProducts = locationProducts
        .filter(product => 
          order.orderItems.some(orderItem => orderItem.productId === product.id)
        )
        .map(product => {
          const foundItem = order.orderItems.find(orderItem => 
            orderItem.productId === product.id
          );
          subTotal += product.price * foundItem.quantity;
          return { ...product, quantity: foundItem.quantity };
        });
        setCurrentTotal(subTotal);
        setCurrentProducts(orderedProducts);
    }
  }, [locationProducts, order.orderItems]);

  //find current tables number
  useEffect(() => {
    if (tables.length > 0) {
      setTableNumber(tables.find((table) => table.id === order.tableId).number);
    } 
  }, [tables]) 
  
  return (
    !orderMenu ? (
      <div className={`flex flex-col bg-sky-200/75 p-2 rounded-md`}>
          <span>Létrehozva: {formatTime(order.createdAt)}</span>
          {
            order.orderStatus == "pending" ?
            <div className="self-end badge badge-warning font-bold">Teljesítendő</div> :
            <div className="self-end badge badge-success font-bold">Teljesítve</div>
          }
          <div className="flex flex-col gap-4">
            {
              currentProducts.length > 0 &&
              currentProducts.map((product, i) => <OrderItem key={i} item={product}/>)
            }
            <span className="self-end font-bold text-md">Összesen: {currentTotal} Ft</span>
          </div>
          <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12">Teljesítés!</button>
      </div>

    ) : (
      <div className={`flex flex-col bg-sky-200/75 p-2 rounded-md ${orderMenu && "min-w-[30rem] h-fit"}`}>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Asztal {tableNumber}</span>
          {
            order.orderStatus == "pending" ?
            <div className="self-end badge badge-warning font-bold">Teljesítendő</div> :
            <div className="self-end badge badge-success font-bold">Teljesítve</div>
          }
        </div>
        <span className="mb-2">Létrehozva: {formatTime(order.createdAt)}</span>
        <div className="flex flex-col gap-4">
          {
            currentProducts.length > 0 &&
            currentProducts.map((product, i) => <OrderItem key={i} item={product}/>)
          }
          <span className="self-end font-bold text-md">Összesen: {currentTotal} Ft</span>
        </div>
        <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12">Teljesítés!</button>
    </div>
    )
  )
}

export default Order;
