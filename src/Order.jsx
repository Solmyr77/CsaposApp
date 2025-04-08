import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import OrderItem from "./OrderItem";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Order({ order, orderMenu }) {
  const { locationProducts, tables } = useContext(Context);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  async function handleUpdateStatus(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.put(`https://backend.csaposapp.hu/api/orders/${id}/status`, {
        orderStatus: "completed"
      } , config);
      if (response.status === 200) {
        console.log(response.data);
        setIsCompleted(true);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          return await handleUpdateStatus(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

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

  //set iscompleted state for an orders status
  useEffect(() => {
    if (order.orderStatus === "completed") setIsCompleted(true);
  }, [order]);
  
  
  return (
    !orderMenu ? (
      <div className={`flex flex-col bg-sky-200/75 p-2 rounded-md`}>
          <span>Létrehozva: {formatTime(order.createdAt)}</span>
          {
            !isCompleted ?
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
          <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12" disabled={isCompleted} onClick={async () => {
            await handleUpdateStatus(order.id);
          }}> 
          {
            !isCompleted ? 
            "Teljesítés!" : 
            "Teljesítve"
          }</button>
      </div>

    ) : (
      <div className={`flex flex-col bg-sky-200/75 p-2 rounded-md ${orderMenu && "min-w-[30rem] h-fit"}`}>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Asztal {tableNumber}</span>
          {
            !isCompleted ?
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
        <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12" disabled={isCompleted} onClick={async () => {
          await handleUpdateStatus(order.id);
        }}>
        {
          !isCompleted ? 
          "Teljesítés!" : 
          "Teljesítve"
        }</button>
    </div>
    )
  )
}

export default Order;
