import { getAuth, updateProfile, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js';
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js';
import { getFirestore, collection, onSnapshot, orderBy, query, doc } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
import { getUnaccessedRooms, getRestOfRooms, getRoomDataFromRoomId, sendMessage, addNewDMRoom, setRoomAsRead } from "./msgfunctions.js";
import { getUserFromUid, getCookie } from "../functions.js";

const config = {
    apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
    authDomain: "school-site-b799d.firebaseapp.com",
    projectId: "school-site-b799d",
    storageBucket: "school-site-b799d.appspot.com",
    messagingSenderId: "704109356346",
    appId: "1:704109356346:web:be6a9266093b06dbd81c03",
    measurementId: "G-VXQWNZJ3MX"
};

const app = initializeApp(config);
const auth = getAuth(app);
document.getElementById("messagesend").addEventListener("click", handleSend);
document.getElementById("addnewroom").addEventListener("click", newroombutton);
document.getElementById("closebutton").addEventListener("click", closemodal);
document.getElementById("addroomsubmit").addEventListener("click", () => {
    handlenewroom()
});


(async () => {
    await handleAppendagesOfRooms()
    addRoomClickEventListeners()
}) ();

function closemodal() {
    let modal = document.getElementById("modal")
    let modalcontent = document.getElementById("addroominputs")
    modal.style.display = "none"
    modalcontent.style.display = "none"
}

function profileUpdate() {
    let uid = "CmOQAlz2rvYg75U7R9mjxcEu0ik2"
    let storage = getStorage();
    var storageRef = ref(storage, 'users/' + uid + '/av.png');
    console.log(storageRef)
    getDownloadURL(storageRef).then(function(url) {
        console.log(url);
        let imageURL = url;

        var user = auth.currentUser;
        updateProfile(user, { photoURL: imageURL })
            .then(function() { console.log(user) })
            .catch(function(error) { console.log(error) });
    })
    console.log(auth.currentUser)
}

async function getMessagesForRoom(roomid) {
    if (document.getElementById(roomid).className == "roomitemselected") {
        return
    }
    const existing = document.querySelectorAll('.messageitem');
    existing.forEach(message => {
        message.remove()
    });
    let name = document.getElementById("actualname")
    name.innerHTML = document.getElementById(roomid).innerText
    const recentMessagesQuery = query(collection(getFirestore(), 'rooms/' + roomid + "/messages"), orderBy('timestamp', 'asc'));
  
    // Start listening to the query.
    let listener = onSnapshot(recentMessagesQuery, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === 'removed') {
        //   deleteMessage(change.doc.id);
        } else {
          var message = change.doc.data();
          if (!snapshot.metadata.hasPendingWrites) {
            appendMessageDiv(message.authoruid, message.content);
          }
        }
      });
    });
    var wait = function(condFunc, readyFunc, checkInterval) {
        var checkFunc = function() {
            if(condFunc()) {
                readyFunc(); 
            }
            else
            {
                setTimeout(checkFunc, checkInterval);
            }
        };
        checkFunc();
    };
    wait(
        function() { return document.getElementById(roomid).className != "roomitem roomitemselected" }, 
        function() { listener();},
        100
    );


}
async function handleAppendagesOfRooms() {
    let usercomplex = JSON.parse(localStorage.getItem('UserComplex'));
    let roomnames = []
    let room = await getUnaccessedRooms(usercomplex.uid)
    for (let i in room) {
        const data = await getRoomDataFromRoomId(room[i].id)
        if (data.name != null) {
            roomnames.push({name: data.name, id: room[i].id.replace(/\s/g, '')})
        }   
    }
    room = await getRestOfRooms(usercomplex.uid)
    for (let i in room) {
        const data = await getRoomDataFromRoomId(room[i].id)
        if (data.name != null) {
            roomnames.push({name: data.name, id: room[i].id.replace(/\s/g, '')})
        }   
    }

    for (let i = 0; i < roomnames.length; i++) {
        appendRoomDiv(roomnames[i].id, roomnames[i].name)
    }
}

