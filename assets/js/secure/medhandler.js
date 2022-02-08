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
    setcookiehour('medid', btoa(medid));
    window.onbeforeunload = null
    window.location.replace("viewer.html")
}