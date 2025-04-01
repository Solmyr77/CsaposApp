import React, { useContext, useEffect, useState } from 'react'
import Context from "./Context";
import ProductItem from './ProductItem';
import { useRef } from 'react';
import TableContext from './TableProvider';
import { LuCheck, LuImagePlus, LuX } from "react-icons/lu";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import getAccessToken from './refreshToken';
import axios from 'axios';

export default function ProductsMenu() {
    const { setMenuState, locationProducts, managerLocation, logout } = useContext(Context);
    const { selectedProduct } = useContext(TableContext);
    const [previewPicture, setPreviewPicture] = useState(null);
    const [isConversionFinished, setIsConversionFinished] = useState(null);
    const [formData, setFormData] = useState(new FormData());
    const [errorMessage, setErrorMessage] = useState("");
    const modifyModalRef = useRef();
    const addModalRef = useRef();
    const confirmRef = useRef();
    const modifyImageRef = useRef();
    const modifyFormRef = useRef();
    const addFormRef = useRef();
    const addImageRef = useRef();
    const responseRef = useRef();
    const [isUploading, setIsUploading] = useState(false);

    //function for uploading image for a product
    async function handleImageUpload(productId) {
        console.log(formData.get("file"));
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
                    "Cache-Control": "no-cache"
                }
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/Images/upload/product?locationId=${managerLocation.id}&productId=${productId}`, formData, config);
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

    //function for handling product creation
    async function handleCreateProduct() {
        setIsUploading(true);
        try {
            const config = {
              headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` },
            }
            const response = await axios.post(`https://backend.csaposapp.hu/api/products`,{
                name: addFormRef.current.name.value,
                description: addFormRef.current.description.value,
                category: addFormRef.current.category.value,
                price: addFormRef.current.price.value,
                stockQuantity: 10,
                locationId: managerLocation.id
              }, config);
            if (response.status === 201) {
                if (await handleImageUpload(response.data.id)){
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
                return await handleCreateProduct();
              }
              else {
                await logout();
                window.location.reload();
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

    useEffect(() => {
        setMenuState("Products");
    }, []);

    return (
        <div className='w-full grow flex flex-col p-4 gap-8' style={{height: "calc(100vh - 6rem)"}}>

            <div className="flex justify-between items-center">
                <span className='text-5xl font-bold'>Termékek</span>
                <button className='btn btn-info btn-lg' onClick={() => {
                    addModalRef.current.inert = true;
                    addModalRef.current.showModal()
                    addModalRef.current.inert = false;
                }}>Új termék</button>
            </div>

            <div className="grid grid-cols-6 justify-items-center gap-4 overflow-auto">
                {
                    locationProducts?.length > 0 ?
                    locationProducts.map(product => <ProductItem key={product.id} product={product} ref={modifyModalRef}/>) :
                    <span className='text-lg'>Nincsenek termékek</span>
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
                        <span className='text-xl font-bold'>Termék módosítása</span>
                        <button className='btn btn-error' onClick={() => {
                            confirmRef.current.inert = true;
                            confirmRef.current.showModal();
                            confirmRef.current.inert = false;
                        }}>Termék törlése</button>
                    </div>
                    <div className="flex gap-6">
                        {
                            isConversionFinished === false ?
                            <span className="loading loading-spinner text-sky-400 w-20"></span> :
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="relative h-fit w-full aspect-square select-none hover:cursor-pointer" onClick={() => modifyImageRef.current.click()}>
                                    <img src={previewPicture ?? `https://assets.csaposapp.hu/assets/images${selectedProduct.imgUrl}`} className="object-cover p-2 opacity-50 w-full h-full border-2 rounded"/>
                                    <LuImagePlus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12"/>
                                    <input ref={modifyImageRef} type="file" accept='image/*' style={{"display" : "none"}} onChange={(event) => showImagePreview(event)}/>
                                </div>
                                {
                                    errorMessage !== "" &&
                                    <span className='text-red-500'>Valami hiba van a képpel!</span>
                                }
                            </div>
                        }
                        <form ref={modifyFormRef}>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Név</legend>
                                <input type="text" defaultValue={selectedProduct.name} className='input input-lg'/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Leírás</legend>
                                <input type="text" defaultValue={selectedProduct.description} className='input input-lg'/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Ár</legend>
                                <label className='input input-lg'>
                                    <input type="number" min={0} defaultValue={selectedProduct.price}/>
                                    <span className='label'>Ft</span>
                                </label>
                            </fieldset>
                            <input type='submit' value={"Mentés"} className='btn btn-info btn-lg mt-4 w-full'/>
                        </form>
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'><button onClick={() => {
                    modifyFormRef.current.reset();
                    setPreviewPicture(null);
                }}></button></form>
            </dialog>

            

            <dialog className='modal' ref={addModalRef}>
                <div className="modal-box flex flex-col gap-4 max-w-1/2 relative">
                    <LuX className='absolute top-0 left-0 bg-red-500 text-white w-8 h-8 rounded-br cursor-pointer' onClick={() => {
                        addModalRef.current.close();
                        addFormRef.current.reset();
                        setPreviewPicture(null);
                    }}/>
                    <span className='text-xl font-bold'>Termék hozzáadása</span>
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
                                    <span className='text-red-500'>Valami hiba van a képpel!</span>
                                }
                            </div>
                        }
                        <form ref={addFormRef}>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Név</legend>
                                <input type="text" name='name' placeholder='Pl: Pilsner Urquell' className='input input-lg'/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Leírás</legend>
                                <input type="text" name='description' placeholder='Pl: 0.45l korsó' className='input input-lg'/>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Kategória</legend>
                                <select name='category' defaultValue="Válassz egy kategóriát" className="select">
                                    <option disabled={true}>Válassz egy kategóriát</option>
                                    <option>Röviditalok</option>
                                    <option>Sörök</option>
                                    <option>Borok</option>
                                    <option>Koktélok</option>
                                    <option>Üdítők</option>
                                    <option>Nasik</option>
                                </select>
                            </fieldset>
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend text-md'>Ár</legend>
                                <label className='input input-lg'>
                                    <input type="number" name='price' placeholder='Pl: 1290' min={0} />
                                    <span className='label'>Ft</span>
                                </label>
                            </fieldset>
                            {
                                isUploading ? 
                                <button className='btn btn-info btn-lg mt-4 w-full disabled:!text-info-content disabled:!bg-info' disabled>
                                    Hozzáadás
                                    <span className='loading loading-spinner loading-md'></span>
                                </button> :
                                <input type='submit' value={"Hozzáadás"} className='btn btn-info btn-lg mt-4 w-full' onClick={async (event) => {
                                    event.preventDefault();
                                    await handleCreateProduct();
                                }}/>
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
                        <span className='font-bold text-lg'>Sikeres hozzáadás</span>
                        <LuCheck className='h-10 w-10'/>
                    </div>
                </div>
                <form method="dialog" className='modal-backdrop'><button></button></form>
            </dialog>

        </div>
    )
}
