import React, { useContext } from 'react'
import Context from './Context';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const { menuState } = useContext(Context);

    return (
        <div className='flex flex-col w-full h-full'>
            <Link to="/tables" className={`btn ${menuState == "Tables" ? "brightness-100 text-black" : "brightness-50 text-field"} bg-red-500 border-0 h-1/5 flex justify-center items-center rounded-none text-xl text-center`}>Asztalok</Link>
            <Link to="/orders" className={`btn ${menuState == "Orders" ? "brightness-100 text-black" : "brightness-50 text-field"} bg-blue border-0 h-1/5 flex justify-center items-center rounded-none text-xl text-center`}>Rendelések</Link>
            <Link to="/products" className={`btn ${menuState == "Products" ? "brightness-100 text-black" : "brightness-50 text-field"} bg-green-500 border-0 h-1/5 flex justify-center items-center rounded-none text-xl text-center`}>Termékek</Link>
            <Link to="/events" className={`btn ${menuState == "Events" ? "brightness-100 text-black" : "brightness-50 text-field"} bg-pink-500 border-0 h-1/5 flex justify-center items-center rounded-none text-xl text-center`}>Események</Link>
            <Link to="/extra" className={`btn ${menuState == "Extra" ? "brightness-100 text-black" : "brightness-50 text-field"} bg-amber-500 border-0 h-1/5 flex justify-center items-center rounded-none text-xl text-center`}>Extra</Link>
        </div>
    )
}
