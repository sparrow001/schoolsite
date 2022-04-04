import { getCookie, writeNewPlaylist, readUserData } from "../functions.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"

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



document.getElementById("playlist-click").addEventListener("click", playlist);
document.getElementById("closebutton").addEventListener("click", close);
document.getElementById("playlist-add").addEventListener("click", addPlaylistInputOpener);
document.getElementById("addmedsub").addEventListener("click", newPlaylist);

function appendDivs() {
    var playlistData = readUserData("", "playlists");
    playlistData.then((data) => {
        for (let i in data) {
            appendPlaylist(data[i].name);
        }
    })
}

$(document).ready(function () {
    appendDivs();
});


function newPlaylist() {
    let password = document.getElementById("pass"); 
    const promise = signInWithEmailAndPassword(auth, JSON.parse(localStorage.getItem("UserComplex").email), password.value);
    promise.catch((e) => {
        error(e.message)
        return
    });
    promise.then((data) => {
        let pname = document.getElementById("pname").value;
        let songlist = document.getElementById("songs").value.replace(/\s/g, '').split(",");
        songlist = songlist.join("\n")
        const regex = /(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/gm;
        let m;
        let results = []
        while ((m = regex.exec(songlist)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex == 1) {
                    results.push(match)
                }
                else {
                }
            });
        }
        
        results = results.join(",")
        writeNewPlaylist(results, pname);
        pname = document.getElementById("pname");
        songlist = document.getElementById("songs")
        password.value = "";
        pname.value = "";
        songlist.value = "";
    });
}

function error(errorMSG, context = "") {
    const msg = "Error: " + errorMSG.split("/")[1].split(")")[0];
    let errmsg = document.getElementById("errormsg")
    errmsg.innerHTML = msg;
}

function addPlaylistInputOpener() {
    let addPlaylistForm = document.getElementById("addPlaylistForm");
    let normalForm = document.getElementById("regularForm");
    let image = document.getElementById("add-playlist-image");
    let text = document.getElementById("add-playlist-text");
    let modal = document.getElementById("playlist-click")
    modal.style.display = "none"
    addPlaylistForm.style.display = "block";
    normalForm.style.display = "none";
    image.src = "../assets/img/general/corner-down-left.svg";
    text.innerHTML = "Cancel";
    
    document.getElementById("playlist-add").removeEventListener("click", addPlaylistInputOpener);
    document.getElementById("playlist-add").addEventListener("click", addPlaylistInputCloser);
}

function addPlaylistInputCloser() {
    let addPlaylistForm = document.getElementById("addPlaylistForm");
    let normalForm = document.getElementById("regularForm");
    let image = document.getElementById("add-playlist-image");
    let text = document.getElementById("add-playlist-text");
    let modal = document.getElementById("playlist-click")
    addPlaylistForm.style.display = "none";
    normalForm.style.display = "block";
    image.src = "../assets/img/general/plus.svg";
    text.innerHTML = "Add Playlists";
    modal.style.display = "inline-block"
    document.getElementById("playlist-add").removeEventListener("click", addPlaylistInputCloser);
    document.getElementById("playlist-add").addEventListener("click", addPlaylistInputOpener);
}

function appendPlaylist(name) {
    let maindiv = document.getElementById("playlistContainer");
    let playlistDiv = document.createElement('div');
    playlistDiv.className = "modal-playlist-item";
    playlistDiv.setAttribute("id", name);
    let playlistLink = document.createElement('a');
    let playlistImage = document.createElement('img');
    playlistImage.src = "../assets/img/secure/list.svg";
    playlistImage.className = "modal-playlist-image";
    playlistImage.alt = "Document"
    playlistLink.style.textDecoration = "none";
    let playlistText = document.createElement('p')
    playlistText.className = "modal-playlist-text";
    playlistText.innerHTML = atob(name);
  
    playlistLink.appendChild(playlistImage);
    playlistLink.appendChild(playlistText);
    playlistDiv.appendChild(playlistLink);
    maindiv.appendChild(playlistDiv);
}
function close() {
    var container = document.getElementById("playlistContainer");
    var modal = document.getElementById("modal")
    var closebutton = document.getElementById("closebutton")
    document.getElementsByTagName("body")[0].style.overflow = "auto";
    modal.style.display = "none";
    container.style.display = "none";
    closebutton.style.display = "none";
}
function playlist() {
    var container = document.getElementById("playlistContainer");
    var modal = document.getElementById("modal")
    var closebutton = document.getElementById("closebutton")
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    modal.style.display = "block";
    container.style.display = "block";
    closebutton.style.display = "block";
    
    
}
// function share() {
//     var user = getCookie("user")
//     var fname = document.getElementById("sharefirst").value;
//     var lname = document.getElementById("sharelast").value;
//     var phone = document.getElementById("sharephone").value;
//     var email = document.getElementById("shareemail").value;
//     const db = getDatabase();
//     if (fname != "" && lname != "" && email != "") {
//         try {
//             set(ref(db, 'sharereq/' + btoa(email)), {
//                 requestby: btoa(user),
//                 first_name: fname,
//                 last_name: lname,
//                 phone: phone
//             });
//             alert("Success!")
//         }catch(e){
//             document.getElementById("er").innerHTML = "Error: " + e;
//         }
//     } else {
//         document.getElementById("er").innerHTML = "Please fill in all required fields (marked with *)";
//     }
// }