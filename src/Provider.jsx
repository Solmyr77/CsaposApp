import { React, useState, useEffect} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { Navigate } from "react-router-dom";

function Provider({ children }) {
  //basic
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Tables");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(null);
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [notificationFilter, setNotificationFilter] = useState("Összes");
  const [previousRoutes, setPreviousRoutes] = useState(["/"]);
  //friends
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  //table reservation
  const [tableFriends, setTableFriends] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});
  const [bookings, setBookings] = useState([]);
  const [bookingsContainingUser, setBookingsContainingUser] = useState([]);
  //order
  const [order, setOrder] = useState([]);
  const [locationProducts, setLocationProducts] = useState([]);

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
        const updatedFriends = [];
        for (let friend of data.friends) {
          const friendProfile = await getProfile(friend);
          data.friends.every(record => record.id !== friend) && updatedFriends.push(friendProfile);
        }
        setFriends(updatedFriends);
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
      console.log(error.response?.status);
      console.log(error.message);
    }
  }

  async function getLocationTables(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/Tables/location/${id}`, config);
      const data = await response.data;
      if (response.status === 200 && data.length > 0) {
        return data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          getLocationTables(id);
        }
        else {
          await logout();
          <Navigate to={"/login"}/>
        }
    }
    }
  }

  async function getBookingsByUser() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/bookings/bookings-by-user`, config);
      const data = await response.data;
      if (response.status === 200 && data.length > 0) {
        setBookings(data);
      }
    }
    catch (error) {
      console.log(error.response?.status);
      console.log(error.message);
    }
  }

  async function getBookingsContainingUser() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/bookings/bookings-containing-user`, config);
      const data = await response.data;
      if (response.status === 200 && data.length > 0) {
        setBookingsContainingUser(data);
      }
    }
    catch (error) {
      console.log(error.response?.status);
      console.log(error.message);
    }
  }

  async function removeBooking(id) {
    try {
        const config = {
            headers: {
                Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
                "Content-Type" : "application/json"
            },
            data: {
                bookingId: id
            }
        }
        const response = await axios.delete(`https://backend.csaposapp.hu/api/bookings/remove-booking`, config);
        if (response.status === 204) setBookings(state => state.filter(record => record.id !== id));
        return true;
    } 
    catch (error) {
        console.log(error.message);
        if (error.response?.status === 401) {
            if (await getAccessToken()) {
                await removeBooking(id);
            }
            else {
              await logout();
              <Navigate to={"/login"}/>
            }
        }
    }
}

  async function getTableGuests(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/table-guests/${id}?bookingId=${id}`, config);
      const data = response.data;
      if (response.status === 200) {
        return data;
      }
    }
    catch (error) {
      console.log(error.response?.status);
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
      setBookings([]);
      setBookingsContainingUser([]);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setUserId(decodeJWT(localStorage.getItem("accessToken")).sub);
      if (userId) {
       const fetch = async () => {
          await getProfile(userId, "user");
          await getLocations();
          getFriends();
          getFriendRequests();
          getTables();
          getBookingsByUser();
          getBookingsContainingUser();
        }
        fetch()
      }
    }
  }, [localStorage.getItem("accessToken"), userId]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  return (
    <Context.Provider value={{ 
      navState, 
      setNavState, 
      menuState, 
      setMenuState, 
      isAuthenticated, 
      setIsAuthenticated, 
      user,
      setUser, 
      locations, 
      setLocations, 
      notificationFilter, 
      setNotificationFilter, 
      previousRoutes, 
      setPreviousRoutes, 
      friends, 
      setFriends, 
      friendRequests, 
      setFriendRequests, 
      tables, 
      tableFriends, 
      selectedTable,
      setSelectedTable,
      order, 
      setOrder,
      bookings,
      setBookings,
      bookingsContainingUser,
      setBookingsContainingUser,
      locationProducts,
      setLocationProducts,
      removeBooking,
      getLocationTables,
      setTableFriends, 
      getProfile,
      getBookingsByUser,
      getBookingsContainingUser,
      setUserId,
      logout
      }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
