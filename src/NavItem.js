import React, { useContext } from "react";
import Context from "./Context";

function NavItem({title}) {
  const { navState, setNavState } = useContext(Context); 

  return (
    <div className="bg-dark-grey w-[30%] h-7 rounded-md text-center content-center drop-shadow-[0_4px_4px_rgba(0,0,0,.5)]" onClick={()=> setNavState(title)}>
        <p className={`text-xs ${navState === title ? "text-blue" : "text-white"}`}>{title}</p>
    </div>
  );
}

export default NavItem;