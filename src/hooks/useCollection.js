import { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../firebase/config";
// this hook will be about subscribing to real time data from a firestore collection
// query as second arg
export const useCollection = (collection, _query, _orderBy) => {
  // state
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  // ref to prevent infinite loop from query array which is referrence type
  // wrap reference type in useref so react doesnt see it as different w every component reevaluation, wont cause infinite loop
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  // will fire whenever collection changes
  // new subscription to collection will be set whenever collction data changes
  // putting all logic for setting up realtime listener in useffect bc we want code to run right away on first evaluation, component mount, useefect fires as soon as component using this useCollection hook mounts to DOM
  useEffect(() => {
    // use let bc refrence might be updated in future
    // base collection ref so that fi we dont use query it will just bypas the following if check
    let ref = projectFirestore.collection(collection);

    if (query) {
      ref = ref.where(...query);
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    // set up realtime listener
    // will fire a function for us everytime we get a snapshot back from firestore collection: we get snapshot first initually when conncetion first made, thereafter will fire again wheneber collection changes. snapshot contains all docs
    // update state every time we get a snapshot back
    const unsub = ref.onSnapshot(
      (snapshot) => {
        // cycle thru docs inside snapshot and sync w our state
        let results = [];
        // array of docs from snapshot
        snapshot.docs.forEach((doc) => {
          // used to get data from doc + add on id property, not to be confused with uid which is user id
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        //  we have data at this point, no error anymore
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch data");
      }
    );

    // unscubscribe on unmount so we're not trying to update state of unmounted component = error
    return () => unsub();
  }, [collection, query, orderBy]);

  // values returned from usecollection hook
  return { documents, error };
};
