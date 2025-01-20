import React, { useContext, useEffect } from "react";
import Context from "./Context";

function NavItem({ title, isNotificationPage }) {
  const { navState, setNavState, notificationFilter, setNotificationFilter } = useContext(Context); 
  
  useEffect(() => {
    setNotificationFilter("Összes");
  }, []);
  
  if (isNotificationPage) {
    return(
      <div className="bg-dark-grey w-[30%] h-7 rounded-md text-center content-center drop-shadow-[0_4px_4px_rgba(0,0,0,.5)] select-none" onClick={()=> setNotificationFilter(title)}>
        <p className={`text-xs ${notificationFilter === title ? "text-blue" : "text-white"}`}>{title}</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-grey w-[30%] h-7 rounded-md text-center content-center drop-shadow-[0_4px_4px_rgba(0,0,0,.5)] select-none" onClick={()=> setNavState(title)}>
      <p className={`text-xs ${navState === title ? "text-blue" : "text-white"}`}>{title}</p>
    </div>
  );
}

export default NavItem;