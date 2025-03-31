import { createContext, useState } from "react";

const TableContext = createContext();
export default TableContext;

export function TableProvider({ children }) {
    const [selectedGuest, setSelectedGuest] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});

    return (
        <TableContext.Provider 
        value={{
        selectedGuest,
        setSelectedGuest,
        selectedProduct,
        setSelectedProduct
        }}>
            {children}
        </TableContext.Provider>
    )
}