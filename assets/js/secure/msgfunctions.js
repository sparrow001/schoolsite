import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js';
import { getDatabase, ref, onValue, get, child, set, update } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"
import { getFirestore, collection, addDoc, query, orderBy, setDoc, updateDoc, doc, serverTimestamp, getDocs, getDoc, where } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
import { getUserFromUid } from "../functions.js";

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
  let recdisplayname = await getRoomDataFromRoomId(roomid)
  let userid = await getUserFromUid(authoruid)
  userid = userid.display_name
  recdisplayname = recdisplayname.name.replace(/\s+/i, '')
  recdisplayname = recdisplayname.replace(userid, '')
  recdisplayname = recdisplayname.replace(/\s?(and)\s/g, '')
  
  let q = query(collection(getFirestore(app), 'users'), where("display_name", "==", recdisplayname.toLowerCase()))
  const querySnapshot = await getDocs(q);
  let returner = []
  querySnapshot.forEach((doc) => {
    returner.push(doc.id)
  });
  if (returner.length > 1) {
    return "duplicate name"
  }
  if (getActiveRoom(returner[0]) != roomid) {
    await setRoomAsUnread(roomid, returner[0])
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

export async function addNewDMRoom(recdisplayname, senderuid, senderdisplayname, groupname = null, profilepic = null) {
  console.log(recdisplayname)
  if (await testImage(profilepic) != "success") {
    if (profilepic == null || profilepic == "" || profilepic == undefined || profilepic == " ") {
    }else {
      return "urlinvalid"
    }
  }
  if (!(recdisplayname instanceof Array)) {
    return "must be array"
  }else if (recdisplayname.length > 1) {
    let wholeids = [];
    let q = query(collection(getFirestore(app), 'users'), where("display_name", "==", recdisplayname[0].toLowerCase()))
    const querySnapshot = await getDocs(q);
    let firstreturn = []
    querySnapshot.forEach((doc) => {
      console.log(doc.id)
      firstreturn.push(doc.id)
      wholeids.push(doc.id)
    });
    
    let recieverid
    try {
      let receiver = await addDoc(collection(getFirestore(), 'users/'+ firstreturn[0] + '/rooms'), {
        lastAccessed: serverTimestamp(),
        newMessage: true,
        owner: false
      });
      recieverid = receiver.id
    }
    catch(error) {
      console.error('Error writing new room to Firebase Database for reciever first: ', error);
    } 
    recdisplayname.slice(1)
    for (let i in recdisplayname) {
      let q = query(collection(getFirestore(app), 'users'), where("display_name", "==", recdisplayname[i].toLowerCase()))
      const querySnapshot = await getDocs(q);
      let returner = []
      querySnapshot.forEach((doc) => {
        returner.push(doc.id)
        wholeids.push(doc.id)
      });
      if (returner.length > 1) {
        return "duplicate name"
      }
      if (returner.length == 0) {
        return "nouser"
      }
      try {
        let reciever = await setDoc(doc(getFirestore(), 'users/'+ returner[0] + '/rooms', recieverid), {
          lastAccessed: serverTimestamp(),
          newMessage: true,
          owner: false
        });
      }
      catch(error) {
        console.error('Error writing new room to Firebase Database for reciever: ', error);
      } 
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
        name: (groupname == null || groupname == "" || groupname == " ") ? "Random Group": groupname,
        members: wholeids,
        profilepicurl: (profilepic == null || profilepic == "" || profilepic == " ") ? "default": profilepic
        });
    }
    catch (error) {
      console.error('Error writing new room to Firebase Database for room collection', error);
    }
    return
  }
  let qw = query(collection(getFirestore(app), 'rooms'), where("name", "in", [recdisplayname[0] + " and " + senderdisplayname, senderdisplayname + " and " + recdisplayname[0]]));
  const querySnapshotqw = await getDocs(qw);
  let returnerqw = []
  querySnapshotqw.forEach((doc) => {
    returnerqw.push({id: doc.id, data: doc.data()})
  });
  if (returnerqw.length != 0) {
    return "exists"
  }
  let q = query(collection(getFirestore(app), 'users'), where("display_name", "==", recdisplayname[0].toLowerCase()))
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
  let titlecaserec = (await get(ref(getDatabase(), `/users/${returner[0].id}/display_name`)))._node.value_;

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
      name: (groupname == null || groupname == "" || groupname == " ") ? senderdisplayname + " and " + titlecaserec: groupname,
      members: [returner[0].id, senderuid],
      profilepicurl: (profilepic == null || profilepic == "" || profilepic == " ") ? "default": profilepic
      });
  }
  catch {
    console.error('Error writing new room to Firebase Database for room collection', error);
  }
}

export async function setRoomAsRead(roomid) {
  const theref = doc(getFirestore(), "users", JSON.parse(localStorage.getItem("UserComplex")).uid, "rooms", roomid)
  await updateDoc(theref, {
    newMessage: false
  })
}

export async function setRoomAsUnread(roomid, userid) {
  const theref = doc(getFirestore(), "users", userid, "rooms", roomid)
  console.log(theref)
  await updateDoc(theref, {
    newMessage: true
  })
}

export function getActiveRoom(userid) {
  let db = getDatabase();
  const theref = get(ref(db, `/users/${userid}/activeRoom`));
  if (theref == null) {
    return null
  }
  return theref.then(snapshot => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
  });
}

export async function setActiveRoom(userid, roomid) {
  let db = getDatabase();
  set(ref(db, '/users/' + userid + '/activeRoom'), roomid);
  const theref = doc(getFirestore(), "users", userid, "rooms", roomid);
  await updateDoc(theref, {
    lastAccessed: serverTimestamp()
  })
}

export function userIsOnlineMsgSetter(uid) {
  const db = getDatabase();
  const statusref = ref(db, 'users/' + uid + '/lastOnline');
  console.log(statusref)
  onValue(statusref, (snapshot) => {
    return snapshot.val()
  })

}

export function testImage(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = url;
    img.onload = () => resolve("success");
    img.onerror = () => resolve("fail");
  })
}