import { getCookie, deleteCookie, readUserData } from './functions.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";

const user = getCookie("user");
var data = readUserData(user);
var playlistData = readUserData(user, "playlists");
if(user == '') {
    window.location.replace("../index.html");
}else {
    data.then(data => {
        localStorage.setItem('User', JSON.stringify(data));
        localStorage.setItem('Playlists', JSON.stringify(playlistData));
    })
}


const firebaseConfig = {
    apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
    authDomain: "school-site-b799d.firebaseapp.com",
    projectId: "school-site-b799d",
    storageBucket: "school-site-b799d.appspot.com",
    messagingSenderId: "704109356346",
    appId: "1:704109356346:web:be6a9266093b06dbd81c03",
    measurementId: "G-VXQWNZJ3MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.onbeforeunload = function() {
    deleteCookie("user");
    signOut(auth)
}


let welcome = document.getElementById("welcome")
let avatar = document.getElementById("avatarImg")
data.then(function(data) {
    try {
        welcome.innerHTML = welcome.innerHTML + " " + data.display_name;
    }
    catch(e) {
        if (e instanceof TypeError) {
            console.log("No Welcome header found");
        } else {
            console.log(e)
        }
    }
})
if (JSON.parse(localStorage.getItem("UserComplex")).photoURL != "" || JSON.parse(localStorage.getItem("UserComplex")).photoURL != null) {
    avatar.src = JSON.parse(localStorage.getItem("UserComplex")).photoURL;
}


function clickOrigin(e){
    var target = e.target;
    var tag = [];
    tag.tagType = target.tagName.toLowerCase();
    tag.tagClass = target.className.split(' ');
    tag.id = target.id;
    tag.parent = target.parentNode;
    try {
    tag.href = target.getAttribute('href');
    } catch(err) {
        tag.href = "";
    }

    return tag;
}

var tagsToIdentify = ['img','a'];

document.body.onclick = function(e){
    let elem = clickOrigin(e);

    for (let i=0;i<tagsToIdentify.length;i++){
        if (elem.tagType == tagsToIdentify[i]){
            window.onbeforeunload = null
        }
    }
};