// createcontext to create context and usereducer to manage our state
import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

// we want to store use object with json web token we get back when we signup a user into global context so we have access to token, name, email to display diff content
export const AuthContext = createContext();

// reducer function: function responsible for updating our state, called when the dispathc function with action object is involked
export const authReducer = (state, action) => {
  switch (action.type) {
    // if action type doesnt match any of the cases
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

// create custom authcontext provider component
export const AuthContextProvider = ({ children }) => {
  // first arg: function to control state
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    // property to be used inside app.js, we dont want to render any components until authisready is true: turn authisready to true once we know whther user logged in or not, then we can render all our component tree to show correct page based on authentication status
    authIsReady: false,
  });

  useEffect(() => {
    // method communicates w firebase, tells us whenever theres some kind of change in authetnication status, then fire function, inside function take in user, user will be null if the authetnicatio action is logging out; this will fire also once when we first connect.
    const unsub = projectAuth.onAuthStateChanged((user) => {
      // dispatch an action
      // payload will either be user is user logged in or null if not
      // we only need to do this once initially, perform dispatch once, then we want to cancel so prevent further disptaches
      dispatch({ type: "AUTH_IS_READY", payload: user });
      // unsubscribe so it enver fires again, only perform check once
      unsub();
    });
  }, []);
  console.log("AuthContext state:", state);
  // soread out properties from state which will be a user object
  // add dispatch function so later on when we creta custom hooks to control singup, logout, we can use dispatch function inside hooks directly to update context value
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
