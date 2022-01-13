import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
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
document.getElementById("signUp").addEventListener("click", signUp);
document.getElementById("logIn").addEventListener("click", logIn);
document.getElementById("logOut").addEventListener("click", logOut);
function signUp() { 
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = createUserWithEmailAndPassword(auth, email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed In")
}

function logIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = signInWithEmailAndPassword(auth, email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed In " + email.value)
}
auth.onAuthStateChanged(user =>{
    if(user){
        alert("Signed In " + user.email)
    }
    else{
        alert("Signed Out")
    }
})