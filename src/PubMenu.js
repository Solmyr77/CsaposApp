import React, { useContext, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "./Context";
import img1 from "./img/pilsner.png";
import { LuMinus, LuPlus, LuX, LuShoppingBag, LuLogOut, LuChevronRight, LuShoppingCart } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";

function PubMenu() {
  const { order, setOrder, locationProducts, setLocationProducts, selectedProduct, setSelectedProduct, logout } = useContext(Context);
  const modalRef = useRef();
  const navigate = useNavigate();
  const { name, id } = useParams();
  const [categories, setCategories] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(1);

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

  useEffect(() => {
    let quantity = 0;
    order.map(item => quantity += item.quantity);
    setOrderQuantity(quantity);
  }, [order]);
  

  useEffect(() => {
    getProductsByLocation("cbdd928f-5abb-4a0b-9023-0866107cfa9a")
  } , [])

  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="shadow-lg flex flex-row justify-start items-center mb-4 h-[10vh] px-2 gap-3">
        <LuLogOut className="h-8 w-8 bg-dark-grey p-2 rounded-md text-red-500 rotate-180 cursor-pointer" onClick={()=> navigate("/")}/>
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
                  locationProducts.map(product => product.category === category && <MenuItem product={product} ref={modalRef}/>) 
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
        <button className="btn flex items-center border-0 text-white bg-gradient-to-tr from-blue to-sky-400 py-2 pl-4 pr-2 rounded-md text-md">Asztalom <LuChevronRight className="w-6 h-6"/></button>
      </div>

      <dialog className="modal modal-bottom select-none" ref={modalRef}>
        <div className="modal-box bg-dark-grey relative px-3">
          <LuX className="absolute left-0 top-0 w-10 h-10 text-white font-bold bg-red-500 p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => modalRef.current.close()}/>
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col items-center w-full">
              <img src={img1} alt="kép" className="w-28 aspect-square rounded-lg bg-white p-2"/>
              <p className="text-lg mt-2">{selectedProduct.name}</p>
              <p className="font-normal text-gray-300 leading-none">0.5l korsó</p>
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
                <button className="btn bg-gradient-to-tr from-blue to-sky-400 basis-2/3 border-0 h-14 text-lg text-white" onClick={() => {
                  modalRef.current.close();
                  setOrder(state => [...state, selectedProduct]);
                }}> <LuShoppingCart/> Kosárba</button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
         <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default PubMenu;
