import { setcookiehour } from '../functions.js';

document.getElementById('medsub').addEventListener('click', submedia);

function submedia() {
    const regex = /(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed|shorts|v|)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/gm;
    let medbutton = document.getElementById('medsub');
    let medinput = document.getElementById('medinput').value.toString();
    let m = regex.exec(medinput)
    let resultpass
    if (m == null) {
        if (medinput.startsWith('playlist')) {
            resultpass = "playlist " + btoa(medinput.split(" ")[1])
        }else {
            //invalid input
            return
        }
    }else {
        m.forEach((match, groupIndex) => {
            if (groupIndex == 1) {
                resultpass = "link " + btoa(match)
            }
            else {
            }
        });
    }  
    setcookiehour("medid", resultpass)
    window.onbeforeunload = null
    window.location.replace("viewer.html")
}