import {writeShare, getCookie} from "../functions.js";

let user = getCookie("user");
let fname = document.getElementById("sharefirst").value;
let lname = document.getElementById("sharelast").value;
let phone = document.getElementById("sharephone").value;
let email = document.getElementById("shareemail").value;
document.getElementById("share").addEventListener("click", () => {
    if (fname != null) {
        writeShare(btoa(user), email, fname, lname, phone);
    }else {
        alert("Please fill out all fields");
    }
});