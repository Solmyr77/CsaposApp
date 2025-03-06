import React, { useContext, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "./Context";
import img1 from "./img/pilsner.png";
import { LuMinus, LuPlus, LuX, LuShoppingBag, LuLogOut, LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";

function PubMenu() {
  const { order, setOrder, locationProducts, setLocationProducts, logout } = useContext(Context);
  const modalRef = useRef();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);

  async function getProductsyLocation(id) {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/products/location/${id}`, config);
      const data = response.data;
      console.log(data);
      return true;
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          getProductsyLocation(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

  useEffect(()=> {
    const run = async () => {
      setLocationProducts(await getProductsyLocation("cbdd928f-5abb-4a0b-9023-0866107cfa9a"));
    }
    run()
  }, [])

  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="shadow-lg flex flex-row justify-center items-center mb-4 h-[10vh] -translate-y-0">
        <LuLogOut className="w-12 h-12 bg-dark-grey p-2 rounded-md text-red-500 absolute left-4 rotate-180"/>
        <p className="text-center text-xl">Félidő söröző</p>
      </div>
      <div className="h-full overflow-y-scroll bg-grey pb-[12vh]">
        <p className="text-lg w-full pb-2 sticky top-0 px-4 bg-grey">Sörök</p>
        <div className="flex flex-col px-4 gap-y-2">
          <MenuItem name={"Pilsner Urquell"} description={"0.5l korsó"} ref={modalRef}/>
        </div>
      </div>
      <div className="fixed bg-grey bottom-0 h-[10vh] w-full flex flex-row justify-between items-center rounded-t-lg px-6 shadow-dark-grey shadow-[0px_0px_18px_0px_rgba(0_0_0_0)]">
        <div className="relative">
          <LuShoppingBag className="w-8 h-8"/>
          <div className="h-4 aspect-square bg-red-500 absolute -top-1 -right-1 rounded-full flex justify-center items-center font-normal">{order.length}</div>
        </div>
        <button className="btn flex items-center border-0 text-white bg-gradient-to-tr from-blue to-sky-400 py-2 pl-4 pr-2 rounded-md text-md">Asztalom <LuChevronRight className="w-6 h-6"/></button>
      </div>
      <dialog className="modal modal-bottom select-none" ref={modalRef}>
        <div className="modal-box bg-dark-grey h-1/2 relative">
          <LuX className="absolute left-0 top-0 w-10 h-10 text-white font-bold bg-red-500 p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => modalRef.current.close()}/>
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col items-center">
              <img src={img1} alt="kép" className="w-1/2 aspect-square rounded-lg bg-white p-2"/>
              <p className="text-lg mt-2">Pilsner Urquell</p>
              <p className="font-normal text-gray-300 leading-none">0.5l korsó</p>
              <p className="text-md mt-1">450Ft</p>
              <div className="flex justify-center gap-x-2 mt-4">
                <div className="flex justify-center items-center h-10 aspect-square rounded-lg bg-grey cursor-pointer" onClick={() => quantity - 1 > 0 && setQuantity(state => state - 1)}>
                  <LuMinus className="w-14 h-10 text-gray-300"/>
                </div>
                <div className="flex justify-center items-center h-10 w-20 aspect-square rounded-md bg-grey">
                    <p className="text-gray-300 text-lg">{quantity}</p>
                </div>
                <div className="flex justify-center items-center h-10 aspect-square rounded-lg bg-grey cursor-pointer" onClick={() => setQuantity(state => state + 1)}>
                  <LuPlus className="w-14 h-10 text-gray-300"/>
                </div>
              </div>
            </div>
            <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 w-full h-16 text-md text-white mt-4" onClick={() => {
              modalRef.current.close();
              setOrder(state => [...state, "Pilsner Urquell"]);
            }}>Kosárba</button>
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
