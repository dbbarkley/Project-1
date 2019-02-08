// Initialize Firebase
$(document).ready(function() {
  random_bg_color();
  $("body, html").on("load", function() {
      random_bg_color();
  });
});

function random_bg_color() {
var x = Math.floor(Math.random() * 256);
var y = Math.floor(Math.random() * 256);
var z = Math.floor(Math.random() * 256);
var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  console.log(bgColor);
$("body, html").css("background-color", bgColor);
}

var config = {
  apiKey: firebaseKey,
  authDomain: "foodflix-9170b.firebaseapp.com",
  databaseURL: "https://foodflix-9170b.firebaseio.com",
  projectId: "foodflix-9170b",
  storageBucket: "foodflix-9170b.appspot.com",
  messagingSenderId: "471943646046"
};

firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();

// Setup materialize Components. This will call the modals when the buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});

// Listen fro auth status changes 
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user);
  } else {
    setupUI();
  }
});

var loggedOutLinks = document.querySelectorAll(".logged-out");
var loggedInLinks = document.querySelectorAll(".logged-in");

var setupUI = (user) => {
  if (user) {
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "block");
    loggedOutLinks.forEach(item => item.style.display = "none");
  } else {
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "none");
    loggedOutLinks.forEach(item => item.style.display = "block");

  }
}


// Authentication Signup
var signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get user info
  var email = $("#signup-email").val().trim();
  var password = $("#signup-password").val().trim();

  // Sign Up User In firebase
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    var modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// Log User Out
var logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});

// User Login
var loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get User Info
  var email = $("#login-email").val().trim();
  var password = $("#login-password").val().trim();

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the login modal and reset the form
    var modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

