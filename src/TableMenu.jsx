import React, { useContext, useEffect, useState } from 'react';
import Context from "./Context";
import TableItem from './TableItem';

export default function TableMenu() {
    const { setMenuState, tables } = useContext(Context);
    const [isFinished, setIsFinished] = useState(false);
    
    function calculateTotal() {
        tables.map(table => {
            let subTotal = 0;
            table.orders.map(order => {
                order.orderItems.map(orderItem => subTotal += (orderItem.quantity * orderItem.unitPrice));
            })  
            table.total = subTotal;
        });
        setIsFinished(true);
    }

    //set menustate, calculate total for each table
    useEffect(() => {
        setMenuState("Tables");
        if (tables.length > 0) {
            calculateTotal()
        }
    }, [tables]);

    return (
        <div className='grid lg:grid-cols-4 grid-cols-3 gap-4 overflow-auto p-4'>
            {
                isFinished &&
                tables?.map(table => <TableItem key={table.id} table={table} />)
            }
        </div>
    );
}
