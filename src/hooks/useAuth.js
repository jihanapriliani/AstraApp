import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import FIREBASE from '../config/firebase';

import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = getAuth(FIREBASE);

export function useAuth() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user,null, 2));
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user,
  };
}