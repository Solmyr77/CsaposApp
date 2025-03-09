import React, { useContext, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "./Context";
import OrderItem from "./OrderItem";
import { LuMinus, LuPlus, LuX, LuShoppingBag, LuLogOut } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";
import img1 from "./img/pilsner.png";

function PubMenu() {
  const { order, setOrder, locationProducts, setLocationProducts, selectedProduct, setSelectedProduct, logout, bookings, bookingsContainingUser } = useContext(Context);
  const productModal = useRef();
  const bagModal = useRef();
  const navigate = useNavigate();
  const { name, id } = useParams();
  const [currentBooking, setCurrentBooking] = useState({});
  const [categories, setCategories] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);

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
          navigate("/login");
        }
      } 
    }
  }

  async function handleCreateOrder() {
    const orderItems = Array.from(order.map(item => ({
      productId: item.id,
      quantity: item.quantity
    })));
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/orders/create-order/`, {
        tableId: currentBooking.tableId,
        orderItems: orderItems
      }, config);
      const data = response.data;
      if (response.status === 200) {
        console.log(data);
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await handleCreateOrder();
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

  useEffect(() => {
    let quantity = 0;
    let total = 0; 
    order.map(item => {
      quantity += item.quantity;
      total += item.price * item.quantity;
    });
    setOrderQuantity(quantity);
    setOrderTotal(total);
  }, [order]);
  
  useEffect(() => {
    const allBookings = bookings.concat(bookingsContainingUser);
    const foundBooking = allBookings.find(booking => booking.id === id);
    if (foundBooking) {
      setCurrentBooking(foundBooking);
      const run = async () => await getProductsByLocation(foundBooking.locationId);
      run();
    }
  } , [bookings, bookingsContainingUser])

  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="shadow-lg flex flex-row justify-start items-center mb-4 h-[10vh] px-2 gap-3">
        <LuLogOut className="h-10 w-10 bg-dark-grey p-2 rounded-md text-red-500 rotate-180 cursor-pointer" onClick={()=> navigate("/")}/>
        <p className="text-center text-xl">{name}</p>
      </div>
      <div className="h-full overflow-y-scroll bg-grey pb-[12vh]">
        {
          categories.length > 0 ? 
          categories.map(category => (
            <div className="flex flex-col">
              <p className="text-lg w-full py-2 sticky top-0 px-4 bg-grey">{category}</p>
              <div className="flex flex-col px-4 gap-y-2">
                {
                  locationProducts.length > 0 && 
                  locationProducts.map(product => product.category === category && <MenuItem product={product} ref={productModal}/>) 
                }
              </div>
            </div> 
          )) :
          <div className="flex justify-center h-full flex-grow items-center">
            <p className="text-gray-300 font-normal">Nincsenek elérhető termékek</p>
          </div>
        }
      </div>
      <div className="fixed bg-grey bottom-0 h-[10vh] w-full flex flex-row justify-between items-center rounded-t-lg px-6 shadow-dark-grey shadow-[0px_0px_18px_0px_rgba(0_0_0_0)]">
        <div className="relative">
          <LuShoppingBag className="w-8 h-8"/>
          <div className="h-4 aspect-square bg-red-500 absolute -top-1 -right-1 rounded-full flex justify-center items-center font-normal">{orderQuantity}</div>
        </div>
        <button className="btn flex items-center border-0 text-white bg-gradient-to-tr from-blue to-sky-400 py-2 px-4 rounded-md text-md" onClick={() => {
          bagModal.current.inert = true;
          bagModal.current.showModal();
          bagModal.current.inert = false;
        }}>Rendelésem</button>
      </div>

      {/* product modal */}
      <dialog className="modal modal-bottom select-none" ref={productModal}>
        <div className="modal-box bg-dark-grey relative px-3 lg:w-1/2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <LuX className="absolute left-0 top-0 w-9 h-9 text-white font-bold bg-red-500 p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => productModal.current.close()}/>
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col items-center w-full">
              <img src={img1} alt="kép" className="w-28 aspect-square rounded-lg bg-white p-2"/>
              <p className="text-lg mt-2">{selectedProduct.name}</p>
              <p className="font-normal text-gray-300 leading-none">{selectedProduct.description}</p>
              <p className="text-md mt-1">{selectedProduct.price * selectedProduct.quantity} Ft</p>
              <div className="flex justify-start items-center w-full gap-x-4 mt-4">
                <div className="flex justify-center gap-x-2 basis-1/3">
                  <div className="flex justify-center items-center basis-1/3 aspect-square rounded-lg bg-grey cursor-pointer" onClick={() => {
                    if (selectedProduct.quantity - 1 > 0) {
                      setSelectedProduct(state => (
                        {
                          ...state,
                          quantity: state.quantity - 1
                        }
                      ));
                    }
                  }}>
                    <LuMinus className="w-4 text-gray-300"/>
                  </div>
                  <div className="flex justify-center items-center basis-1/3 aspect-square rounded-md bg-grey">
                      <p className="text-gray-300 text-lg font-normal">{selectedProduct.quantity}</p>
                  </div>
                  <div className="flex justify-center items-center basis-1/3 aspect-square rounded-lg bg-grey cursor-pointer" onClick={() => {
                    setSelectedProduct(state => (
                      {
                        ...state,
                        quantity: state.quantity + 1
                      }
                    ))
                  }}>
                    <LuPlus className="w-4 h-4 text-gray-300"/>
                  </div>
                </div>
                <button className="btn bg-gradient-to-tr from-blue to-sky-400 basis-2/3 border-0 h-14 text-md text-white" onClick={() => {
                  productModal.current.close();
                  setOrder(state => [...state, selectedProduct]);
                }}> <LuShoppingBag/> Rendeléshez adás</button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
         <button></button>
        </form>
      </dialog>

      {/* bag modal */}
      <dialog className="modal modal-bottom" ref={bagModal}>
        <div className="modal-box bg-dark-grey h-4/5 flex flex-col pt-9">
          <LuX className="absolute left-0 top-0 w-9 h-9 text-white font-bold bg-red-500 p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => bagModal.current.close()}/>
          <p className="text-lg mb-5">Rendelésem</p>
          <div className="flex flex-col h-full">
          {
            order.length > 0 ?
            order.map(product => (
                <div className="flex flex-col">
                  <OrderItem product={product}/>
                  <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 3rem)"}}/>
                </div>
              )) :
              <div className="h-full flex justify-center items-center">
                <span className="text-gray-300 font-normal">A rendelésed üres.</span>
              </div>
            }
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-md">Összesen:</span>
            <span>{orderTotal} Ft</span>
          </div>
          <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 text-white text-md disabled:text-white disabled:opacity-50" disabled={order.length === 0} onClick={handleCreateOrder}>Rendelés leadása</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>

      {/*success modal*/}
      <dialog className="modal">
        
      </dialog>
    </div>
  )
}

export default PubMenu;
