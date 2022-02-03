import { getCookie, deleteCookie } from '../functions.js'

var medid = getCookie("medid")
var player = document.getElementById("medvid")
var source = document.createElement('source');

source.setAttribute('src', atob(medid));
source.setAttribute('type', 'video/mp4');

player.appendChild(source);
