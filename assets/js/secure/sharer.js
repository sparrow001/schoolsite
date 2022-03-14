import { getCookie } from "../functions.js";
import { getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"




document.getElementById("share").addEventListener("click", share);

function share() {
    var user = getCookie("user")
    var fname = document.getElementById("sharefirst").value;
    var lname = document.getElementById("sharelast").value;
    var phone = document.getElementById("sharephone").value;
    var email = document.getElementById("shareemail").value;
    const db = getDatabase();
    if (fname != "" && lname != "" && email != "") {
        try {
            set(ref(db, 'sharereq/' + btoa(email)), {
                requestby: btoa(user),
                first_name: fname,
                last_name: lname,
                phone: phone
            });
            alert("Success!")
        }catch(e){
            document.getElementById("er").innerHTML = "Error: " + e;
        }
    } else {
        document.getElementById("er").innerHTML = "Please fill in all required fields (marked with *)";
    }
}