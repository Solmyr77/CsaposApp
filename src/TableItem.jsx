import React from 'react'

class Table {
    constructor() {

    }
}

export default function TableItem({ table }) {
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
        <div className={`flex aspect-square basis-1/5 bg-field ${table.isBooked ? 'brightness-100' : 'brightness-50'} gap-4`}>
            <div className='flex justify-center items-center w-full'>
                <h1 className='text-center'>Asztal {table.number}</h1>
            </div>

            <div className=''>

            </div>
        </div>
    )
}
