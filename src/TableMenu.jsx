import React, { useContext, useEffect, useState } from 'react';
import Context from "./Context";
import TableItem from './TableItem';

export default function TableMenu() {
    const [tables, setTables] = useState(null);
    const { setMenuState, managerLocation, getLocationTables, getBookingsForLocation } = useContext(Context);

    useEffect(() => {
        setMenuState("Tables");
    }, []);

    useEffect(() => {
        async function runGetLocationTables() {
            try {
                const data = await getLocationTables(managerLocation.id);
                setTables(data);
                console.log("Location tables:", data);
            } catch (error) {
                console.error("Error fetching location tables:", error);
            }
        }

        async function runGetBookings() {
            try {
                await getBookingsForLocation();
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        }

        if (managerLocation !== null) {
            runGetLocationTables();
            runGetBookings();
        }
    }, [managerLocation]);

    return (
        <div className='grid grid-cols-4 gap-4 overflow-auto'>
            {tables?.map((table, index) => <TableItem key={index} table={table} />)}
        </div>
    );
}
