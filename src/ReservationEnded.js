import React from "react";

function ReservationEnded() {
  return (
    <div className="w-full min-h-screen bg-grey text-white p-4 flex flex-col items-center select-none">
        <span className="text-xxl font-bold bg-gradient-to-t from-blue to-sky-400 text-transparent bg-clip-text mt-8 text-center leading-none">Foglalás sikeresen lezárva!</span>
        <img src="https://assets.csaposapp.hu/assets/images/28c9767c-cc7c-4948-836a-512a749df074.webp" alt="kép" className="rounded-md w-1/2 mt-8"/>
        <span className="font-bold text-lg mt-2">Félidő Söröző</span>
    </div>
  )
}

export default ReservationEnded;
