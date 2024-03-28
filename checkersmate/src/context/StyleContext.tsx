import React, { createContext, useContext, ReactNode, FC } from "react";
import backgroundImage from "../assets/img/background.png";

/**
 * Defines the types of actions that can be performed with the `StyleContext`, including changing
 * the body background.
 */
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

/**
 * `StyleProvider` is a component that wraps around parts of the application that might require
 * access to the `StyleContext`. It provides a `changeBodyBackground` function that takes a string
 * argument and updates the body background accordingly. If the argument is a URL (starts with "http"),
 * it sets it as a background image. If it's a direct reference to an image file (ends with ".png"),
 * it uses a predefined background image. Otherwise, it treats the argument as a color and applies it
 * as the background color.
 *
 * @param {StyleProviderProps} props - Contains the children elements that will have access to the context.
 * @returns A `StyleProvider` component wrapping its children, providing them access to style functionalities.
 */
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

/**
 * Custom hook to provide easy access to the `StyleContext`. It can be used by components to
 * change the body background without directly interacting with the context provider.
 *
 * @returns The `changeBodyBackground` function from `StyleContext`.
 */
export const useStyle = () => useContext(StyleContext);
