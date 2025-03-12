import React, { useContext, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "./Context";
import OrderItem from "./OrderItem";
import { LuMinus, LuPlus, LuX, LuShoppingBag, LuLogOut, LuCheck } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";
import img1 from "./img/pilsner.png";
import { MdOutlineTableRestaurant } from "react-icons/md";
import AvatarGroupItem from "./AvatarGroupItem";


function PubMenu() {
  const { order, setOrder, locationProducts, categories, tableOrders, selectedProduct, setSelectedProduct, logout, bookings, bookingsContainingUser, getProductsByLocation, getOrdersByTable, user } = useContext(Context);
  const productModal = useRef();
  const bagModal = useRef();
  const successModal = useRef();
  const navigate = useNavigate();
  const { name, id } = useParams();
  const [currentBooking, setCurrentBooking] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateOrder() {
    setIsLoading(true);
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
      if (response.status === 204 || response.status === 201) {
        setIsLoading(false);
        successModal.current.showModal();
        setTimeout(() => {
          setOrder([]);
          bagModal.current.close();
          successModal.current.close();
        }, 1000);
        await getOrdersByTable(currentBooking.tableId);
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
    if (allBookings.length > 0) {
      const foundBooking = allBookings.find(booking => booking.id === id);
      if (foundBooking) {
        setCurrentBooking(foundBooking);
        const run = async () => {
          await getOrdersByTable(foundBooking.tableId);
          if (categories.length === 0) {
            await getProductsByLocation(foundBooking.locationId);
          }
        } 
        run();
      }
      else navigate("/");
    }
  }, [bookings, bookingsContainingUser, categories]);

  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="flex flex-col mb-3 px-4 pt-4 pb-0 shadow-lg">
        <button className="btn min-h-0 h-8 w-fit text-red-500 bg-dark-grey border-0 hover:bg-dark-grey" onClick={()=> navigate("/")}>
          <LuLogOut className="rotate-180"/>
          <span>Kilépés</span>
        </button>
        <div className="flex flex-row justify-between items-end mb-2">
          <p className="text-center text-xl">{name}</p>
          <div className="relative">
            <button className="btn bg-dark-grey border-0 hover:bg-dark-grey" onClick={() => navigate(`/table/${name}/${id}`)}>
              <div className="avatar-group -space-x-3">
                <AvatarGroupItem height={"h-7"} imageUrl={`${currentBooking.bookerId}.webp`}/>
                {
                  currentBooking?.tableGuests?.map((friend, i) => i < 3 ? friend.status === "accepted" && <AvatarGroupItem height={"h-7"} imageUrl={friend.imageUrl}/> : (
                    i === currentBooking.tableGuests.length - 1 && 
                    <div className="avatar placeholder h-7 aspect-square border-2">
                      <div className="bg-neutral text-neutral-content w-12">
                        <span className="">+{currentBooking?.tableGuests?.length - i}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
              <MdOutlineTableRestaurant className="h-8 w-8 text-sky-400"/>
            </button>
            {
              tableOrders?.length > 0 &&
              <div className="h-4 w-fit bg-yellow-500 absolute -right-1 -top-1 rounded-full flex justify-center items-center p-1">
                <span>{tableOrders.length}</span>
              </div>
            }
          </div>
        </div>
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
                  <div className={`flex justify-center items-center basis-1/3 aspect-square rounded-lg bg-grey cursor-pointer ${selectedProduct.quantity === 1 && "opacity-50 cursor-auto"}`} onClick={() => {
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
            order.map(product => <OrderItem product={product}/>) :
              <div className="h-full flex justify-center items-center">
                <span className="text-gray-300 font-normal">A rendelésed üres.</span>
              </div>
            }
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-md">Összesen:</span>
            <span>{orderTotal} Ft</span>
          </div>
          {
            isLoading ?
            <span className="loading loading-spinner text-sky-400 w-20 self-center"></span> : 
            <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 text-white text-md disabled:text-white disabled:opacity-50" disabled={order.length === 0} onClick={handleCreateOrder}>Rendelés leadása</button>
          }
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>

      {/*success modal*/}
      <dialog className="modal" ref={successModal}>
        <div className="modal-box flex flex-col items-center bg-grey">
          <p className="bg-gradient-to-t from-blue to-sky-400 text-transparent bg-clip-text text-lg font-bold">Sikeres rendelés!</p>
          <LuCheck className="fill-none stroke-[url(#gradient)] h-12 w-12"/>
        </div>
      </dialog>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default PubMenu;
