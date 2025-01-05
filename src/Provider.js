import { React, useState} from "react";
import Context from "./Context";

function Provider( { children } ) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main")
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Context.Provider value={{ navState, setNavState, menuState, setMenuState, isAuthenticated, setIsAuthenticated }}>
        {children}
    </Context.Provider>
  )
}

export default Provider;
