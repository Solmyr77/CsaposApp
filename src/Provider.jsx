import { React, useState, useEffect} from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { Navigate } from "react-router-dom";

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
  const [selectedTable, setSelectedTable] = useState({});
  const [bookings, setBookings] = useState([]);
  //order states
  const [locationProducts, setLocationProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  
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

      await getLocation(data.locationId);
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
        data.sort((a, b) => a.number - b.number);
        return data;
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

  async function getBookingsForLocation() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/bookings/bookings-for-location?locationId=${managerLocation.id}`, config);
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
        setOrders(response.data);
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

  async function getOrdersByLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/orders/orders-by-table/${id}`, config);
      if (response.status === 200) {
        setOrders(response.data);
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
      setUserId("");
      setBookings([]);
    }
  }

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
  }, [localStorage.getItem("accessToken"), userId, userRole]);

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

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
      selectedTable,
      setSelectedTable,
      bookings,
      setBookings,
      locationProducts,
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