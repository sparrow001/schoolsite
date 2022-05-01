import {
  getDatabase,
  ref,
  get,
  child,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { NotArray } from "./errors.js";
import { setcookiehour, getCookie } from "./functions.js";
const firebaseConfig = {
  apiKey: "AIzaSyBff6gLXbUMW0rnq4186O9d9896toadZ30",
  authDomain: "school-site-b799d.firebaseapp.com",
  projectId: "school-site-b799d",
  storageBucket: "school-site-b799d.appspot.com",
  messagingSenderId: "704109356346",
  appId: "1:704109356346:web:be6a9266093b06dbd81c03",
  measurementId: "G-VXQWNZJ3MX",
};
const app = initializeApp(firebaseConfig);

document.getElementById("return").addEventListener("click", function () {
  window.location.href = "./index.html";
});

const errmsg = document.getElementById("errmsg");
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    let limit = 0;
    for (i = 0; i < arr.length; i++) {
      if (limit == 12) {
        b = document.createElement("DIV");
        b.innerHTML = "And More";
        a.appendChild(b);
        break;
      }
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
        limit = limit + 1;
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function initiate() {
  fetch("https://jsonblob.com/api/jsonBlob/967928249900613632", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      // `data` is the parsed version of the JSON returned from the above endpoint.
      let names = [];
      for (let i in data) {
        names.push(data[i].Name);
      }
      autocomplete(document.getElementById("myInput"), names);
    });
}
window.onload = function () {
  initiate();
  handleform();
};

function handleform() {
  let names = [];
  fetch("https://jsonblob.com/api/jsonBlob/967928249900613632", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      // `data` is the parsed version of the JSON returned from the above endpoint.

      for (let i in data) {
        names.push(data[i].Name);
      }
    });
  const form = document.getElementById("signupform");
  const name = document.getElementById("myInput");
  form.addEventListener("submit", function handler(event) {
    event.preventDefault();
    if (name.value == "") {
      error("Input is blank");
    } else if (!names.includes(name.value)) {
      if (name.value.startsWith("submit") && getCookie("suggested") == "") {
        errmsg.style.color = "#186920";
        errmsg.innerHTML =
          "Name Suggested! Check back soon to see if the name is inserted.";
        suggestName(name.value).then((result) => {
          setcookiehour("suggested", true);
        });
      } else if (getCookie("suggested") != "") {
        errmsg.style.color = "red";
        error("You have suggested a name recently. Please wait a bit.");
      } else {
        error(
          "Name not found. If you would like to suggest this name, add 'submit' to the beginning of the name."
        );
      }
    } else {
      if (getCookie("submitted") != "") {
        error("You have already submitted a name. Please wait a bit.");
        return;
      }
      const db = getDatabase();
      get(child(ref(db), "admin/namesubmit")).then((snapshot) => {
        let names = snapshot.val();
        let newnames = snapshot.val();
        newnames.push(name.value);
        submitName(newnames, names).then((result) => {
          setcookiehour("submitted", true);
        });
        
      });
    }
  });
}

function error(errorMSG, context = "") {
  const msg = "Error: " + errorMSG;
  errmsg.innerHTML = msg;
}

async function suggestName(name) {
  name = name.replace("submit", "");
  if (name.charAt(0) == " ") {
    name = name.substring(1);
  }
  if (!name.includes(" ")) {
    error("Must include first and last name");
    return;
  }
  const db = getDatabase();
  let names, newnames;
  get(child(ref(db), "admin/namereq")).then((snapshot) => {
    names = snapshot.val();
    newnames = snapshot.val();
    newnames.push(name);
    setName(newnames, names);
  });
}

// fetch("https://ipinfo.io/json").then((response) => { return response.json() }).then((data) => { console.log(data) })    IP CONTROL

async function setName(namereq, oldlist) {
  if (!(namereq instanceof Array)) {
    throw new NotArray("setName(). Namereq value must be an array");
  }
  const db = getDatabase();
  const nameref = ref(db, "admin/namereq");
  const newvalue = namereq;
  let comparer;
  get(child(ref(db), "admin/namereq")).then((snapshot) => {
    comparer = snapshot.val();
  });
  if (comparer != oldlist) {
    setName(namereq, comparer);
  }
  return set(nameref, newvalue);
}

async function submitName(namereq, oldlist) {
  if (!(namereq instanceof Array)) {
    throw new NotArray("submitName(). Namereq value must be an array");
  }
  console.log("1")
  const db = getDatabase();
  const nameref = ref(db, "admin/namesubmit");
  const newvalue = namereq;
  let comparer;
  get(child(ref(db), "admin/namesubmit")).then((snapshot) => {
    comparer = snapshot.val();
  });
  if (comparer != oldlist) {
    submitName(namereq, comparer);
  }
  return set(nameref, newvalue);
}
