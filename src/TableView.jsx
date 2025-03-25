import React from "react";
import { useParams } from "react-router-dom";

function TableView() {
  const { number } = useParams();
  return (
    <div className="flex flex-col grow p-4 gap-5">
      <div className="flex justify-between items-center">
        <span className="text-5xl font-bold">Asztal {number}</span>
        <button className="btn btn-error disabled:!btn-error disabled:!bg-error disabled:opacity-50" disabled>Asztal felszabadítása</button>
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div className="flex flex-col border-2 rounded-md p-2 gap-4 col-span-2">
          <span className="text-xl font-bold">Vendégek</span>
          <div className="flex flex-col gap-4 overflow-auto">

            {/* Guest items */}
            <div className="flex w-full justify-between items-center p-2 rounded-md bg-sky-200/75 cursor-pointer">
              <div className="flex gap-2 items-center">
                <img src="https://assets.csaposapp.hu/assets/images/60d6b130-dd78-401d-ae22-ff910d2de993.webp" alt="kép" className="w-16 rounded-md"/>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Vendég 1</span>
                  <span className="text-md">admin</span>
                </div>
              </div>
              <div className="badge badge-success text-nowrap font-bold">Fizetett</div>
            </div>

            <div className="flex w-full justify-between items-center p-2">
              <div className="flex gap-2 items-center">
                <img src="https://assets.csaposapp.hu/assets/images/60d6b130-dd78-401d-ae22-ff910d2de993.webp" alt="kép" className="w-16 rounded-md"/>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Vendég 2</span>
                  <span className="text-md">admin</span>
                </div>
              </div>
              <div className="badge badge-warning text-nowrap font-bold">Nem fizetett</div>
            </div>

          </div>
        </div>

        <div className="flex flex-col border-2 rounded-md p-2 gap-4 col-span-3 row-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Rendelések</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">Vendég 1</span>
              <button className="btn text-md font-bold border-2">Összes</button>
            </div>
          </div>
          <div className="flex flex-col gap-4 overflow-auto">
            {/* Order */}

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

          </div>
          <span className="text-lg font-bold self-end">Összesen: 2400 Ft</span>
        </div>

      </div>
    </div>
  )
}

export default TableView;
