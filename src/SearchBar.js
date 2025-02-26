import React, { useContext, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";

function SearchBar({ displayTitle, setRecordsToDisplay, friendSearch, locationSearch }) {
  const { user, locations, friends, logout } = useContext(Context);
  const [searchValue, setSearchValue] = useState("");

  function handleLocationSearch(event) {
    setSearchValue(event.target.value);
    const filteredRecords = locations.filter(record => record.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setRecordsToDisplay(filteredRecords);
  }

  function handleSearch(event) {
    setSearchValue(event.target.value);
    const filteredRecords = friends.filter(record => record.displayName.toLowerCase().includes(event.target.value.toLowerCase()));
    setRecordsToDisplay(filteredRecords);
  }

  async function handleFriendSearch(event) {
    const value = event.target.value;
    setSearchValue(value);
    if (value.trim() !== "" && value.length > 2) {
      try {
        const config = {
          headers : {
            Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
            "Cache-Content": "no-cache"
          }
        };
        const response = await axios.get(`https://backend.csaposapp.hu/api/Users/profile/search/${value}`, config);
        const data = await response.data;
        const filteredRecords = data.filter(record => record.id !== user.id);
        filteredRecords.length > 0 ? setRecordsToDisplay(filteredRecords) : setRecordsToDisplay([]);
      }
      catch (error) {
        if (error.response?.status === 401) {
          if (await getAccessToken()) {
            handleFriendSearch(event);
          }
          else {
            await logout();
            window.location.reload();
          }
        }
        console.log(error.message);
      }
    }
    else {
      setRecordsToDisplay([]);
    }
  }

  return (
    <div className="w-full mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,.5)]">
        <h1 className={`pt-4 mb-2 text-xl ${displayTitle ? "block" : "hidden"}`}>Keresés</h1>
        <div className="relative">
            {
              searchValue.trim() === "" ? 
              <MagnifyingGlassIcon className="h-6 absolute right-3 top-1/2 -translate-y-1/2"/> :
              <XMarkIcon className="h-6 absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:cursor-pointer" onClick={() => {
                setSearchValue("");
                if (friendSearch) setRecordsToDisplay([]);
                else if (locationSearch) setRecordsToDisplay(locations);
                else setRecordsToDisplay(friends);
              }}/>
            }
            <input type="text" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-full font-normal focus:outline-none" placeholder="Keresés" onChange={(event) => {
              if (friendSearch) handleFriendSearch(event);
              else if (locationSearch) handleLocationSearch(event);
              else handleSearch(event);
            }} value={searchValue}/>
        </div>
    </div>
  )
}

export default SearchBar;