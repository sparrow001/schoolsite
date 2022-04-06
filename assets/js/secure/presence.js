import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

// Since I can connect from multiple devices or browser tabs, we store each connection instance separately
// any time that connectionsRef's value is null (i.e. has no children) I am offline
const firebaseConfig = {
    apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
    authDomain: "school-site-b799d.firebaseapp.com",
    projectId: "school-site-b799d",
    storageBucket: "school-site-b799d.appspot.com",
    messagingSenderId: "704109356346",
    appId: "1:704109356346:web:be6a9266093b06dbd81c03",
    measurementId: "G-VXQWNZJ3MX"
  };
const app = initializeApp(firebaseConfig);
let auth = getAuth(app)
let id
auth.onAuthStateChanged(user =>{
    if(user){
        id = user.uid
    }
    else{
    }
})
const db = getDatabase();

const connectedRef = ref(db, '.info/connected');
export function setPresenceListener() {
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {

            const myConnectionsRef = ref(db, `users/${id}/connections`);

            // stores the timestamp of my last disconnect (the last time I was seen online)
            const lastOnlineRef = ref(db, `/users/${id}/lastOnline`);
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            const con = push(myConnectionsRef);
            // When I disconnect, remove this device
            onDisconnect(con).remove();

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            set(con, true);

            // When I disconnect, update the last time I was seen online
            onDisconnect(lastOnlineRef).set(serverTimestamp());
        }
    });
}