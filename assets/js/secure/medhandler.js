import { setcookiehour } from '../functions.js';

document.getElementById('medsub').addEventListener('click', submedia);

function submedia() {
    let medbutton = document.getElementById('medsub');
    let medinput = document.getElementById('medinput');
    let splitted = medinput.value.split('=');
    if (splitted == null) {
        alert('Invalid input');
    }
    let medid = splitted[1];
    if (medid.indexOf('&') > -1) {
        medid = medid.split('&')[0];
    }
    let url = "https://invidious.namazso.eu/latest_version?id=" + medid + "&itag=22"
    setcookiehour('medid', btoa(url));
    window.onbeforeunload = null
    window.location.replace("viewer.html")
}