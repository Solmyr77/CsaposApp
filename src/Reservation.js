import React, { useContext, useEffect, useRef, useState } from "react";
import BackButton from "./BackButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdAccessTime, MdCalendarMonth, MdOutlineFmdGood, MdOutlineTableRestaurant } from "react-icons/md";
import AvatarGroupItem from "./AvatarGroupItem";
import Context from "./Context";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import getAccessToken from "./refreshToken";
import axios from "axios";

function Reservation() {
    const { bookings, logout, getLocationTables, removeBooking } = useContext(Context); 
    const { id } = useParams();
    const navigate = useNavigate();
    const confirmModal = useRef();
    const [currentBooking, setCurrentBooking] = useState({});
    const [currentLocation, setCurrentLocation] = useState({});
    const [currentTable, setCurrentTable] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(null);

    async function getLocationById(id) {
        try {
            const config = {
              headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
            }
            const response = await axios.get(`https://backend.csaposapp.hu/api/locations/${id}`, config);
            const data = await response.data;
            if (response.status === 200) {
                setCurrentLocation(data);
            }
        }
        catch (error) {
            if (error.response?.status === 401) {
                if (await getAccessToken()) {
                    await getLocationById(id);
                }
                else {
                    await logout();
                    navigate("/login")
                }
            } 
        }
    }

    useEffect(() => {
        if (isSuccessful) {
            setTimeout(() => {
                navigate("/");
            }, 1000);
        }
        if (id && bookings.length > 0) {
            const foundBooking = bookings.find(booking => booking.id === id);
            if (foundBooking) {
                setCurrentBooking(foundBooking);
                const run = async () => {
                    getLocationById(foundBooking.locationId);
                    setCurrentTable((await getLocationTables(foundBooking.locationId))?.find(table => table.id === foundBooking.tableId));
                }
                run();
                const bookedFrom = new Date(foundBooking.bookedFrom);
                bookedFrom.setSeconds(0);
                const expiryTime = new Date(bookedFrom);
                expiryTime.setMinutes(bookedFrom.getMinutes() + 20, 0);
                if (bookedFrom.getTime() < new Date().getTime()) {
                    setIsActive(true);
                    setTimeout(() => {
                        removeBooking(id);
                        navigate("/");
                    }, expiryTime.getTime() - new Date().getTime());
                }
                else {
                    const timeout = setTimeout(() => {
                        setIsActive(true);
                    }, bookedFrom.getTime() - new Date().getTime());
                    return () => clearTimeout(timeout);
                }
            }
        }
    }, [id, bookings]);
    

    return (
    <div className="w-full min-h-screen bg-grey text-white p-4 flex flex-col select-none">
        <Link to="/">
            <BackButton/>
        </Link>
        <p className="text-xl text-center font-bold">Foglalásom</p>
        <div className="flex mt-8 w-full justify-center">
            <div className="flex flex-col w-96 rounded-xl bg-dark-grey shadow-black shadow-xl px-4 py-2 gap-1">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">{currentLocation.name}</p>
                    {
                        isActive ?
                        <span className="badge bg-green-500 border-none text-white">Aktív</span> : 
                        <span className="badge bg-yellow-500 border-none text-white">Nem aktív</span>
                    }
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineFmdGood/>
                    <p className="text-nowrap">{currentLocation.address}</p>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineTableRestaurant/>
                    {
                        currentTable.number &&  
                        <p className="text-nowrap">Asztal <span className="text-gray-300">#{currentTable.number}</span></p>
                    }
                </div>
                <div className="flex items-center gap-2">
                    <MdCalendarMonth/>
                    <p className="text-nowrap">{currentBooking.bookedFrom?.split("T")[0].substring(5)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <MdAccessTime/>
                    <p className="text-nowrap">{currentBooking.bookedFrom?.split("T")[1].substring(0, 5)}</p>
                </div>
                {
                    currentBooking.tableGuests?.length > 0 &&
                    <p className="font-bold">Meghívott barátok</p>
                }
                <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                    {
                        currentBooking.tableGuests?.map(friend => <AvatarGroupItem height="h-10" imageUrl={friend.imageUrl}/>)
                    }
                </div>
                <div className="flex justify-between mt-2 gap-2 w-full">
                    <button className="btn bg-red-500 hover:bg-red-500 border-none text-white gap-0" onClick={async () => confirmModal.current.showModal()}><XMarkIcon className="h-6"/>Lemondás</button>
                    <button className="btn bg-blue hover:bg-blue border-none text-white gap-0 disabled:bg-blue disabled:opacity-50 disabled:text-white" disabled={!isActive}>Kezdés<ChevronRightIcon className="h-6"/></button>                
                </div>
            </div>
        </div>
        <dialog className="modal" ref={confirmModal}>
            {
                !isSuccessful ?
                <div className="modal-box bg-dark-grey flex flex-col gap-4 items-center">
                    <p className="text-md font-bold">Biztosan lemondod?</p>
                    <div className="flex w-full justify-center gap-2">
                        <button className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white" onClick={async () => {
                            await removeBooking(id) && setIsSuccessful(true);
                        }}>Igen, lemondom</button>
                        <button className="btn bg-blue hover:bg-blue border-none text-white" onClick={() => confirmModal.current.close()}>Mégsem</button>
                    </div>
                </div> :
                <div className="modal-box bg-dark-grey">
                    <p className="text-center text-green-500 text-md font-bold">Sikeresen lemondtad!</p>
                </div>
            }
            
        </dialog>
    </div>
  )
}

export default Reservation;
