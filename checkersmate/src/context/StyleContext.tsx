import React, { createContext, useContext, ReactNode, FC } from "react";
import backgroundImage from "../assets/img/background.png";

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
      document.body.style.backgroundColor = "#381200";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    } else if (background.endsWith(".png")) {
      document.body.style.backgroundImage = `url('${backgroundImage}')`;
      document.body.style.backgroundColor = "#381200";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.position = "50%";
    } else {
      document.body.style.backgroundColor = background;
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundAttachment = "";
    }
  };

  return (
    <StyleContext.Provider value={{ changeBodyBackground }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
