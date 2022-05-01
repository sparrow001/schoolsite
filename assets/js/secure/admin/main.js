import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
  authDomain: "school-site-b799d.firebaseapp.com",
  projectId: "school-site-b799d",
  storageBucket: "school-site-b799d.appspot.com",
  messagingSenderId: "704109356346",
  appId: "1:704109356346:web:be6a9266093b06dbd81c03",
  measurementId: "G-VXQWNZJ3MX",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

let sub = await get(child(ref(db), "admin/namesubmit")).then((snapshot) => {
  let final = [];
  let names = snapshot.val();
  for (let i in names) {
    let name = names[i];
    if (name == "ValueHolder") {
      continue;
    }
    final.push(name);
  }
  if (final.length == 0) {document.getElementById("subcontent").innerHTML = "No Submissions"}
  document.getElementById("subcontent").innerHTML = JSON.stringify(final);
});

let req = await get(child(ref(db), "admin/namereq")).then((snapshot) => {
  let final = [];
  let names = snapshot.val();
  for (let i in names) {
    let name = names[i];
    if (name == "ValueHolder") {
      continue;
    }
    final.push(name);
  }
  if (final.length == 0) {document.getElementById("reqcontent").innerHTML = "No Requests"}
  document.getElementById("reqcontent").innerHTML = JSON.stringify(final);
});
