import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import BackButton from "./BackButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { LuCalendar, LuCheck, LuClock, LuMapPin, LuX } from "react-icons/lu";
import AvatarGroupItem from "./AvatarGroupItem";
import Context from "./Context";
import getAccessToken from "./refreshToken";
import axios from "axios";

function Reservation() {
    const { bookings, bookingsContainingUser, setBookingsContainingUser, getBookingsContainingUser, logout, getLocationTables, removeBooking, user, friends, locations } = useContext(Context); 
    const { id } = useParams();
    const navigate = useNavigate();
    const confirmModal = useRef();
    const [currentBooking, setCurrentBooking] = useState([]);
    const [currentTable, setCurrentTable] = useState({});
    const [currentLocation, setCurrentLocation] = useState({});
    const [tableUser, setTableUser] = useState({});
    const [bookerProfile, setBookerProfile] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isAccepted, setIsAccepted] = useState(null);
    const [waiting, setWaiting] = useState(false);
    
    async function handleAcceptInvite(id) {
        try {
            const config = {
              headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/accept-invite?bookingId=${id}`, {}, config);
            if (response.status === 200) {
                setIsAccepted(true);
                await getBookingsContainingUser();
            }
        }
        catch (error) {
            if (error.response?.status === 401) {
                if (await getAccessToken()) {
                    await handleAcceptInvite(id);
                }
                else {
                    await logout();
                    navigate("/login")
                }
            } 
        }
    }

    async function handleRejectInvite(id) {
        try {
            const config = {
              headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/bookings/reject-invite?bookingId=${id}`, {}, config);
            if (response.status === 200) {
                setIsAccepted(false);
            }
        }
        catch (error) {
            if (error.response?.status === 401) {
                if (await getAccessToken()) {
                    await handleRejectInvite(id);
                }
                else {
                    await logout();
                    navigate("/login")
                }
            } 
        }
    }

    function setAdminTimeouts(foundBooking) {
        const bookedFrom = new Date(foundBooking.bookedFrom);
        bookedFrom.setSeconds(0);
        const expiryTime = new Date(bookedFrom);
        expiryTime.setMinutes(bookedFrom.getMinutes() + 20, 0);
        if (bookedFrom.getTime() < new Date().getTime()) {
            setIsActive(true);
            const timeout = setTimeout(() => {
                removeBooking(id);
                navigate("/");
            }, expiryTime.getTime() - new Date().getTime());
            return () => clearTimeout(timeout);
        }
        else if (expiryTime.getTime() <= new Date().getTime()) {
            removeBooking(id);
            navigate("/");
        }
        else if (new Date().getTime() < bookedFrom.getTime()) {
            const timeout = setTimeout(() => {
                setIsActive(true);
            }, bookedFrom.getTime() - new Date().getTime());
            return () => clearTimeout(timeout);
        }
    }

    function setGuestTimeouts(foundBooking) {
        const bookedFrom = new Date(foundBooking.bookedFrom);
        bookedFrom.setSeconds(0);
        const expiryTime = new Date(bookedFrom);
        expiryTime.setMinutes(bookedFrom.getMinutes() + 20, 0);
        if (bookedFrom.getTime() < new Date().getTime()) {
            const timeout = setTimeout(() => {
                setBookingsContainingUser(state => state.filter(booking => booking.id !== id));
                navigate("/");
            }, expiryTime.getTime() - new Date().getTime());
            return () => clearTimeout(timeout);
        }
        else if (expiryTime.getTime() <= new Date().getTime()) {
            setBookingsContainingUser(state => state.filter(booking => booking.id !== id));
            navigate("/");
        }
    }

    function getUserOfTable(tableUser) {
        switch (tableUser?.status) {
        case "pending":
            break;
        case "accepted":
            setWaiting(true);
            break;
        case "rejected":
            setIsAccepted(false);
            break;
       }
    }

    useEffect(() => {
        if (isSuccessful) {
            setTimeout(() => {
                navigate("/")
            }, 1000);
        }
        if (isAccepted === true) {
            setTimeout(() => {
                setWaiting(true);
            }, 2000);
        }
        if (bookings.length > 0 || bookingsContainingUser.length > 0) {
            const foundBooking = bookings.concat(bookingsContainingUser).find(booking => booking.id === id);
            if (foundBooking && Object.hasOwn(foundBooking, "id")) {
                setCurrentBooking(foundBooking);
                const foundUser = foundBooking.tableGuests.find(tableGuest => tableGuest.id === user.id);
                setTableUser(foundUser);
                setCurrentLocation(locations.find(location => location.id === foundBooking.locationId));
                if (friends.length > 0) setBookerProfile(friends.find(friend => friend.id === foundBooking.bookerId));
                const run = async () => {
                    (user  && foundUser) && getUserOfTable(foundUser);
                    setCurrentTable((await getLocationTables(foundBooking.locationId))?.find(table => table.id === foundBooking.tableId));
                }
                run();
                if (bookings.find(booking => booking.id === id)) {
                    setAdminTimeouts(foundBooking);
                }
                else {
                    setIsGuest(true);
                    setGuestTimeouts(foundBooking);
                }
            }
        }
    }, [bookings, bookingsContainingUser, friends, locations, isActive, isSuccessful]);
    
    return (   
        <div className="w-full min-h-screen bg-grey text-white p-4 flex flex-col select-none">
            <Link to="/">
                <BackButton/>
            </Link> 
            <p className="text-xl text-center font-bold">{!isGuest ? "Foglalásom" : "Meghívó"}</p>
            <div className="flex mt-8 w-full justify-center">
                <div className="flex flex-col w-96 rounded-xl bg-gradient-to-tr from-blue to-sky-400 shadow-lg px-4 py-2 gap-1">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-bold max-basis-2/3">{currentLocation?.name}</p>
                        {
                            !isGuest ? (
                                isActive ?
                                <span className="badge bg-green-500 border-0 text-white font-bold">Aktív</span> : 
                                <span className="badge bg-transparent border-2 border-gray-300 text-gray-300 font-bold">Nem aktív</span>
                                
                            ) :
                            <div className="flex items-center gap-1 basis-1/3">
                                <span className="badge bg-opacity-20 border-0 font-bold text-white text-xs">Foglalta:</span>
                                <div className="avatar border-2 rounded-full border-white">
                                    <div className="w-6 rounded-full">
                                        <img src={`https://assets.csaposapp.hu/assets/images/${bookerProfile?.imageUrl}`} alt="kép" />
                                    </div>
                                </div>
                                <p className="line-clamp-1 font-bold">{bookerProfile?.displayName || "N/A"}</p>
                            </div>
                        }
                        
                    </div>
                    <div className="flex items-center gap-2">
                        <LuMapPin/>
                        <p className="text-nowrap font-bold">{currentLocation.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdOutlineTableRestaurant/>
                        <p className="text-nowrap font-bold">Asztal <span className="text-gray-300">#{currentTable?.number}</span></p>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                        <LuCalendar/>
                        <p className="text-nowrap">{currentBooking.bookedFrom?.split("T")[0].substring(5)}</p>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                        <LuClock/>
                        <p className="text-nowrap">{currentBooking.bookedFrom?.split("T")[1].substring(0, 5)}</p>
                    </div>
                    {
                        currentBooking.tableGuests?.length > 0 &&
                        <p className="font-bold">Meghívott barátok</p>
                    }
                    <div className="avatar-group -space-x-1 rtl:space-x-reverse h-max">
                        {
                            currentBooking.tableGuests?.map(friend => {
                                if (friend.status === "pending") {
                                    return (
                                        <div className="relative">
                                            <div className="h-4 w-4 bg-yellow-500 -right-1 top-0 absolute z-50 rounded-full flex justify-center items-center"><span className="text-xs">?</span></div>
                                            <AvatarGroupItem height={"h-10"} imageUrl={friend.imageUrl}/>
                                        </div>
                                    )   
                                } 
                                else if (friend.status === "accepted") {
                                    return (
                                        <div className="relative">
                                            <div className="h-4 w-4 bg-green-500 -right-1 top-0 absolute z-50 rounded-full flex justify-center items-center"><span className="text-xs"><LuCheck/></span></div>
                                            <AvatarGroupItem height={"h-10"} imageUrl={friend.imageUrl}/>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="relative">
                                            <div className="h-4 w-4 bg-red-500 -right-1 top-0 absolute z-50 rounded-full flex justify-center items-center"><span className="text-xs"><LuX/></span></div>
                                            <AvatarGroupItem height={"h-10"} imageUrl={friend.imageUrl}/>
                                        </div>
                                    ) 
                                }
                            })
                        }
                    </div>
                    {
                        waiting ?
                        <div className="flex flex-col items-center gap-1">
                            <p className="font-bold text-lg">ELFOGADVA</p>
                            <div className="flex items-end gap-1">
                                <p>Várakozás az adminra</p>
                                <span className="loading loading-dots loading-xs"></span>
                            </div>
                        </div> :
                        (
                            !isGuest ? 
                            <div className="flex justify-between mt-2 gap-2 w-full">
                                <button className="btn bg-black border-2 bg-opacity-40 border-red-500 text-red-500 hover:bg-black hover:bg-opacity-40 hover:border-red-500 gap-0 basis-1/2 text-md" onClick={async () => confirmModal.current.showModal()}>Lemondás</button>
                                <Link className="basis-1/2" to={`/pubmenu/${currentLocation.name}/${currentBooking.id}`}> 
                                    <button className="btn bg-dark-grey hover:bg-dark-grey disabled:bg-dark-grey border-none gap-0 w-full disabled:opacity-10 text-md" disabled={!isActive}><span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text leading-relaxed text-transparent">Kezdés</span></button>
                                </Link>
                            </div> :
                            <div className="flex justify-between mt-2 gap-2 w-full">
                                <button className={`btn bg-black border-2 bg-opacity-40 border-red-500 text-red-500 hover:bg-black hover:bg-opacity-40 hover:border-red-500 text-md gap-0 basis-1/2 ${isAccepted !== null && "hidden"}`} onClick={async () => await handleRejectInvite(currentBooking.id)}>Elutasítás</button>
                                <button className={`btn bg-dark-grey hover:bg-dark-grey border-none text-md gap-0 basis-1/2 ${isAccepted !== null && "hidden"}`} onClick={async () => await handleAcceptInvite(currentBooking.id)}><span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text leading-relaxed text-transparent">Elfogadás</span></button>                
                                <button className={`btn bg-black border-2 bg-opacity-40 border-red-500 text-red-500 hover:bg-black hover:bg-opacity-40 hover:border-red-500 text-md  gap-0 basis-full ${isAccepted === false ? "" : "hidden"}`}>Elutasítva</button>
                            </div> 
                        )
                    }
                </div>
            </div>
            <dialog className="modal" ref={confirmModal}>
                {
                    !isSuccessful ?
                    <div className="modal-box bg-dark-grey flex flex-col gap-4 items-center">
                        <p className="text-md font-bold">Biztosan lemondod?</p>
                        <div className="flex w-full justify-center gap-2">
                            <button className="btn bg-transparent border-2 border-red-500 text-red-500 hover:bg-transparent hover:border-red-500 basis-1/2 text-sm" onClick={async () => {
                                await removeBooking(id) && setIsSuccessful(true);
                            }}>Igen, lemondom</button>
                            <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-none text-white basis-1/2 text-sm" onClick={() => confirmModal.current.close()}>Mégsem</button>
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