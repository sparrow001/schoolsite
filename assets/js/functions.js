import { getDatabase, ref, onValue, get, child, set, update } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"
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

function getUserInfo() {
  let string = localStorage.getItem("UserComplex")
  let user = JSON.parse(string)
  return user
}

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

export function writeNewPlaylist(songs, name) {
    songs = songs.split(",");
    if (songs instanceof Array) {
    }else {
      return new Error("songs must be array")
    }
    if (name == null) {
      return new Error("name cannot be null")
    }
    let db = getDatabase();
    const userRef = ref(db, "users/" + getUserInfo().uid + "/" + "playlists/" + btoa(name.toLowerCase()));
    const newPlaylist = {
        name: btoa(name),
        songs: songs
    };
    return update(userRef, newPlaylist)
}

export function getUserFromUid(uid, type="none") {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `users/${uid}`)).then(snapshot => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
export function readUserData(email, type="general") {
  const dbRef = ref(getDatabase());
  if (type=="general") {
    return get(child(dbRef, `users/${getUserInfo().uid}`)).then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  else if (type=="playlists") {
    return get(child(dbRef, `users/${getUserInfo().uid}/playlists`)).then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  
}

export async function request(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
