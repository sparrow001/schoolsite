window.onload = function() {
    document.getElementById("titlebutton").addEventListener("click", titlehandler);
}


function titlehandler() {
    var title = document.getElementById("settitleinput").value;
    sessionStorage.setItem("customtitle", btoa(title));
    document.title = title;
}