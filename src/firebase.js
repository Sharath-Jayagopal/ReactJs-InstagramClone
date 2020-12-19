import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBrf3RaVazp2BhzLzeHu4q0ujyR8GnrPAo",
    authDomain: "instagram-clone-react-5cd34.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-5cd34-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-5cd34",
    storageBucket: "instagram-clone-react-5cd34.appspot.com",
    messagingSenderId: "544946153138",
    appId: "1:544946153138:web:6802add52d6d97854a4bab",
    measurementId: "G-PSG4PM3RZB"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

export  {db,auth,storage}

