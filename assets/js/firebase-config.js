const firebaseConfig = {
  apiKey: "AIzaSyDIiBi9xN6GuIm1zCNrij_oPtfaOx3MgYE",
  authDomain: "zppsu-cashless-canteen.firebaseapp.com",
  projectId: "zppsu-cashless-canteen",
  storageBucket: "zppsu-cashless-canteen.firebasestorage.app",
  messagingSenderId: "228311754408",
  appId: "1:228311754408:web:9effc11cccd24e9c63449d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
// NO STORAGE NEEDED