import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="bg-grey min-h-screen">
        <Header notification={true}/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  );
}

export default Layout;