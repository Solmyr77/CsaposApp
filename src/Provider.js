import { React, useState, useEffect} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Provider({ children }) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || "");
  const [userId, setUserId] = useState("");
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [notificationFilter, setNotificationFilter] = useState("Összes");
  const [previousRoutes, setPreviousRoutes] = useState(["/"]);

  async function getProfile(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/Users/profile/${id}`, config);
      const data = response.data;
      setUser({
        id: data.id,
        displayName: data.displayName,
        imageUrl: `https://assets.csaposapp.hu/assets/images/${data.imageUrl}?t=${new Date().getTime()}`
      });
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        displayName: data.displayName,
        imageUrl: `https://assets.csaposapp.hu/assets/images/${data.imageUrl}?t=${new Date().getTime()}`
      }));
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
    }
  }

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
        if (getAccessToken()) {
          getLocations();
        }
        await logout();
        window.location.reload();
        return false;
      } 
      else {
        console.error("Error fetching locations:", error.message);
        return false;
      }
    }
  }

  const logout = async () => {
    const response = await axios.post("https://backend.csaposapp.hu/api/auth/logout", {refreshToken : localStorage.getItem("refreshToken")});
    if (response.status === 204) {
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUserId("");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setUserId(decodeJWT(localStorage.getItem("accessToken")).sub);
      if (userId) {
        getProfile(userId);
        getLocations();
      }
    }
  }, [localStorage.getItem("accessToken"), userId]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  return (
    <Context.Provider value={{ navState, setNavState, menuState, setMenuState, isAuthenticated, setIsAuthenticated, user, setUser, locations, setLocations, notificationFilter, setNotificationFilter, previousRoutes, setPreviousRoutes, getProfile, setUserId, logout }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
