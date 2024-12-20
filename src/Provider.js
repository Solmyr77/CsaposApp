import { React, useState} from "react";
import Context from "./Context";

function Provider( {children} ) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main")

  return (
    <Context.Provider value={[navState, setNavState, menuState, setMenuState]}>
        {children}
    </Context.Provider>
  )
}

export default Provider;
