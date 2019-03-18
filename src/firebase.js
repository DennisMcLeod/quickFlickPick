import firebase from 'firebase';
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB2G2Io-AxiS1jx1YQdEQSSb9B4uWxHyDs",
    authDomain: "test-fc658.firebaseapp.com",
    databaseURL: "https://test-fc658.firebaseio.com",
    projectId: "test-fc658",
    storageBucket: "test-fc658.appspot.com",
    messagingSenderId: "649857958611"
};
firebase.initializeApp(config);


export default firebase