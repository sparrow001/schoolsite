import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
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
document.getElementById("logIn").addEventListener("click", logIn);
document.getElementById("logInShort").addEventListener("click", logIn);
document.getElementById("forgot").addEventListener("click", forgot);
const errmsg = document.getElementById("error")

function logIn() {
    let email;
    email = document.getElementById("email");
    if (window.getComputedStyle(email).display === "none") {
        email = document.getElementById("emailShort");
    }
    var password = document.getElementById("password");
    if (window.getComputedStyle(password).display === "none") {
        password = document.getElementById("passwordShort");
    }
    const promise = signInWithEmailAndPassword(auth, email.value, password.value);
    promise.catch(e => error(e.message));

    
}

function forgot() {
    document.getElementById("password").style.display = "none";
    document.getElementById("passwordShort").style.display = "none";
    document.getElementById("forgot").style.display = "none";
    let login;
    login = document.querySelector("#logIn");
    if (window.getComputedStyle(login).display === "none") {
        login = document.querySelector("#logInShort").innerHTML = "Reset";
    }else {
        login = document.querySelector("#logIn").innerHTML = "Reset Password";
    }
    document.getElementById("logIn").addEventListener("click", reset);
    document.getElementById("logInShort").addEventListener("click", reset);
}

function reset() {
    var email = document.getElementById("email");
    if (window.getComputedStyle(email).display === "none") {
        email = document.getElementById("emailShort");
    }
    const promise = sendPasswordResetEmail(auth, email.value);
    promise.catch(e => error(e.message, "reset"));
}
function error(errorMSG, context = "") {
    const msg = "Error: " + errorMSG.split("/")[1].split(")")[0];

    errmsg.innerHTML = msg;
}
auth.onAuthStateChanged(user =>{
    if(user){
        alert("Signed In " + user.email)
        errmsg.innerHTML = "";
    }
    else{
        alert("Signed Out")
    }
})