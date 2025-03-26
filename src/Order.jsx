import React from "react";

function Order() {
  return (
    <div className="flex flex-col bg-sky-200/75 p-2 rounded-md">
        <div className="self-end badge badge-warning font-bold">Teljesítendő</div>
        {/* Order items */}

        <div className="flex flex-col gap-4">

        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
            <img src="https://assets.csaposapp.hu/assets/images/60d6b130-dd78-401d-ae22-ff910d2de993.webp" alt="kép" className="w-16 rounded-md"/>
            <div className="flex flex-col">
                <span className="text-lg font-bold">Pilsner Urquell</span>
                <span>0.5l korsó</span>
            </div>
            </div>
            <span className="font-bold">1200 Ft</span>
            <span className="text-lg font-bold">2 DB</span>
        </div>

        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
            <img src="https://assets.csaposapp.hu/assets/images/60d6b130-dd78-401d-ae22-ff910d2de993.webp" alt="kép" className="w-16 rounded-md"/>
            <div className="flex flex-col">
                <span className="text-lg font-bold">Pilsner Urquell</span>
                <span>0.5l korsó</span>
            </div>
            </div>
            <span className="font-bold">1200 Ft</span>
            <span className="text-lg font-bold">2 DB</span>
        </div>

        <span className="self-end font-bold text-md">Összesen: 2400 Ft</span>
        </div>
        <button className="btn bg-success border-0 shadow-none mt-4 text-md h-12">Teljesítés!</button>
    </div>
  )
}

export default Order;
