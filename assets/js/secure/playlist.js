import { getCookie, getUserPlaylists, appendNewPlaylistDiv } from "../functions.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"




document.getElementById("playlist-click").addEventListener("click", playlist);
document.getElementById("closebutton").addEventListener("click", close);
document.getElementById("playlist-add").addEventListener("click", addPlaylistInputOpener);

function getPlaylists() {
    getUserPlaylists(getCookie("user"));
}

function addPlaylistInputOpener() {
    let addPlaylistForm = document.getElementById("addPlaylistForm");
    let normalForm = document.getElementById("regularForm");
    let image = document.getElementById("add-playlist-image");
    let text = document.getElementById("add-playlist-text");
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
    addPlaylistForm.style.display = "none";
    normalForm.style.display = "block";
    image.src = "../assets/img/general/plus.svg";
    text.innerHTML = "Add Playlists";
    document.getElementById("playlist-add").removeEventListener("click", addPlaylistInputCloser);
    document.getElementById("playlist-add").addEventListener("click", addPlaylistInputOpener);
}

function appendPlaylists() {
    let maindiv = document.getElementById("playlistContainer");
    let playlistDiv = document.createElement('div');
    playlistDiv.className = "modal-playlist-item";
    let playlistLink = document.createElement('a');
    let playlistImage = document.createElement('img');
    playlistImage.src = "../assets/img/secure/list.svg";
    playlistImage.className = "modal-playlist-image";
    playlistImage.alt = "Document"
    let playlistText = document.createElement('p')
    playlistText.className = "modal-playlist-text";
    playlistText.innerHTML = "testers";
  
    playlistLink.appendChild(playlistImage);
    playlistLink.appendChild(playlistText);
    playlistDiv.appendChild(playlistLink);
    maindiv.appendChild(playlistDiv);
}
function close() {
    var container = document.getElementById("playlistContainer");
    var modal = document.getElementById("modal")
    var closebutton = document.getElementById("closebutton")
    modal.style.display = "none";
    container.style.display = "none";
    closebutton.style.display = "none";
}
function playlist() {
    var container = document.getElementById("playlistContainer");
    var modal = document.getElementById("modal")
    var closebutton = document.getElementById("closebutton")
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