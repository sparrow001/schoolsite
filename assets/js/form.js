import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserSessionPersistence, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { setcookiehour, deleteCookie, getCookie } from "./functions.js";
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
setPersistence(auth, browserSessionPersistence);
document.getElementById("logIn").addEventListener("click", logIn);
document.getElementById("forgot").addEventListener("click", forgot);
document.getElementById("tos").addEventListener("click", tos);
const errmsg = document.getElementById("error")

function logIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = signInWithEmailAndPassword(auth, email.value, password.value);
    promise.catch(e => error(e.message));

    
}

function forgot() {
    errmsg.innerHTML = "";
    document.getElementById("password").style.display = "none";
    document.getElementById("forgot").removeEventListener("click", forgot);
    document.getElementById("forgot").addEventListener("click", forgotreturn);
    document.getElementById("forgot").innerHTML = "Return"
    document.querySelector("#logIn").innerHTML = "Reset Password";
    document.getElementById("logIn").removeEventListener("click", logIn);
    document.getElementById("logIn").addEventListener("click", reset);
}

function forgotreturn() {
    errmsg.innerHTML = "";
    document.getElementById("password").style.display = "block";
    document.getElementById("forgot").innerHTML = "Forgot your password?"
    document.getElementById("forgot").removeEventListener("click", forgotreturn);
    document.getElementById("forgot").addEventListener("click", forgot);
    document.querySelector("#logIn").innerHTML = "Log In";
    document.getElementById("logIn").removeEventListener("click", reset);
    document.getElementById("logIn").addEventListener("click", logIn);
}

function tos() {
    window.location.href = "./tos.html";
}
function reset() {
    let email = document.getElementById("email");
    const promise = sendPasswordResetEmail(auth, email.value);
    promise.catch(e => error(e.message, "reset"));
}
function error(errorMSG, context = "") {
    const msg = "Error: " + errorMSG.split("/")[1].split(")")[0];

    errmsg.innerHTML = msg;
}

window.onbeforeunload = function() {
    deleteCookie("user");
    signOut(auth)
}

window.onload = function() {
    !!getCookie("medid") ? deleteCookie("medid") : null;
    !!getCookie("user") ? deleteCookie("user") : null;
    !!getCookie("session") ? deleteCookie("session") : null;
}
auth.onAuthStateChanged(user =>{
    if(user){
        errmsg.innerHTML = "";
        setcookiehour("user", user.email);
        localStorage.setItem("UserComplex", JSON.stringify(user));
        window.onbeforeunload = null;
        window.location.replace("./portal/dash.html");
    }
    else{
    }
})
