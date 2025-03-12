import React, { useContext } from 'react'
import Context from './Context';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const { menuState } = useContext(Context);

    return (
        <div className='flex flex-col w-full h-full bg-grey'>
            <Link to="/tables" className={`btn ${menuState == "Tables" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-red-600 border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Asztalok</Link>
            <Link to="/orders" className={`btn ${menuState == "Orders" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-blue bg- border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Rendelések</Link>
            <Link to="/receipts" className={`btn ${menuState == "Receipts" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-green-600 bg- border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Számlák</Link>
            <Link to="/stock" className={`btn ${menuState == "Stock" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-yellow bg- border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Készlet</Link>
            <Link to="/statistics" className={`btn ${menuState == "Statistics" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-pink-500 border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Statisztika</Link>
            <Link to="/extra" className={`btn ${menuState == "Extra" ? "brightness-100 text-black" : "brightness-75 text-field"} bg-amber-600 border-0 h-1/6 flex justify-center items-center rounded-none text-xl text-center`}>Extra</Link>
        </div>
    )
}
