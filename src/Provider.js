import { React, useState, useEffect, useRef, useCallback, useMemo} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { Navigate } from "react-router-dom";
import notificationConnection from "./signalRNotificationConnection";
import bookingConnection from "./signalRBookingConnection"

function Provider({ children }) {
  //basic states
  const [navState, setNavState] = useState("Összes");
  const [menuState, setMenuState] = useState("Main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [locations, setLocations] = useState( localStorage.getItem("locations") || []);
  const [events, setEvents] = useState([]);
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
  const [allBookings, setAllBookings] = useState([]);
  //order
  const [order, setOrder] = useState([]);
  const [locationProducts, setLocationProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({});
  //notifications
  const [newNotification, setNewNotification] = useState(false);
  
  const tempUser = useRef({});


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
          imageUrl: `https://assets.csaposapp.hu/assets/images/${data.imageUrl}`
        });
        tempUser.current = {
          id: data.id,
          displayName: data.displayName,
          imageUrl: `https://assets.csaposapp.hu/assets/images/${data.imageUrl}`
        }
      }
      else {
        return data;
      }
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
      if (error.response?.status === 401) {
        if (await getAccessToken()) return await getProfile(id);
        else {
          await logout();
          window.location.reload();
        }
      }
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
      console.log(data)
      setFriends(data.friends);
    }
    catch (error) {
      console.log(error.data?.status);
      console.log(error.message);
      if (error.response?.status === 401) {
        if (await getAccessToken()) await getFriends();
        else {
          await logout();
          window.location.reload();
        }
      }
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
      data.pendingRequests.length > 0 && setNewNotification(true); 
    }
    catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        if (await getAccessToken()) await getFriendRequests();
        else {
          await logout();
          window.location.reload();
        }
      }
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
      const events = await getEvents();
      data.map(location => {
        const foundOpeningHours = openingHours.find(item => item.locationId === location.id);
        const foundEvents = events.filter(event => event.locationId === location.id);
        if (foundEvents.length > 0 && foundOpeningHours) locations.push({...location, businessHours: foundOpeningHours, events: foundEvents});
        else if (foundEvents.length > 0 && !foundOpeningHours) locations.push({...location, events: foundEvents});
        else if (foundOpeningHours) locations.push({...location, businessHours: foundOpeningHours});
        else locations.push({...location});
      })
      setLocations(locations);
      setEvents(events);
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
      if (error.response?.status === 401) {
        if (await getAccessToken()) await getTables();
        else {
          await logout();
          window.location.reload();
        }
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
      if (response.status === 200) {
        setBookings(data);
      }
      return data;
    }
    catch (error) {
      console.log(error.response?.status);
      console.log(error.message);
      if (error.response?.status === 401) {
        if (await getAccessToken()) return await getBookingsByUser();
        else {
          await logout();
          window.location.reload();
        }
      }
      return [];
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
      if (response.status === 200) {
        setBookingsContainingUser(data);
        data.map(booking => {
          if (booking.tableGuests.find(guest => guest.id === tempUser.current.id)?.status === "pending") {
            setNewNotification(true);
          }
        })
      }
      return data;
    }
    catch (error) {
      console.log(error.response?.status);
      console.log(error.message);
      if (error.response?.status === 401) {
        if (await getAccessToken()) return await getBookingsContainingUser();
        else {
          await logout();
          window.location.reload();
        }
      }
      return [];
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
        if (response.status === 204) {
          setBookings(state => state.filter(record => record.id !== id));
          bookingConnection.invoke("LeaveBookingGroup", id)
          .then(() => console.log("Left booking group:", id))
          .catch((err) => console.log("Failed to leave booking group:", err));
        }
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

  async function getEvents() {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/events/`, config);
      if (response.status === 200) {
        return response.data;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getEvents();
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
      notificationConnection.stop();
      bookingConnection.stop();
      notificationConnection.off("notifyaddedtotable", handleNotifyAddedToTable);
      notificationConnection.off("notifyincomingfriendrequest", handleNotifyIncomingFriendRequest);
      notificationConnection.off("notifyfriendrequestaccepted", handleNotifyFriendRequestAccepted);
      bookingConnection.off("notifybookingdeleted", handleNotifyBookingDeleted);
      bookingConnection.off("notifyuseracceptedinvite", handleNotifyUserAcceptedInvite);
      bookingConnection.off("notifyuserrejectedinvite", handleNotifyUserRejectedInvite);
      console.log("Logged out");
      setIsAuthenticated(false);
      localStorage.clear();
      setFriends([]);
      setBookings([]);
      setBookingsContainingUser([]);
      setAllBookings([]);
    }
  }

  //main useffect to fetch data
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const userId = decodeJWT(localStorage.getItem("accessToken")).sub;
      if (userId) {
       const fetch = async () => {
          await getProfile(userId, "user");
          getLocations();
          getFriends();
          getFriendRequests();
          getTables();
          //getEvents();
          Promise.all([await getBookingsByUser(), await getBookingsContainingUser()]).then((res) => {
            console.log(res.flat());
            setAllBookings(res.flat());
          })
        }
        fetch()
      }
    }
  }, [localStorage.getItem("accessToken")]);

  //function to get userId from JWT token
  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  //define listeners
  const handleNotifyAddedToTable = useCallback((message) => {
    console.log("📨 Received from hub:", message);
    setBookingsContainingUser(state => {
      if (!state.some(booking => booking.id === message.payload.id)) {
        return [...state, {...message.payload, sentAt: message.sentAt}];
      }
      return state;
    });
    setAllBookings(state => {
      if (!state.some(booking => booking.id === message.payload.id)) return [...state, {...message.payload}]
      return state;
    });
    joinBookingGroup(message.payload.id);
    setNewNotification(true);
  }, []);

  const handleNotifyIncomingFriendRequest = useCallback((message) => {
    console.log("New incoming friend request!", message);
      setFriendRequests(state => [...state, {...message.payload, sentAt: message.sentAt}]);
      setNewNotification(true);
  }, []);

  const handleNotifyFriendshipRemoved = useCallback((message) => {
    console.log("Removed friendship!", message);
    setFriends(state => state.filter(friend => friend.id !== message.payload));
  }, []);

  const handleNotifyFriendRequestAccepted = useCallback((message) => {
    console.log("Friend request accepted!", message);
    getProfile(message.payload.userId2).then((newFriend) => {
    setFriends(state => {
      if (!state.some(friend => friend.id === newFriend.id)) {
        return [...state, newFriend];
      }
      return state;
    });
    });
  }, []);

  const handleNotifyBookingDeleted = useCallback((message) => {
    setBookingsContainingUser(state => state.filter(booking => booking.id !== message.bookingId));
    console.log("Booking removed:", message);
    bookingConnection.invoke("LeaveBookingGroup", message.bookingId);
  }, []);

  const handleNotifyUserAcceptedInvite = useCallback((message) => {
    console.log("User accepted invite:", message);
    setBookings(state => {
      const foundBooking = state.find(booking => booking.id === message.bookingId);
      if (foundBooking) {
        foundBooking.tableGuests.find(guest => guest.id === message.userId).status = "accepted";
        console.log(foundBooking);
      }
      return [...state];
    });
    setBookingsContainingUser(state => {
      const foundBooking = state.find(booking => booking.id === message.bookingId);
      if (foundBooking) {
        foundBooking.tableGuests.find(guest => guest.id === message.userId).status = "accepted";
        console.log(foundBooking);
      }
      return [...state];
    });
  }, []);

  const handleNotifyUserRejectedInvite = useCallback((message) => {
    console.log("User rejected invite:", message);
    setBookings(state => {
      const foundBooking = state.find(booking => booking.id === message.bookingId);
      if (foundBooking) {
        foundBooking.tableGuests.find(guest => guest.id === message.userId).status = "rejected";
        console.log(foundBooking);
      }
      return [...state];
    });
    setBookingsContainingUser(state => {
      const foundBooking = state.find(booking => booking.id === message.bookingId);
      if (foundBooking) {
        foundBooking.tableGuests.find(guest => guest.id === message.userId).status = "rejected";
        console.log(foundBooking);
      }
      return [...state];
    });
  }, []);

  const handleNotifyOrderCreated = useCallback((message) => {
    console.log("New order created", message);
    setTableOrders(state => {
      if (!state.some(tableOrder => tableOrder.id === message.order.id)) return [...state, message.order];
      return state;
    })
  }, []);

  function registerNotificationListeners() {
    // Remove existing listeners to avoid duplicates
    notificationConnection.off("notifyaddedtotable", handleNotifyAddedToTable);
    notificationConnection.off("notifyincomingfriendrequest", handleNotifyIncomingFriendRequest);
    notificationConnection.off("notifyfriendrequestaccepted", handleNotifyFriendRequestAccepted);
    notificationConnection.off("notifyremovedfriendship", handleNotifyFriendshipRemoved);
    console.log("Old listeners have been cleaned up.");
  
    // Register new listeners
    notificationConnection.on("notifyaddedtotable", handleNotifyAddedToTable);
    notificationConnection.on("notifyincomingfriendrequest", handleNotifyIncomingFriendRequest);
    notificationConnection.on("notifyfriendrequestaccepted", handleNotifyFriendRequestAccepted);
    notificationConnection.on("notifyremovedfriendship", handleNotifyFriendshipRemoved);
    console.log("New listeners have been set.");
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
  const isNotificationOnReconnectedFired = useRef(false);
  
  //NotificationHub connection
  useEffect(() => {
    registerNotificationListeners();
    console.log(notificationConnection.state);
    if (localStorage.getItem("accessToken") !== null && notificationConnection.state === "Disconnected") {
      const startConnection = async () => {
        if (await ensureConnected(notificationConnection)) {
          registerUser();
          joinNotificationGroup();
        }
      }
      startConnection();
    }
    //reconnect only once to the connection
    if (!isNotificationOnReconnectedFired.current) {
      notificationConnection.onreconnected(async () => {
        console.log("Reconnected successfully.");
        if (await ensureConnected(notificationConnection)) {
          setTimeout(() => {
            registerUser();
            joinNotificationGroup();
          }, 500);
        }
      });
      isNotificationOnReconnectedFired.current = true;
    }

    //cleanup function for listeners
    return () => {
      notificationConnection.off("notifyaddedtotable", handleNotifyAddedToTable);
      notificationConnection.off("notifyincomingfriendrequest", handleNotifyIncomingFriendRequest);
      notificationConnection.off("notifyfriendrequestaccepted", handleNotifyFriendRequestAccepted);
      notificationConnection.off("notifyremovedfriendship", handleNotifyFriendshipRemoved);
    };
  }, [localStorage.getItem("accessToken")]);


  function joinBookingGroup(bookingId) {
    bookingConnection.invoke("JoinBookingGroup", bookingId)
    .then(() => {
      console.log(`✅ Joined group: bookings`, bookingId);
    })
    .catch(err => console.error("❌ Failed to join group:", err));
  }

  function registerBookingListeners() {
    bookingConnection.off("notifybookingdeleted", handleNotifyBookingDeleted);
    bookingConnection.off("notifyuseracceptedinvite", handleNotifyUserAcceptedInvite);
    bookingConnection.off("notifyuserrejectedinvite", handleNotifyUserRejectedInvite);
    bookingConnection.off("notifyordercreated", handleNotifyOrderCreated);
    console.log("CLEARED BOOKING DELETED LISTENER");

    bookingConnection.on("notifybookingdeleted", handleNotifyBookingDeleted);
    bookingConnection.on("notifyuseracceptedinvite", handleNotifyUserAcceptedInvite);
    bookingConnection.on("notifyuserrejectedinvite", handleNotifyUserRejectedInvite);
    bookingConnection.on("notifyordercreated", handleNotifyOrderCreated);
    console.log("ADDED BOOKING DELETED LISTENER");
  }

  //ref for flagging reconnection
  const isBookingOnReconnectedFired = useRef(false);

  //BookingHub connection
  useEffect(() => {
    registerBookingListeners();
    if (localStorage.getItem("accessToken") !== null && bookingConnection.state === "Disconnected" && allBookings.length > 0) {
      const startConnection = async () => {
        if (await ensureConnected(bookingConnection)) {
          registerUser();
          allBookings.map((booking) => booking?.id && joinBookingGroup(booking.id));
        }
      }
      startConnection();
    }
    //reconnect only once to the connection
    if ((!isBookingOnReconnectedFired.current) && allBookings.length > 0) {
      bookingConnection.onreconnected(async () => {
        console.log("Reconnected successfully.");
        if (await ensureConnected(bookingConnection)) {
          setTimeout(() => {
            registerUser();
            allBookings.map((booking) => joinBookingGroup(booking.id));
          }, 500);
        }
      });
      isBookingOnReconnectedFired.current = true;
    }

    //cleanup function for listeners
    return () => {
      bookingConnection.off("notifybookingdeleted", handleNotifyBookingDeleted);
      bookingConnection.off("notifyuseracceptedinvite", handleNotifyUserAcceptedInvite);
      bookingConnection.off("notifyuserrejectedinvite", handleNotifyUserRejectedInvite);
      bookingConnection.off("notifyordercreated", handleNotifyOrderCreated);
    };
  }, [allBookings]);

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
      events,
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
      allBookings,
      setAllBookings,
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
