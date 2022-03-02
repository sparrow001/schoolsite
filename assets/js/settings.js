import { readUserData, getCookie, setcookiehour, deleteCookie } from './functions.js';


var user = getCookie('user');
var data = readUserData(user);

var fill = ["display_name", "email", "first_name", "last_name", "token"];

data.then(function(data) {
    for (let i in fill) {
        switch (fill[i]) {
            case "display_name":
                document.getElementById("display_name").innerHTML = document.getElementById("display_name").innerHTML + " " + data.display_name;
                break;
            case "email":
                document.getElementById("email").innerHTML = document.getElementById("email").innerHTML + " " + user;
                break;
            case "first_name":
                document.getElementById("first_name").innerHTML = document.getElementById("first_name").innerHTML + " " + data.first_name;
                break;
            case "last_name":
                document.getElementById("last_name").innerHTML = document.getElementById("last_name").innerHTML + " " + data.last_name;
                break;
            case "token":
                document.getElementById("token").innerHTML = document.getElementById("token").innerHTML + " " + data.token;
                break;
            default:
                console.log("really should never happen");
                break;
        }
    }
});

document.getElementById("submit").addEventListener("click", submit);
window.onload = sessionid()
function sessionid() {
    let text = document.getElementById("session")
    // Optional, ~-_!@#$%^&*()_+{}|:"<>?[]\;\',./
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 20; i++ ) {
        var result;
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    text.innerHTML = "Session ID: " + result.split("fined")[1];
    setcookiehour("session", btoa(result.split("fined")[1]))
}
let errors;
function submit() {
    let dname = btoa(document.getElementById("dname").value);
    let email = btoa(document.getElementById("em").value);
    let fname = btoa(document.getElementById("fname").value);
    let lname = btoa(document.getElementById("lname").value);
    let token = btoa(document.getElementById("tok").value);
    let sessionkey = atob(getCookie("session")).split("");
    console.log(sessionkey[0])
    if (atob(dname) == sessionkey[0] && atob(email) == sessionkey[1] && atob(fname) == sessionkey[2] && atob(lname) == sessionkey[3] && atob(token) == sessionkey[4]) {
        window.onbeforeunload = null
        window.location.replace("../secure/dash.html");
    }else {
        sessionid()
        errors++
        if (errors == 3) {
            deleteCookie("user")
            const firebaseConfig = {
                apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
                authDomain: "school-site-b799d.firebaseapp.com",
                projectId: "school-site-b799d",
                storageBucket: "school-site-b799d.appspot.com",
                messagingSenderId: "704109356346",
                appId: "1:704109356346:web:be6a9266093b06dbd81c03",
                measurementId: "G-VXQWNZJ3MX"
            };
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            signOut(auth)
        }else {
            
        }
    }
}

