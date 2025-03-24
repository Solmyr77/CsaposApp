import React, { useContext, useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuReceiptText, LuX } from "react-icons/lu";
import { useNavigate, useParams, Link } from "react-router-dom";
import Context from "./Context";
import Order from "./Order";
import OrderItem from "./OrderItem";
import UserImage from "./UserImage";

function Table() {
  const { allBookings, getOrdersByTable, tableOrders, locationProducts, getProductsByLocation, currentBooking, setCurrentBooking, user, friends } = useContext(Context);
  const navigate = useNavigate();
  const { name, id } = useParams();
  const receiptModal = useRef();
  const [receipt, setReceipt] = useState([]);
  const [total, setTotal] = useState();

  //function for grouping orderitems
  function groupOrderItems() {
    //group orderItems
    let summary = [];
    tableOrders.map(order => {
      if (order.userId === user?.id) {
        order.orderItems.map(item => {
          const existingItem = summary.find(i => i.productId === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            summary.push({ ...item });
          }
        })
      }
    });
    setReceipt(summary);

    //calculate total
    let currentPrice = 0;
    summary.map(item => currentPrice += item.unitPrice * item.quantity);
    setTotal(currentPrice);
  }

  //group orderItems
  useEffect(() => {
    if (tableOrders && user) groupOrderItems();
  }, [tableOrders, user]);

  //main useffect for fetching data
  useEffect(() => {
    if (allBookings?.length > 0) {
      const foundBooking = allBookings.find(booking => booking.id === id);
      if (foundBooking) {
        const run = async () => {
          await getOrdersByTable(foundBooking.tableId);
          locationProducts.length === 0 &&
          await getProductsByLocation(foundBooking.locationId);
        } 
        run();
        setCurrentBooking(foundBooking);
      }
      else navigate("/");
    }
  }, [allBookings]);
  
  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="flex flex-col px-4 shadow-lg pb-2 bg-gradient-to-t pt-4">
        <button className="btn min-h-0 h-8 w-fit mb-2 bg-dark-grey text-sky-400 border-0 hover:bg-dark-grey" onClick={() => navigate(`/pubmenu/${name}/${id}`)}><LuArrowLeft/>Rendelés</button>
        <p className="text-xl">Asztalom</p>
        <div className="flex justify-between items-center">
            <p className="text-md">Asztal <span className="text-gray-300">#1</span></p>
            <div className="avatar-group -space-x-4">
            {
              (currentBooking.bookerId && user) && user.id === currentBooking.bookerId ?
                <UserImage width={"w-10"} record={user} border/> : (
                (friends.length > 0 && currentBooking.bookerId) &&
                <UserImage width={"w-10"} border record={friends.find(friend => friend.id === currentBooking.bookerId)}/>
              )
            }
            {
              currentBooking?.tableGuests?.map((friend, i) => friend.status === "accepted" && <UserImage key={friend.id} width={"w-10"} record={friend} border/>)
            }
            </div>
        </div>
        <button className="btn mt-2 w-fit min-h-0 h-10 bg-gradient-to-tr from-blue to-sky-400 border-0 text-white" onClick={() => receiptModal.current.showModal()}>
          <LuReceiptText/>
          Számlám
        </button>
      </div>
      <div className="flex h-full flex-col gap-3 overflow-auto px-4 py-4">
        {
          tableOrders?.length > 0 ?
          tableOrders.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          } ).map((order, i) => <Order key={order.id} record={order} num={i}/>) :
          <div className="flex h-full flex-grow justify-center items-center">
            <span className="text-gray-300 font-normal">Itt jelennek meg a rendelések.</span>
          </div>
        }
      </div>

      <dialog className="modal modal-bottom" ref={receiptModal}>
        <div className="modal-box bg-dark-grey pt-9 gap-2 flex flex-col justify-between">
          <LuX className="absolute left-0 top-0 w-9 h-9 text-white font-bold bg-red-500 p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => receiptModal.current.close()}/>
          <div className="flex flex-col">
            <p className="text-lg mb-5">Számlám</p>
            <div className="flex flex-col">
              {
                receipt.map(orderItem => <OrderItem product={orderItem} isOrdered/>)
              }
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-md">Összesen: {total} Ft</span>
            <Link to={"https://buy.stripe.com/test_4gw4jb7qM3ogco0eUU"}>
              <button className="btn w-fit min-h-0 bg-gradient-to-tr from-blue to-sky-400 border-0 text-white">Számla kifizetése</button>
            </Link>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </div>
  )
}

export default Table;
