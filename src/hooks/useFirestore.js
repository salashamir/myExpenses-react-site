// custom hook: add new documents to a firestore colelction or remove documents from a firestore collection
// import hooks
import { useReducer, useEffect, useState } from "react";
// import firestore obejct
import { projectFirestore, timeStamp } from "../firebase/config";

// initial state, outside of hook bc we dont need to make new copy of it every time hook used
let initialState = {
  // when request made to add document, firestore will sne dback reponse object w document just created
  document: null,
  isPending: false,
  error: null,
  success: null,
};

// reducer function
const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      // just explicitly resetting state
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        // reset error
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
// accept collection as arg: makes it more reusable
// this hook is about adding or deleting docs
export const useFirestore = (collection) => {
  // state
  // response is state that represents response we get back from firestore when we make request; wont be exact response but custom state object representing it
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collectionr ref
  const ref = projectFirestore.collection(collection);

  //only dispatch if iscancelled false
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };
  // add doc
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });
    try {
      // creates timestamp data object with current date
      const createdAt = timeStamp.fromDate(new Date());
      // add method reutnrs document reference to doc we just added
      const addedDoc = await ref.add({ ...doc, createdAt });
      //  we onl want to update state when comopnent is mounted, ie iscancelled is false; remember disptahc updates state
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDoc });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete doc
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });
    // DELETE DOC
    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete" });
    }
  };

  // useffect for our cleanup func: useffect will run only once when component using our hook first mounts to the DOM/evaluates
  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { addDocument, deleteDocument, response };
};
