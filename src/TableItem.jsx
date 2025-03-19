import React from 'react'

class Table {
    constructor() {

    }
}

export default function TableItem({ table }) {
    return (
        <div className={`flex flex-col aspect-square basis-1/5 bg-field ${table.isBooked ? 'brightness-100' : 'brightness-50'} gap-4`}>
            <div className='flex justify-center items-center w-full py-4'>
                <h1 className={`text-center text-xxl ${table.isBooked ? 'text-black' : ''}`}>{table.number}</h1>
            </div>

            <div className=''>

            </div>
        </div>
    )
}
