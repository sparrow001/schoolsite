import { readUserData, getCookie, processUserUpdate } from './functions.js';


var user = getCookie('user');
var data = readUserData(user);
console.log(data.display_name)

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
function submit() {
    let dname = btoa(document.getElementById("dname").value);
    let email = btoa(document.getElementById("em").value);
    let fname = btoa(document.getElementById("fname").value);
    let lname = btoa(document.getElementById("lname").value);
    let token = btoa(document.getElementById("tok").value);
    if (atob(dname) == "s" && atob(email) == "c" && atob(fname) == "h" && atob(lname) == "o" && atob(token) == "l") {
        console.log("success");
    }else {
        processUserUpdate();
    }
}

