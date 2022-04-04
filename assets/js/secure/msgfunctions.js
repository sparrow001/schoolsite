import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, setDoc, updateDoc, doc, serverTimestamp, getDocs, getDoc, where } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

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

export async function sendMessage(authoruid, content, edited, reactions, type, roomid) {
  try {
      await addDoc(collection(getFirestore(), 'rooms/'+ roomid + '/messages'), {
        authoruid: authoruid,
        content: content,
        edited: edited,
        reactions: reactions,
        timestamp: serverTimestamp(),
        type: type
      });
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
}

export async function getUnaccessedRooms(userid) {
  let q = query(collection(getFirestore(app), 'users/' + userid + "/rooms"), where("newMessage", "==", true));
  const querySnapshot = await getDocs(q);
  let returner = []
  querySnapshot.forEach((doc) => {
    returner.push({id: doc.id, data: doc.data()})
  });
  
  return returner
}

export async function getRestOfRooms(userid) {
  let q = query(collection(getFirestore(app), 'users/' + userid + "/rooms"), where("newMessage", "==", false), orderBy("lastAccessed", "desc"))
  const querySnapshot = await getDocs(q);
  let returner = []
  querySnapshot.forEach((doc) => {
    returner.push({id: doc.id, data: doc.data()})
  });
  
  return returner
}

export async function getMessagesFromRoomId(roomid) {
  let q = query(collection(getFirestore(app), 'rooms/' + roomid + "/messages"), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  let returner = []
  querySnapshot.forEach((doc) => {
    returner.push({id: doc.id, data: doc.data()})
  });
  
  return returner
}

export async function getRoomDataFromRoomId(roomid) {
  roomid = roomid.replace(/\s/g, '')
  const docRef = doc(getFirestore(app), "rooms", roomid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return "nosuchroom"
  }
}

export async function addNewDMRoom(recdisplayname, senderuid, senderdisplayname) {
  let qw = query(collection(getFirestore(app), 'rooms'), where("name", "in", [recdisplayname + " and " + senderdisplayname, senderdisplayname + " and " + recdisplayname]));
  const querySnapshotqw = await getDocs(qw);
  let returnerqw = []
  querySnapshotqw.forEach((doc) => {
    returnerqw.push({id: doc.id, data: doc.data()})
  });
  if (returnerqw.length != 0) {
    return "exists"
  }
  let q = query(collection(getFirestore(app), 'users'), where("display_name", "==", recdisplayname.toLowerCase()))
  const querySnapshot = await getDocs(q);
  let returner = []
  let recieverid
  querySnapshot.forEach((doc) => {
    returner.push({id: doc.id, data: doc.data()})
  });
  if (returner.length > 1) {
    return "duplicate"
  }
  if (returner.length == 0) {
    return "nouser"
  }
  try {
    let receiver = await addDoc(collection(getFirestore(), 'users/'+ returner[0].id + '/rooms'), {
      lastAccessed: serverTimestamp(),
      newMessage: true,
      owner: false
    });
    recieverid = receiver.id
  }
  catch(error) {
    console.error('Error writing new room to Firebase Database for reciever: ', error);
  }
  try {
    await setDoc(doc(getFirestore(), 'users/'+ senderuid + '/rooms', recieverid), {
      lastAccessed: serverTimestamp(),
      newMessage: true,
      owner: true
    });
  }
  catch {
    console.error('Error writing new room to Firebase Database for sender: ', error);
  }
  try {
    await setDoc(doc(getFirestore(), 'rooms', recieverid), {
      name: senderdisplayname + " and " + recdisplayname,
      });
  }
  catch {
    console.error('Error writing new room to Firebase Database for room collection', error);
  }
}

export async function setRoomAsRead(roomid) {
  const theref = doc(getFirestore(), "users", JSON.parse(localStorage.getItem("UserComplex")).uid, roomid)
  await updateDoc(theref, {
    newmessage: false
  })
}