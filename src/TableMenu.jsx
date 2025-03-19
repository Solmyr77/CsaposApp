import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Context from "./Context";
import TableItem from './TableItem';

export default function TableMenu() {
    const [tables, setTables] = useState(null);
    const { setMenuState, managerLocation, getLocationTables } = useContext(Context);

    useEffect(() => {
        setMenuState("Tables");
    }, []);

    useEffect(() => {
        async function runGetLocationTables() {
            try {
                const data = await getLocationTables(managerLocation);
                setTables(data);
                console.log("Location Tables:", data);
            } catch (error) {
                console.error("Error fetching location tables:", error);
            }
        }

        if (managerLocation !== null) {
            runGetLocationTables();
        }
    }, [managerLocation]);

    return (
        <div className='bg-grey min-h-screen w-full flex'>
            {/* Sidebar - Fixed Height */}
            <div className='basis-1/12 h-screen'>
                <Sidebar />
            </div>

            {/* Scrollable Content */}
            <div className='basis-11/12 h-screen overflow-auto flex flex-wrap gap-4 p-4'>
                {
                    tables?.map((table, index) => <TableItem key={index} table={table} />)
                }
                {
                    tables?.map((table, index) => <TableItem key={index} table={table} />)
                }
                {
                    tables?.map((table, index) => <TableItem key={index} table={table} />)
                }
                {
                    tables?.map((table, index) => <TableItem key={index} table={table} />)
                }
            </div>
        </div>
    );
}

