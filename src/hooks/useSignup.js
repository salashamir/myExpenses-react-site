import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
// context hook custom
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  // get dispatch function from consuming our authcontext with the custom useauthcontexthook
  const { dispatch } = useAuthContext();

  const signup = async (email, password, confirmPassword, displayName) => {
    setError(null);
    setIsPending(true);
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords must be identical.");
      }
      // signup user
      // projectauth is an object w methods/properties
      // create user first of all
      // firebase automatically logs user in when they sign up on the backend: after we want to dispatch a login ction and update the user on our auth state
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }
      // update profile of created user and add displayname property
      await res.user.updateProfile({ displayName });
      // dispatch login action; wehne we do this it fires the authreducer and passes in the action object form dispatch into the authreducer function and will update state to our signuped user
      dispatch({ type: "LOGIN", payload: res.user });

      // update state only if component mounted
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    // return cleanup function
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
