import { appendFav } from '../functions.js'
import { testImage } from './msgfunctions.js'
document.getElementById("titlebutton").addEventListener("click", titlehandler);
document.getElementById("iconbutton").addEventListener("click", iconhandler);


function titlehandler() {
    var title = document.getElementById("settitleinput").value;
    sessionStorage.setItem("customtitle", btoa(title));
    document.title = title;
}

async function iconhandler() {
    var icon = document.getElementById("seticoninput").value;
    if (icon == "") {
        return
    }
    if (await testImage(icon) != "success") {
        
        console.log("failed: " + icon)
        icon = ""
        return
    }
    sessionStorage.setItem("customicon", btoa(icon));
    appendFav(icon)
    icon = ""
}

