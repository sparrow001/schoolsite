import { getDatabase, ref, onValue, get, child, set} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
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



export function setcookiehour(name, value) {
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + 
    '; expires=' + now.toUTCString() + 
    '; path=/';
}

export function getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cname) == 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
}

export function deleteCookie(name) {
    name = name.toLowerCase();
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
    if (name=="user") {
        window.location.replace("../index.html");
    }
}

export function updateUserData(data) {
    setcookiehour("user", data.email);
    document.getElementById("#welcome").innerHTML = document.getElementById("#welcome").innerHTML + " " + data.display_name;
    document.getElementById("#description").innerHTML = data.token;
}
export function startReadUserData(email) {
    let db = getDatabase();
    const userRef = ref(db, "users/" + btoa(email));
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      updateUserData(data);
    })
}

export function readUserData(email) {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `users/${btoa(email)}`)).then(snapshot => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  
}