import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col max-h-screen max-w-screen text-gray-900">
            <header className="bg-gray-800 text-white flex items-center justify-center h-24 w-full z-10 shadow-md">
                <Header />
            </header>

            <div className="flex grow h-screen">
                <aside className="w-64 min-w-64 bg-gray-800 text-white h-full">
                    <Sidebar />
                </aside>

                <main className="grow overflow-auto bg-white">
                    {children}
                </main>
            </div>
        </div>
    );
}
