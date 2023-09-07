import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [someValue, setSomeValue] = useState('');
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [quantityAboveCart, setQuantityAboveCart] = useState(0);
  const [cartQuantity, setCartQuantity] = useState([]);
  const [productpage, setProductpage] = useState({});
  const [language, setLanguage] = useState('');
  const [yearPH, setYear] = useState('');
  const [dayPH, setDay] = useState('');
  const [monthPH, setMonth] = useState('');



  const updateSomeValue = (newValue) => {
    setSomeValue(newValue);
  };


  const updateQinCart = (newValue) => {
    setQuantityInCart(newValue);
  };

  const updateQaboveCart = (newValue) => {
    setQuantityAboveCart(newValue);
  };

  const updateCartQuantity = (newValue) => {
    setCartQuantity(newValue);
  };

  const updateProductpage = (newValue) => {
    setProductpage(newValue);
  };

  const updateLanguage = (newValue) => {
    setLanguage(newValue);
  };

  const updateYearPlaceholder = (newValue) => {
    setYear(newValue);
  };

  const updateDayPH = (newValue) => {
    setDay(newValue);
  };

  const updateMonthPH = (newValue) => {
    setMonth(newValue);
  };

  return (
    <AppContext.Provider value={{
      someValue, updateSomeValue, quantityInCart, updateQinCart,
      quantityAboveCart, updateQaboveCart, cartQuantity, setCartQuantity, language, updateLanguage,
      productpage, updateProductpage, yearPH, updateYearPlaceholder, dayPH, updateDayPH,
      monthPH, updateMonthPH
    }}>
      {children}
    </AppContext.Provider>
  );
};
