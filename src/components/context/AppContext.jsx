import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  return (
    <AppContext.Provider value={{ isFirstLoad, setIsFirstLoad }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
