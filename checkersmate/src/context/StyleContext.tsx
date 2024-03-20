import React, { createContext, useContext, ReactNode, FC } from "react";

interface StyleContextType {
  changeBodyBackground: (background: string) => void;
}

const defaultState: StyleContextType = {
  changeBodyBackground: () => {},
};

const StyleContext = createContext<StyleContextType>(defaultState);

interface StyleProviderProps {
  children: ReactNode;
}

export const StyleProvider: FC<StyleProviderProps> = ({ children }) => {
  const changeBodyBackground = (background: string) => {
    if (background.startsWith("http")) {
      document.body.style.backgroundImage = `url('${background}')`;
      document.body.style.backgroundColor = "#401a00";
      // document.body.style.backgroundRepeat = "no-repeat";
      // document.body.style.backgroundSize = "cover";
    } else {
      document.body.style.backgroundColor = background;
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
    }
  };

  return (
    <StyleContext.Provider value={{ changeBodyBackground }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
