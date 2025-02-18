import { React, useState, useEffect} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import IsEqual from "react-fast-compare";

function Provider({ children }) {
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [notificationFilter, setNotificationFilter] = useState("Összes");
  const [previousRoutes, setPreviousRoutes] = useState(["/"]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [tableFriends, setTableFriends] = useState([]);
  const [tables, setTables] = useState([]);

  async function getProfile(id, profile) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/Users/profile/${id}`, config);
      const data = response.data;
      if (profile === "user") {
        setUser({
          id: data.id,
          displayName: data.displayName,
          imageUrl: `https://assets.csaposapp.hu/assets/images/${data.imageUrl}?t=${new Date().getTime()}`
        });
      }
      else {
        return data;
      }
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
    }
  }

  async function getFriends() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/friends/list`, config);
      const data = response.data;
      if (data.friends.length > 0) {
        data.friends.map(async (_, i) => {
          const friendProfile = await getProfile(data.friends[i]);
          if (!friends.some(friend => IsEqual(friend, friendProfile))) setFriends(state => [...state, friendProfile]);
        })
      }
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
    }
  }

  async function getFriendRequests() {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get("https://backend.csaposapp.hu/api/friends/requests", config);
      const data = response.data;
      setFriendRequests(data.pendingRequests);
    }
    catch (error) {
      console.log(error);
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
        if (await getAccessToken()) {
          getLocations();
        }
        else {
          await logout();
          window.location.reload();
          return false;
        }
      } 
      else {
        return false;
      }
    }
  }

  async function getTables() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/tables`, config);
      const data = response.data;
      if (response.status === 200 && data.length > 0) setTables(data);
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
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
      setFriends([]);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setUserId(decodeJWT(localStorage.getItem("accessToken")).sub);
      if (userId) {
        getProfile(userId, "user");
        getFriends();
        getFriendRequests();
        getLocations();
        getTables();
      }
    }
  }, [localStorage.getItem("accessToken"), userId]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  return (
    <Context.Provider value={{ navState, setNavState, menuState, setMenuState, isAuthenticated, setIsAuthenticated, user, setUser, locations, setLocations, notificationFilter, setNotificationFilter, previousRoutes, setPreviousRoutes, friends, setFriends, friendRequests, setFriendRequests, tables, tableFriends, setTableFriends, getProfile, setUserId, logout }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
