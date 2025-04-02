import { React, useState, useEffect, useRef, useCallback} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { Navigate } from "react-router-dom";
import bookingConnection from "./signalRBookingCoonection";

function Provider({ children }) {
  //basic states
  const [menuState, setMenuState] = useState("Tables");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [managerLocation, setManagerLocation] = useState(null);
  //table states 
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  //order states
  const [locationProducts, setLocationProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  //events
  const [events, setEvents] = useState([]);
  
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
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getProfile(id, profile ? profile : null);
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

  async function getManagerLocation() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/Manager/manager-location`, config);
      const data = response.data;
      getLocation(data.locationId);
      getLocationTables(data.locationId);
      getBookingsForLocation(data.locationId);
      getProductsByLocation(data.locationId);
      getOrdersByLocation(data.locationId);
      getEventsByLocation(data.locationId);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getManagerLocation();
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

  async function getLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/locations/${id}`, config);
      const data = response.data;

      setManagerLocation(data);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getLocation(id);
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
        const ordersByTable = await Promise.all(data.map(table => getOrdersByTable(table.id)));
        data.map((table, i) => table.orders = ordersByTable[i]);
        setTables(data.sort((a, b) => a.number - b.number));
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getLocationTables(id);
        }
        else {
          await logout();
          <Navigate to={"/login"}/>
        }
    }
    }
  }

  async function getBookingsForLocation(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/bookings/bookings-for-location?locationId=${id}`, config);
      const data = await response.data;
      if (response.status === 200 && data.length > 0) {
        for (const booking of data) {
          const bookerProfile = await getProfile(booking.bookerId);
          booking.tableGuests[booking.tableGuests.length] = bookerProfile;
          booking.tableGuests.map((guest, i) => guest.number = i + 1);
        }
        setBookings(data);
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
        //setOrders(response.data);
        return response.data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          return await getOrdersByTable(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  async function getOrdersByLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/orders/location/${id}`, config);
      if (response.status === 200) {
        setOrders(response.data);
        return response.data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          return await getOrdersByLocation(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  async function getEventsByLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/events/location/${id}`, config);
      if (response.status === 200) {
        const eventAttendances = await getEventAttendances(id);
        if (eventAttendances?.length > 0) {
          response.data.map(event => {
            let counter = 0;
            const filteredArray = eventAttendances.filter(eventattendance => eventattendance.event.id === event.id);
            if (filteredArray) {
              filteredArray.map(eventattendance => eventattendance.status === "accepted" ? counter++ : eventattendance);
            }
            event.attendees = counter;
          });
        }
        setEvents(response.data);
        return response.data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          return await getEventsByLocation(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  async function getEventAttendances(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/event-attendances/location/${id}`, config);
      if (response.status === 200) {
        console.log(response.data)
        //setEvents(response.data);
        return response.data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          return await getEventAttendances(id);
        }
        else {
          await logout();
          window.location.reload();
        }
      } 
    }
  }

  //logout function
  const logout = async () => {
    const response = await axios.post("https://backend.csaposapp.hu/api/auth/logout", {refreshToken : localStorage.getItem("refreshToken")});
    if (response.status === 204) {
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUserId("");
      setBookings([]);
    }
  }

  //main useeffect to fetch data
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setUserId(decodeJWT(localStorage.getItem("accessToken")).sub);
      if (userId) {
       const fetch = async () => {
          await getProfile(userId, "user");
          await getManagerLocation();
        }
        fetch();
      }
    }
  }, [localStorage.getItem("accessToken"), userId]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  //define listeners
  const handleNotifyBookingDeleted = useCallback((message) => {
    setBookings(state => [...state.filter(booking => booking.id !== message.bookingId)]);
    console.log("Booking removed:", message);
    bookingConnection.invoke("LeaveBookingGroup", message.bookingId);
  }, []);

  const handleNotifyOrderCreated = useCallback((message) => {
    console.log("New order created", message);
    setTables(state => {
      const foundTable = state.find(table => table.id === message.order.tableId);
      if (!foundTable?.orders.some(order => order.id === message.order.id)) {
        foundTable.orders.push({...message.order, sentAt: message.sentAt});
        return [...state];
      }
      return state;
    })
  }, []);

  //register user in signalr hub
  function registerUser() {
    bookingConnection.invoke("RegisterUser", localStorage.getItem("accessToken").replaceAll(`"`, ""))
    .then(() => console.log("Successfully registered user"));
  }

  //join booking group in signalr
  function joinBookingGroup(bookingId) {
    bookingConnection.invoke("JoinBookingGroup", bookingId)
    .then(() => {
      console.log(`✅ Joined group: bookings`, bookingId);
    })
    .catch(err => console.error("❌ Failed to join group:", err));
  }

  //clear then re-apply listeners
  function registerBookingListeners() {
    bookingConnection.off("notifybookingdeleted", handleNotifyBookingDeleted);
    bookingConnection.off("notifyordercreated", handleNotifyOrderCreated);
    console.log("CLEARED BOOKING DELETED LISTENER");

    bookingConnection.on("notifybookingdeleted", handleNotifyBookingDeleted);
    bookingConnection.on("notifyordercreated", handleNotifyOrderCreated);
    console.log("ADDED BOOKING DELETED LISTENER");
  }

  //function to make sure that connection state is connected before trying to invoke any other function
  const ensureConnected = async (connection) => {
    if (connection.state === "Disconnected") {
      try {
        await connection.start();
        console.log("✅ Connection started successfully.");
      } catch (err) {
        console.error("❌ Failed to start connection:", err);
        return false;
      }
    }
    // Wait until the state is "Connected"
    const maxAttempts = 10;
    let attempts = 0;
    while (connection.state !== "Connected" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
      attempts++;
    }
    if (connection.state === "Connected") {
      return true;
    } else {
      console.error("❌ Connection failed to reach 'Connected' state:", connection.state);
      return false;
    }
  };

  //ref for flagging reconnection
  const isBookingOnReconnectedFired = useRef(false);

  //BookingHub connection
  useEffect(() => {
    registerBookingListeners();
    if (localStorage.getItem("accessToken") !== null && bookingConnection.state === "Disconnected" && bookings.length > 0) {
      const startConnection = async () => {
        if (await ensureConnected(bookingConnection)) {
          registerUser();
          bookings.map((booking) => booking?.id && joinBookingGroup(booking.id));
        }
      }
      startConnection();
    }
    //reconnect only once to the connection
    if ((!isBookingOnReconnectedFired.current) && bookings.length > 0) {
      bookingConnection.onreconnected(async () => {
        console.log("Reconnected successfully.");
        if (await ensureConnected(bookingConnection)) {
          setTimeout(() => {
            registerUser();
            bookings.map((booking) => joinBookingGroup(booking.id));
          }, 500);
        }
      });
      isBookingOnReconnectedFired.current = true;
    }

    //cleanup function for listeners
    return () => {
      bookingConnection.off("notifybookingdeleted", handleNotifyBookingDeleted);
      bookingConnection.off("notifyordercreated", handleNotifyOrderCreated);
    };
  }, [bookings]);


  return (
    <Context.Provider value={{ 
      menuState, 
      setMenuState, 
      isAuthenticated, 
      setIsAuthenticated, 
      user,
      setUser,
      userRole,
      setUserRole,
      managerLocation,
      setManagerLocation,
      locations, 
      setLocations, 
      tables, 
      bookings,
      setBookings,
      locationProducts,
      setLocationProducts,
      events,
      setEvents,
      orders,
      categories,
      selectedProduct,
      setSelectedProduct,
      removeBooking,
      getLocationTables,
      getProfile,
      getProductsByLocation,
      getOrdersByTable,
      setUserId,
      getBusinessHours,
      logout,
      decodeJWT,
      getBookingsForLocation
      }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;