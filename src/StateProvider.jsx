import { createContext, useState } from "react";

const StateContext = createContext();
export default StateContext;

export function TableProvider({ children }) {
    const [selectedGuest, setSelectedGuest] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedEvent, setSelectedEvent] = useState({});

    
    return (
        <StateContext.Provider 
        value={{
        selectedGuest,
        setSelectedGuest,
        selectedProduct,
        setSelectedProduct
        }}>
            {children}
        </StateContext.Provider>
    )
}