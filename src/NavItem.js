import React from "react";

function NavItem({isActive, title}) {
  return (
        <div className="bg-dark-grey w-[30%] h-7 rounded-md text-center content-center drop-shadow-[0_4px_4px_rgba(0,0,0,.5)]">
            <p className={`text-xs ${isActive ? "text-blue" : "text-white"}`}>{title}</p>
        </div>
  );
}

export default NavItem;