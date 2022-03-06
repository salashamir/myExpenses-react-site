import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
// hook to consume context in components, external logic instead of doing it in every component

export const useAuthContext = () => {
  // consume context
  // returns object with user properties and dispatch function
  const context = useContext(AuthContext);
  // we wont get an error since we're wrapping our whole app with the context
  if (!context) {
    throw new Error("useAuthContext must be inside an AuthContextProvider");
  }

  return context;
};
