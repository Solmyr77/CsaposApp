import { React, useState, useEffect, useMemo, useRef} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { Navigate } from "react-router-dom";
import notificationConnection from "./signalRBookingConnection";

function Provider({ children }) {
  //accessToken memo
  const accessToken = useMemo(() => localStorage.getItem("accessToken"), [localStorage.getItem("accessToken")]);
  //basic states
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
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
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({});
  //notifications
  const [newNotification, setNewNotification] = useState(false);
  

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
      const data = await response.data;
      let locations = [];
      const openingHours = await getBusinessHours();
      data.map(location => {
        const foundOpeningHours = openingHours.find(item => item.locationId === location.id);
        foundOpeningHours ? locations.push({...location, businessHours: foundOpeningHours}) : locations.push({...location});
      })
      setLocations(locations);
      return true;
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getLocations();
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

  async function getBusinessHours() {
      try {
        const config = {
          headers: { 
            Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
            "Cache-Content": "no-cache"
          }
        }
        const response = await axios.get(`https://backend.csaposapp.hu/api/business-hours/`, config);
        const data = await response.data;
        if (response.status === 200) return data;
      }
      catch (error) {
        if (error.response?.status === 401) {
          if (await getAccessToken()) {
            await getBusinessHours();
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
          return await getLocationTables(id);
        }
        else {
          await logout();
          window.location.reload();
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

  async function getProductsByLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/products/location/${id}`, config);
      const data = response.data;
      if (response.status === 200) {
        const foundCategories = [];
        data.map(record => !foundCategories.includes(record.category) && foundCategories.push(record.category));
        setCategories(foundCategories);
        setLocationProducts(data);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getProductsByLocation(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  async function getOrdersByTable(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/orders/orders-by-table/${id}`, config);
      if (response.status === 200) {
        setTableOrders(response.data);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getOrdersByTable(id);
        }
        else {
          await logout();
          window.location.reload();
        }
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
      setFriends([]);
      setBookings([]);
      setBookingsContainingUser([]);
    }
  }

  //main useffect to fetch data
  useEffect(() => {
    if (accessToken) {
      const userId = decodeJWT(accessToken).sub;
      if (userId) {
       const fetch = async () => {
          await getProfile(userId, "user");
          getLocations();
          getFriends();
          getFriendRequests();
          getTables();
          getBookingsByUser();
          getBookingsContainingUser();
        }
        fetch()
      }
    }
  }, [accessToken]);

  //function to get userId from JWT token
  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  function registerListeners() {
    console.log("Started listening for event: notifyaddedtotable");
    notificationConnection.on("notifyaddedtotable", (message) => {
      console.log("📨 Received from hub:", message);
      setBookingsContainingUser(state => {
        if (!state.some(booking => booking.id === message.id)) {
          return [...state, message];
        }
        return state;
      });
      setNewNotification(true);
    });

    console.log("Started listening for event: notifyincomingfriendrequest");
    notificationConnection.on("notifyincomingfriendrequest", (message) => {
      console.log("New incoming friend request!");
      setFriendRequests(state => [...state, message]);
      setNewNotification(true);
    });

    console.log("Started listening for event: notifyfriendrequestaccepted");
    notificationConnection.on("notifyfriendrequestaccepted", (message) => {
      console.log("Friend request accepted!", message);
      getProfile(message.userId2).then((newFriend) => {
        setFriends(state => {
          if (!state.some(friend => friend.id === newFriend.id)) {
            return [...state, newFriend];
          }
          return state;
        })
      })
    })
  }

  function registerUser() {
    notificationConnection.invoke("RegisterUser", localStorage.getItem("accessToken").replaceAll(`"`, ""))
    .then(() => console.log("Successfully registered user"));
  }

  function joinNotificationGroup() {
    notificationConnection.invoke("JoinNotificationGroup")
    .then(() => {
      console.log(`✅ Joined group: notifications`);
    })
    .catch(err => console.error("❌ Failed to join group:", err));
  }

  //ref for flagging reconnection
  const isOnReconnectedFired = useRef(false);

  //hub connections
  useEffect(() => {
    if (accessToken !== null && notificationConnection.state === "Disconnected") {
      notificationConnection.start()
      .then(() => {
        console.log("✅ NotificationHub connected successfully.");
        registerListeners();
        registerUser();
        joinNotificationGroup();
      })
      .catch((err) => {
          console.error("❌ Connection failed:", err);
      });
    }

    //reconnect only once to the connection
    if (!isOnReconnectedFired.current) {
      notificationConnection.onreconnected(() => {
        console.log("Reconnected successfully.");
        notificationConnection.off("notifyaddedtotable");
        notificationConnection.off("notifyincomingfriendrequest");
        notificationConnection.off("notifyfriendrequestaccepted");
        console.log("Minden listener off");
        registerListeners();
        registerUser();
        joinNotificationGroup();
      });
      isOnReconnectedFired.current = true;
    }
    
    //cleanup function for listeners
    return () => {
      notificationConnection.off("notifyaddedtotable");
      notificationConnection.off("notifyincomingfriendrequest");
      notificationConnection.off("notifyfriendrequestaccepted");
    };
  }, [accessToken]);
  

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
      tableOrders,
      categories,
      selectedProduct,
      setSelectedProduct,
      currentBooking,
      setCurrentBooking,
      newNotification,
      setNewNotification,
      removeBooking,
      getLocationTables,
      setTableFriends, 
      getProfile,
      getBookingsByUser,
      getBookingsContainingUser,
      getProductsByLocation,
      getOrdersByTable,
      getBusinessHours,
      logout
      }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
