import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import OrderItem from "./OrderItem";

function Order({ order }) {
  const { locationProducts } = useContext(Context);
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    if (locationProducts.length > 0) {
        setCurrentProducts(locationProducts.filter(product => order.orderItems.find(item => item.productId === product.id ? product.quantity = item.quantity : null)));
        console.log(locationProducts.filter(product => order.orderItems.find(item => item.productId === product.id)));
    }
  }, [locationProducts])  
  return (
    <div className="flex flex-col bg-sky-200/75 p-2 rounded-md">
        {
            order.orderStatus == "pending" ?
            <div className="self-end badge badge-warning font-bold">Teljesítendő</div> :
            <div className="self-end badge badge-success font-bold">Teljesítve</div>
        }
        <div className="flex flex-col gap-4">

        {
            currentProducts.length > 0 &&
            currentProducts.map(product => <OrderItem item={product}/>)
        }

        <span className="self-end font-bold text-md">Összesen: 2400 Ft</span>
        </div>
        <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12">Teljesítés!</button>
    </div>
  )
}

export default Order;
