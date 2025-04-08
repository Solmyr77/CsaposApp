import React, { useContext, useEffect, useState } from 'react'
import Context from "./Context";
import { useNavigate } from 'react-router-dom';

export default function LogoutMenu() {
    const { setMenuState, logout } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        setIsLoading(true);
        await logout();
        setIsLoading(false);
        navigate("/");
    }

    useEffect(() => {
        setMenuState("Logout");
    }, []);

    return (
        <div className="flex h-full justify-center items-center">

            <div className="flex flex-col justify-center items-center gap-8">
                <span className='text-3xl font-bold'>Biztosan kijelentkezel?</span>
                <div className="flex items-center gap-8">
                    <button className='btn btn-error btn-xl' onClick={() => handleLogout()}>
                        Igen
                        {
                            isLoading &&
                            <span className='loading loading-spinner loading-md'></span>
                        }
                    </button>
                    <button className='btn btn-xl'>Mégsem</button>
                </div>
            </div>

        </div>
    )
}