async function redoAppendagesAfterAddRoom() {
    const existing = document.querySelectorAll('.roomitem');
    const existingmessages = document.querySelectorAll('.messageitem');
    existing.forEach(room => {
        if (room.id == "addnewroom") {
            return
        }
        room.remove()
    });
    existingmessages.forEach(message => {
        message.remove()
    });
    (async () => {
        await handleAppendagesOfRooms()
        addRoomClickEventListeners()
    }) ();
}
async function handleSend() {
    let uid = JSON.parse(localStorage.getItem('UserComplex')).uid;
    let content = document.getElementById('messageinput').value
    let edited = false;
    let reactions = ""
    let type = "textMessage"
    let roomid = document.querySelectorAll(".roomitemselected")[0].id
    await sendMessage(uid, content, edited, reactions, type, roomid)
    document.getElementById('messageinput').value = ""
    
}
function newroombutton() {
    let modal = document.getElementById("modal")
    let modalcontent = document.getElementById("addroominputs")
    modal.style.display = "block"
    modalcontent.style.display = "flex"
}

async function handlenewroom() {
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    var uid = JSON.parse(localStorage.getItem('UserComplex')).uid
    const promise = signInWithEmailAndPassword(auth, getCookie("user"), password.value);
    promise.catch((e) => {
        error(e.message)
        username.innerText = ""
        password.innerText = ""
        return
    });
    promise.then(async(data) => {
        var username = document.getElementById("username")
        var password = document.getElementById("password")
        let newroom = await addNewDMRoom(username.value, uid, JSON.parse(localStorage.getItem('User')).display_name)
        if (newroom == "duplicate") {
            error("Two users. Implementation coming soon")
            username.innerText = ""
            password.innerText = ""
            return
        } else if (newroom == "exists") {
            error("Room already exists")
            username.innerText = ""
            password.innerText = ""
            return
        } else if (newroom == "nouse") {
            error("User does not exist")
            username.innerText = ""
            password.innerText = ""
            return
        }
        closemodal();
        await redoAppendagesAfterAddRoom()
        username.innerText = ""
        password.innerText = ""
    })

}

function appendRoomDiv(roomid, roomname) {
    let maincontainer = document.getElementById("mainroomlistcontainer")
    let addroom = document.getElementById("addnewroom")
    let maindiv = document.createElement('div')
    let image = document.createElement('img')
    let text = document.createElement('p')
    maindiv.className = 'roomitem'
    image.className = "roomavimg"
    maindiv.id = roomid
    image.src = "../assets/img/personalization/placeav.png"
    text.innerHTML = roomname
    maindiv.appendChild(image)
    maindiv.appendChild(text)
    maincontainer.insertBefore(maindiv, addroom)
}

async function appendMessageDiv(authorid, content) {
    authorid = await getUserFromUid(authorid)
    authorid = authorid.display_name
    let maincontainer = document.getElementById("messagescontainer")
    let maindiv = document.createElement('div')
    let userdiv = document.createElement('div')
    let textdiv = document.createElement('div')
    let image = document.createElement('img')
    let text = document.createElement('p')
    let authortext = document.createElement('p')
    maindiv.className = 'messageitem'
    image.className = "messageitemav"
    textdiv.className = "messagetextcontainer"
    userdiv.className = "useritem"
    text.className = "message"
    authortext.className = "author"
    text.innerHTML = content
    authortext.innerHTML = authorid
    image.src = "../assets/img/personalization/placeav.png"
    
    maindiv.appendChild(userdiv)
    maindiv.appendChild(textdiv)
    userdiv.appendChild(image)
    userdiv.appendChild(authortext)
    textdiv.appendChild(text)
    maincontainer.appendChild(maindiv)

}

function addRoomClickEventListeners() {
    const rooms = document.querySelectorAll('.roomitem');

    rooms.forEach(room => {
        if (room.id == "addnewroom") {
            return
        }
      room.addEventListener('click', (event) => {
        for (let i in event.path) {
            if (event.path[i].className == 'roomitem') {
                let sendbutton = document.getElementById("messagesend")
                sendbutton.removeAttribute('disabled')
                try { document.getElementsByClassName("roomitemselected")[0].className = "roomitem" } catch (e) {}
                event.path[i].className = "roomitem roomitemselected"
                getMessagesForRoom(event.path[i].id)
                setRoomAsRead(event.path[i].id)
            }
        }
      });
    });
}

function error(errorMSG, context = "") {
    const msg = "Error: " + errorMSG;
    let errmsg = document.getElementById("errormsg")
    errmsg.innerHTML = msg;
}