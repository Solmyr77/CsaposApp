import React, { useContext, useEffect } from 'react'
import Context from "./Context";
import Order from './Order';

export default function OrdersMenu() {
    const { setMenuState, orders } = useContext(Context);

    useEffect(() => {
        setMenuState("Orders");
    }, []);

    return (
        <div className="w-full flex p-4 flex-col gap-8 ">
            <span className="font-bold text-5xl">Rendelések</span>
            <div className="flex overflow-auto gap-4">
                {
                    orders.length > 0 ?
                    orders?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => <Order order={order} orderMenu/>) :
                    <span>Nicsenek rendelések</span>
                }
            </div>
        </div>
    )
}
