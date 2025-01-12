import { React, useState} from "react";
import Context from "./Context";
import img1 from "./img/avatar.webp";

function Provider( { children } ) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main")
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {name: "Lajos", image: img1});

  return (
    <Context.Provider value={{ navState, setNavState, menuState, setMenuState, isAuthenticated, setIsAuthenticated, user, setUser }}>
        {children}
    </Context.Provider>
  )
}

export default Provider;
