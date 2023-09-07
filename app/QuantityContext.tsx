import React, { createContext, useContext, useState } from 'react';

const QuantityContext = createContext<any>(null);

export const useQuantityContext = () => {
    return useContext(QuantityContext);
};

export const QuantityProvider: React.FC = ({ children }) => {
    const [quantityContx, setquantityContx] = useState(1);
    const [cartQuantityContext, setCartQuantityContext] = useState([]);

    const updateCartQuantity = (cart: any) => {
        setCartQuantityContext(cart);
    };

    const updateQuantity = (newValue: any) => {
        setquantityContx(newValue);
    };


    return (
        <QuantityContext.Provider value={{
            quantityContx, setquantityContx, updateQuantity,
            cartQuantityContext, setCartQuantityContext,
            updateCartQuantity
        }}>
            {children}
        </QuantityContext.Provider>
    );
};
