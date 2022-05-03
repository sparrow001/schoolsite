import { getCookie, deleteCookie, readUserData, setcookiehour } from '../functions.js'

document.getElementById('hide').addEventListener('click', hidehandler);
document.getElementById('show').addEventListener('click', showhandler);
var player = document.getElementById("medvid")
var source = document.createElement('source');
var playlistSongs
function hidehandler() {
    var viewer = document.getElementById('medvid');
    viewer.style.visibility = 'hidden';
}

function showhandler() {
    var viewer = document.getElementById('medvid');
    viewer.style.visibility = 'visible';
}
var medid = getCookie("medid")
let final;
if (medid == null) {
    window.location.replace("docs.html");
}else if (medid.startsWith("playlist")) {
    medid = medid.split(" ")[1]
    let data = readUserData("", "playlists")
    data.then((data) => {
        setcookiehour("listauto", JSON.stringify(data[medid].songs))
        playlistSongs = data[medid].songs
        playlistAutoPlay()
        //addSpecialButtons()
    })
    var data = readUserData(user);
    data.then(data => {
        localStorage.setItem('User', JSON.stringify(data));
    })
}else if (medid.startsWith("link")) {
    medid = atob(medid.split(" ")[1])
    console.log(medid)
    var url = "https://redir.sparrow001.workers.dev/" + medid
    var videoposter = "https://img.youtube.com/vi/" + medid + "/hqdefault.jpg"
    let response = await fetch(url, {
        method: 'GET',
    })
    final = await response.text()

    source.setAttribute('src', final);
    source.setAttribute('type', 'video/mp4');
    player.setAttribute('poster', videoposter)
    player.load()
    
    player.appendChild(source);
    
}

function addSpecialButtons() {
    let next = document.getElementById("next")
    let shuffle = document.getElementById("shuffle")

    next.style.display = 'block'
    shuffle.style.display = 'block'

    next.addEventListener("click", playlistAutoPlay)
    shuffle.addEventListener("click", shufflePlaylist)
}
async function playlistAutoPlay() {
    let listauto = getCookie("listauto")
    listauto = JSON.parse(listauto)
    var url = "https://redir.sparrow001.workers.dev/" + listauto[0];
    var videoposter = "https://img.youtube.com/vi/" + listauto[0] + "/hqdefault.jpg"
    let medresponse = await fetch(url, {
        method: 'GET',
    });
    final = await medresponse.text()
    player.pause()
    source.setAttribute('src', final);
    source.setAttribute('type', 'video/mp4');
    player.setAttribute('autoplay', "")
    player.setAttribute('poster', videoposter)
    player.load()
    player.appendChild(source);
    listauto.shift()
    if (listauto.length == 0) {
        player.removeEventListener('ended', playlistAutoPlay)
        alert("last video")
        return
    }
    setcookiehour("listauto", JSON.stringify(listauto))
    player.removeEventListener('ended', playlistAutoPlay)
    player.addEventListener("ended", playlistAutoPlay)
}

function shufflePlaylist() {
    var listauto = playlistSongs
    if (listauto == null) {
        return
    }
    let forbiddenrandom
    let randomnum
    if (getCookie("shuffleIndex") == null) {
        randomnum = Math.floor(Math.random() * listauto.length)
    }else {
        forbiddenrandom = getCookie("shuffleIndex")
        while (randomnum == forbiddenrandom) {
            randomnum = Math.floor(Math.random() * listauto.length)
        }
    }
    var url = "https://redir.sparrow001.workers.dev/" + listauto[randomnum];

    let medresponse = fetch(url, {
        method: 'GET',
    });
    final = medresponse.text()
    player.pause()
    source.setAttribute('src', final);
    source.setAttribute('type', 'video/mp4');
    player.setAttribute('autoplay', "")
    player.load()
    player.appendChild(source);
    player.removeEventListener('ended', playlistAutoPlay)
    player.addEventListener("ended", shufflePlaylist)
}
