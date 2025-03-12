import React, { useContext } from 'react'
import Context from './Context';
import { Link } from 'react-router-dom';

export default function Header() {
    const { menuState } = useContext(Context);

    return (
        <div className='flex flex-col w-full bg-grey px-8'>
            <div className='flex w-full justify-center items-center mt-1'>
                <h1 className='text-xxl py-0 my-0 text-yellow tracking-widest font-bold'>Csapos</h1>
            </div>

            <div className='flex w-full gap-10 justify-between mt-6'>
                <Link to="/tables" className={`btn ${menuState == "Tables" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Asztalok</Link>
                <Link to="/orders" className={`btn ${menuState == "Orders" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Rendelések</Link>
                <Link to="/receipts" className={`btn ${menuState == "Receipts" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Számlák</Link>
                <Link to="/guests" className={`btn ${menuState == "Guests" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Vendégek</Link>
                <Link to="/stock" className={`btn ${menuState == "Stock" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Készlet</Link>
                <Link to="/statistics" className={`btn ${menuState == "Statistics" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Statisztika</Link>
                <Link to="/extra" className={`btn ${menuState == "Extra" ? "bg-yellow text-black" : "bg-dark-yellow text-field"} w-2/12 py-5 rounded-sm text-xl text-center`}>Extra</Link>
            </div>
        </div>
    )
}
