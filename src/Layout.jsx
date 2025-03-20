import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="w-screen h-screen grid grid-rows-12 max-h-screen flex-col">
            <header className="bg-gray-800 text-white flex items-center justify-center w-full z-10 shadow-md">
                <Header />
            </header>

            <div className="flex flex-grow row-span-11">
                <aside className="w-64 bg-gray-900 text-white h-full">
                    <Sidebar />
                </aside>

                <main className="flex-grow overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
