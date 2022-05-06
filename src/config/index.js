import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "firebase/app";
import { authState } from "rxfire/auth";
import { collectionData, docData } from "rxfire/firestore";
import { filter } from "rxjs/operators";

const firebaseConfig = {
  apiKey: "AIzaSyA_sCJSwYGON--abjby-OLouYOPJZJWXTA",
  authDomain: "ositasite.firebaseapp.com",
  projectId: "ositasite",
  storageBucket: "ositasite.appspot.com",
  messagingSenderId: "663725486111",
  appId: "1:663725486111:web:2860b35293067e1475a52a"
};
const app = firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore(app);
const storage = firebase.storage(app);
const auth = firebase.auth(app);
const loggedIn$ = authState(auth).pipe(filter((user) => !!user));

export { app, auth, firestore, storage, collectionData, docData, loggedIn$ };
export default firebase;

export const addresses = (crypto) => {
  switch (crypto) {
    case "BTC":
      return "bc1qrl350neqd7lqsq2atrmt6kznpytpnx309qg773";
    case "ETH":
      return "bc1qrl350neqd7lqsq2atrmt6kznpytpnx309qg773";
    default:
      return "bc1qrl350neqd7lqsq2atrmt6kznpytpnx309qg773";
  }
};
