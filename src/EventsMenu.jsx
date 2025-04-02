import React, { useContext, useEffect, useRef, useState } from "react";
import { LuCheck, LuImagePlus, LuX } from "react-icons/lu";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import EventItem from "./EventItem";
import StateContext from "./StateProvider";

function EventsMenu() {
    const { setMenuState, events, setEvents, managerLocation } = useContext(Context);
    const { selectedEvent } = useContext(StateContext);
    const [previewPicture, setPreviewPicture] = useState(null);
    const [isConversionFinished, setIsConversionFinished] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState(new FormData());
    const addModalRef = useRef();
    const modifyModalRef = useRef();
    const modifyFormRef = useRef();
    const addFormRef = useRef();
    const addImageRef = useRef();
    const modifyImageRef = useRef();
    const errorRef = useRef();
    const confirmRef = useRef();
    const responseRef = useRef();

    //function for uploading image for an event
    async function handleImageUpload(locationId, eventId) {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
                    "Cache-Control": "no-cache"
                }
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/Images/upload/event?locationId=${locationId}&eventId=${eventId}`, formData, config);
            if (response.status === 200) {
                setFormData(new FormData());
                setPreviewPicture(null);
                setIsUploading(false);
                console.log("sikeres feltöltés");
                return true;
            }
        }
        catch (error) {
            if (error.response?.status === 401) {
                if (await getAccessToken()) await handleImageUpload();
                else {
                    await logout();
                    navigate("/");
                }
            }
        }
    }

    //function for validating compressed image size
    function isImageSizeValid(file) {
        const byteLimit = 4 * 1000 * 1000;
        if (file && file.size <= byteLimit) {
          return true;
        }
        return false;
    }

    //function for showing preview of uploaded image
    async function showImagePreview(event) {
        let file = await event.target.files[0];
        const updatedFormData = new FormData();
        if (file) {
          setIsConversionFinished(false);
          if (file.type === "image/heic") {
            const blob = await heic2any({ blob: file, toType: "image/jpeg" });
            file = new File([blob], file.name.replace(".heic", ".jpg"), {
              type: "image/jpeg",
            })
          }
          const options = {
            maxSizeMB: 4,
            useWebWorker: true,
          }
          file = await imageCompression(file, options);
          updatedFormData.append("file", file); 
          if (isImageSizeValid(file)) {
            const fileURL = URL.createObjectURL(file);
            setPreviewPicture(fileURL);
            setFormData(updatedFormData);
            setIsConversionFinished(true);
          }
          else {
            setIsSucceeded(true);
            setErrorMessage("A kép mérete meghaladja a limitet! (4MB)");
            setTimeout(() => {
              setIsSucceeded(false);
              setErrorMessage("");
            }, 1000)
          }
        }
    }

    //function for modyfing an events data
    async function handleModifyEvent(id) {
        setIsUploading(true);
        try {
            const config = {
                headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` },
            }
            const response = await axios.put(`https://backend.csaposapp.hu/api/events/${id}`,{
                name: modifyFormRef.current.name.value,
                description: modifyFormRef.current.description.value,
                locationId: managerLocation.id,
                timeFrom: modifyFormRef.current.timeFrom.value,
                timeTo: modifyFormRef.current.timeFrom.value 
            }, config);
            if (response.status === 204) {
                if (formData.get("file")) {
                    console.log("van file")
                    if (await handleImageUpload(id)){
                        setIsUploading(false);
                        setFormData(new FormData());
                        responseRef.current.inert = true;
                        responseRef.current.showModal();
                        responseRef.current.inert = false;
                        setTimeout(() => {
                            responseRef.current.close();
                            modifyModalRef.current.close();
                        }, 1000);
                        setEvents(state => {
                            const newArray = state.filter(event => event.id !== selectedEvent.id);
                            return [...newArray, 
                            {
                                id: selectedEvent.id,
                                name: modifyFormRef.current.name.value,
                                description: modifyFormRef.current.description.value,
                                locationId: managerLocation.id,
                                timeFrom: modifyFormRef.current.timeFrom.value,
                                timeTo: modifyFormRef.current.timeFrom.value 
                            }];      
                        });
                    }
                }
                else {
                    setIsUploading(false);
                    setFormData(new FormData());
                    responseRef.current.inert = true;
                    responseRef.current.showModal();
                    responseRef.current.inert = false;
                    setTimeout(() => {
                        responseRef.current.close();
                        modifyModalRef.current.close();
                    }, 1000);
                    setEvents(state => {
                        const newArray = state.filter(event => event.id !== selectedEvent.id);
                        return [...newArray, 
                        {
                            id: selectedEvent.id,
                            name: modifyFormRef.current.name.value,
                            description: modifyFormRef.current.description.value,
                            locationId: managerLocation.id,
                            timeFrom: modifyFormRef.current.timeFrom.value,
                            timeTo: modifyFormRef.current.timeFrom.value 
                        }];      
                    });
                }
            }
        }
          catch (error) {
            if (error.response?.status === 401) {
              if (await getAccessToken()) {
                return await handleModifyEvent(id);
              }
              else {
                await logout();
                window.location.reload();
              }
            }
        }
    }

    //function for handling product creation
    async function handleCreateEvent() {
        setIsUploading(true);
        try {

            const config = {
              headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` },
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/events`,{
                name: addFormRef.current.name.value,
                description: addFormRef.current.description.value,
                locationId: managerLocation.id,
                timeFrom: addFormRef.current.timeFrom.value,
                timeTo: addFormRef.current.timeTo.value 
              }, config);
            if (response.status === 201) {
                if (await handleImageUpload(response.data.locationId, response.data.id)){
                    setEvents(state => {
                        if (!state.some(event => event.id === response.data.id)) {
                            return [...state, response.data]
                        }
                        return state;
                    })
                    responseRef.current.inert = true;
                    responseRef.current.showModal();
                    responseRef.current.inert = false;
                    setTimeout(() => {
                        responseRef.current.close();
                        addModalRef.current.close();
                    }, 1000);
                }
            }
        }
          catch (error) {
            if (error.response?.status === 401) {
              if (await getAccessToken()) {
                return await handleCreateEvent();
              }
              else {
                await logout();
                window.location.reload();
              }
            }
        }
    }

    useEffect(() => {
        setMenuState("Events");
    }, [])

    return (
        <div className="w-full h-full p-4 flex flex-col gap-8" style={{height: "calc(100vh - 6rem)"}}>

            <div className="flex justify-between items-center">
                <span className='text-5xl font-bold'>Események</span>
                <button className='btn btn-info btn-lg' onClick={() => {
                    addModalRef.current.inert = true;
                    addModalRef.current.showModal()
                    addModalRef.current.inert = false;
                }}>Új esemény</button>
            </div>

            <div className="grid grid-cols-3 gap-4 h-full">
                {
                    events?.length > 0 ?
                    events.map((event, i) => <EventItem key={i} ref={modifyModalRef} event={event}/>) :
                    <span>Nincsenek események</span>
                }
            </div>

            <dialog className='modal' ref={modifyModalRef}>
                <div className="modal-box flex flex-col gap-4 max-w-1/2 relative">
                    <LuX className='absolute top-0 left-0 bg-red-500 text-white w-8 h-8 rounded-br cursor-pointer' onClick={() => {
                        modifyModalRef.current.close();
                        modifyFormRef.current.reset();
                        setPreviewPicture(null);
                    }}/>
                    <div className="flex justify-between items-center">
                        <span className='text-xl font-bold'>Esemény módosítása</span>
                        <button className='btn btn-error' onClick={() => {
                            confirmRef.current.inert = true;
                            confirmRef.current.showModal();
                            confirmRef.current.inert = false;
                        }}>Esemény törlése</button>
                    </div>
                    <div className="flex gap-6">
                        {
                            isConversionFinished === false ?
                            <span className="loading loading-spinner text-sky-400 w-20"></span> :
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="relative h-fit w-full aspect-square select-none hover:cursor-pointer" onClick={() => modifyImageRef.current.click()}>
                                    <img src={previewPicture ?? `https://assets.csaposapp.hu/assets/images${selectedEvent.imgUrl}`} className="object-cover p-2 opacity-50 w-full h-full border-2 rounded"/>
                                    <LuImagePlus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12"/>
                                    <input ref={modifyImageRef} type="file" accept='image/*' style={{"display" : "none"}} onChange={(event) => showImagePreview(event)}/>
                                </div>
                                {
                                    errorMessage !== "" &&
                                    <span className='text-red-500'>Valami hiba van a képpel!</span>
                                }
                            </div>
                        }
                        <form ref={modifyFormRef} onSubmit={async (event) => {
                            event.preventDefault();
                            console.log(selectedEvent);
                            await handleModifyEvent(selectedEvent.id);
                            }}>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Név</legend>
                                <input name='name' type="text" defaultValue={selectedEvent.name} className='input input-lg' required/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Leírás</legend>
                                <input name='description' type="text" defaultValue={selectedEvent.description} className='input input-lg' required/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Ettől</legend>
                                <input type="datetime-local" name='timeFrom' className='input input-lg' defaultValue={selectedEvent.timefrom} required/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Eddig</legend>
                                <input type="datetime-local" name='timeTo' className='input input-lg' defaultValue={selectedEvent.timeto} required/>
                            </fieldset>
                            {
                                isUploading ? 
                                <button className='btn btn-info btn-lg mt-4 w-full disabled:!text-info-content disabled:!bg-info' disabled>
                                    Hozzáadás
                                    <span className='loading loading-spinner loading-md'></span>
                                </button> :
                                <input type='submit' value={"Mentés"} className='btn btn-info btn-lg mt-4 w-full' required/>
                            }
                        </form>
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'><button onClick={() => {
                    modifyFormRef.current.reset();
                    modifyFormRef.current.category.value = selectedCategory;
                    setPreviewPicture(null);
                }}></button></form>
            </dialog>

            {/* Add modal */}
            <dialog className='modal' ref={addModalRef}>
                <div className="modal-box flex flex-col gap-4 max-w-1/2 relative">
                    <LuX className='absolute top-0 left-0 bg-red-500 text-white w-8 h-8 rounded-br cursor-pointer' onClick={() => {
                        addModalRef.current.close();
                        addFormRef.current.reset();
                        setPreviewPicture(null);
                    }}/>
                    <span className='text-xl font-bold'>Esemény hozzáadása</span>
                    <div className="flex gap-6 h-full">
                        {
                            isConversionFinished === false ?
                            <span className="loading loading-spinner text-sky-400 w-20"></span> :
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="relative h-fit select-none hover:cursor-pointer w-full aspect-square" onClick={() => addImageRef.current.click()}>
                                    <img src={previewPicture} className="object-cover p-2 opacity-50 w-full h-full border-2 rounded"/>
                                    <LuImagePlus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12"/>
                                    <input ref={addImageRef} accept='image/*' type="file" style={{"display" : "none"}} onChange={(event) => showImagePreview(event)}/>
                                </div>
                                {
                                    errorMessage !== "" &&
                                    <span className='text-red-500'>Túl nagy a kép!</span>
                                }
                            </div>
                        }
                        <form ref={addFormRef} onSubmit={async (event) => {
                            event.preventDefault();
                            if (formData.get("file")) {
                                await handleCreateEvent();
                            }
                            else {
                                errorRef.current.inert = true;
                                errorRef.current.showModal();
                                errorRef.current.inert = false;
                                setTimeout(() => {
                                    errorRef.current.close();
                                }, 1000);
                            }
                        }}>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Név</legend>
                                <input type="text" name='name' placeholder='Pl: Azahriah a Félidőben' className='input input-lg' required/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Leírás</legend>
                                <textarea name="description" placeholder="Pl: Legkomolyabb kocsmakoncertek" className="textarea"></textarea>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Ettől</legend>
                                <input type="datetime-local" name='timeFrom' className='input input-lg' required/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Eddig</legend>
                                <input type="datetime-local" name='timeTo' className='input input-lg' required/>
                            </fieldset>
                            {
                                isUploading ? 
                                <button className='btn btn-info btn-lg mt-4 w-full disabled:!text-info-content disabled:!bg-info' disabled>
                                    Hozzáadás
                                    <span className='loading loading-spinner loading-md'></span>
                                </button> :
                                <input type='submit' value={"Hozzáadás"} className='btn btn-info btn-lg mt-4 w-full'/>
                            }
                        </form>
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'><button onClick={() => {
                    setPreviewPicture();
                }}></button></form>
            </dialog>

            <dialog className='modal' ref={confirmRef}>
                <div className="modal-box">
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-lg">Biztosan törölni szeretnéd?</span>
                        <div className="flex gap-4 items-center justify-center">
                            <button className="btn btn-error basis-1/2 text-md disabled:!text-error-content disabled:!bg-error disabled:opacity-50">
                                Igen
                            </button>
                            <button className="btn border-2 shadow basis-1/2 text-md" onClick={() => confirmRef.current.close()}>Mégsem</button>
                        </div>
                    </div>
                </div>
                <form method="dialog" className='modal-backdrop'><button onClick={() => {
                    addFormRef.current.reset();
                    setPreviewPicture(null);
                }}></button></form>
            </dialog>

            <dialog className='modal' ref={responseRef}>
                <div className="modal-box">
                    <div className='flex items-center'>
                        <span className='font-bold text-lg'>Sikeres művelet!</span>
                        <LuCheck className='h-10 w-10'/>
                    </div>
                </div>
                <form method="dialog" className='modal-backdrop'><button></button></form>
            </dialog>

            <dialog className='modal' ref={errorRef}>
                <div className="modal-box">
                    <div className='flex items-center'>
                        <span className='font-bold text-lg text-red-500'>Kötelező képet feltölteni!</span>
                    </div>
                </div>
                <form method="dialog" className='modal-backdrop'><button></button></form>
            </dialog>
        </div>
    )
}

export default EventsMenu;
