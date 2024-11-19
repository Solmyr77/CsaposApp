import React from "react";
import NavItem from "./NavItem";
import TitleDivider from "./TitleDivider";

function Navbar() {
  return (
    <div className="w-full mb-8">
        <h1 className="pt-4 mb-2 text-xl">Felfedezés</h1>
        <div className="flex justify-between">
            <NavItem isActive={true} title={"Összes"}></NavItem>
            <NavItem title={"Nyitva"}></NavItem>
            <NavItem title={"Kedvencek"}></NavItem>
        </div>
    </div>
  )
}

export default Navbar;
