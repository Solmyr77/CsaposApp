import { React, useState, useEffect} from "react";
import Context from "./Context";
import img1 from "./img/avatar.webp";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Provider({ children }) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {name: "Lajos", image: img1});
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [notificationFilter, setNotificationFilter] = useState("Összes");
  const [previousRoutes, setPreviousRoutes] = useState(["/"]);

  async function getLocations() {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get("https://backend.csaposapp.hu/api/locations", config);
      const data = response.data;
      setLocations(data);
      return true;
    }
    catch (error) {
      if (error.response?.status === 401) {
        return false;
      } 
      else {
        console.error("Error fetching locations:", error.message);
        return false;
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      let isSucceeded = await getLocations();
      while (localStorage.getItem("accessToken") && isSucceeded === false) {
        await getAccessToken();
        isSucceeded = await getLocations();
      }
    }
    fetchData();
  }, [isAuthenticated]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  return (
    <Context.Provider value={{ navState, setNavState, menuState, setMenuState, isAuthenticated, setIsAuthenticated, user, setUser, locations, setLocations, notificationFilter, setNotificationFilter, previousRoutes, setPreviousRoutes }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
