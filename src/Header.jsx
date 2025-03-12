import React from 'react'
import Context from './Context';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className='flex flex-col w-full bg-grey px-8'>
            <div className='flex w-full justify-center items-center mt-1'>
                <h1 className='text-xxl py-0 my-0 text-yellow tracking-widest font-bold'>Csapos</h1>
            </div>

            <div className='flex w-full gap-10 justify-between mt-6'>
                <Link to="/tables" className='btn bg-yellow w-2/12 py-5 text-black rounded-sm text-xl text-center'>Asztalok</Link>
                <Link to="/orders" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Rendelések</Link>
                <Link to="/receipts" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Számlák</Link>
                <Link to="/guests" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Vendégek</Link>
                <Link to="/stock" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Készlet</Link>
                <Link to="/statistics" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Statisztikák</Link>
                <Link to="/extra" className='btn bg-dark-yellow w-2/12 py-5 text-field rounded-sm text-xl text-center'>Extra</Link>
            </div>
        </div>
    )
}
