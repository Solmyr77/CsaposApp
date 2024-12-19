import { React, useState} from "react";
import Context from "./Context";

function Provider( {children} ) {
  const [navState, setNavState] = useState("Összes");

  return (
    <Context.Provider value={[navState, setNavState]}>
        {children}
    </Context.Provider>
  )
}

export default Provider;
