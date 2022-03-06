import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiEDDJh6hkfaMBfwZF94F2fGzAPh6vrGI",
  authDomain: "myexpenses-ae975.firebaseapp.com",
  projectId: "myexpenses-ae975",
  storageBucket: "myexpenses-ae975.appspot.com",
  messagingSenderId: "117312259188",
  appId: "1:117312259188:web:fe13069f9abf0336d47d21",
};

// init
firebase.initializeApp(firebaseConfig);

// init firestore
const projectFirestore = firebase.firestore();
// init auth
const projectAuth = firebase.auth();

// this returnsfunction stored in our timeStamp const, when we invooke it in future it will create a Timestamp data property
const timeStamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timeStamp };
