import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="w-screen h-screen flex flex-col">
            {/* Fixed Header at the top */}
            <header className="bg-gray-800 text-white flex items-center justify-center w-full h-16 z-10 shadow-md">
                <Header />
            </header>

            {/* Main content wrapper (Sidebar + Page Content) */}
            <div className="flex flex-grow h-full">
                {/* Sidebar with a fixed width */}
                <aside className="w-64 bg-gray-900 text-white h-full">
                    <Sidebar />
                </aside>

                {/* Main content area expands to fill remaining space */}
                <main className="flex-grow p-4 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
