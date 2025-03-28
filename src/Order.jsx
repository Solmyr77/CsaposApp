import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import OrderItem from "./OrderItem";

function Order({ order }) {
  const { locationProducts } = useContext(Context);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);

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
            currentProducts.map(product => <OrderItem key={product.id} item={product}/>)
          }
          <span className="self-end font-bold text-md">Összesen: {currentTotal} Ft</span>
        </div>
        <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12">Teljesítés!</button>
    </div>
  )
}

export default Order;
