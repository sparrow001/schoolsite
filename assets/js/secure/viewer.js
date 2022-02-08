import { getCookie, deleteCookie } from '../functions.js'

var medid = getCookie("medid")
var url = "https://redir.sparrow001.workers.dev/" + atob(medid)
let response = await fetch(url, {
    method: 'GET',
})

let final = await response.text()
var player = document.getElementById("medvid")
var source = document.createElement('source');

source.setAttribute('src', final);
source.setAttribute('type', 'video/mp4');

player.appendChild(source);
