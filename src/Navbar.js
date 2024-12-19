import React, { useContext } from "react";
import NavItem from "./NavItem";

function Navbar() {
  return (
    <div className="w-full mb-8">
        <h1 className="pt-4 mb-2 text-xl">Felfedezés</h1>
        <div className="flex justify-between">
            <NavItem title={"Összes"}></NavItem>
            <NavItem title={"Nyitva"}></NavItem>
            <NavItem title={"Kedvencek"}></NavItem>
        </div>
    </div>
  )
}

export default Navbar;
