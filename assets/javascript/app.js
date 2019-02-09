$(document).ready(function () {
  random_bg_color();
  $("body, html").on("load", function () {
    random_bg_color();
  });
});

function random_bg_color() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  $("body, html").css("background-color", bgColor);
}

// Initialize Firebase
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
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
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

var setupUI = user => {
  if (user) {
    // toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    // toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

// Authentication Signup
var signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get user info
  var email = $("#signup-email")
    .val()
    .trim();
  var password = $("#signup-password")
    .val()
    .trim();

  // Sign Up User In firebase
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    var modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// Log User Out
var logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut();
});

// User Login
var loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get User Info
  var email = $("#login-email")
    .val()
    .trim();
  var password = $("#login-password")
    .val()
    .trim();

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the login modal and reset the form
    var modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

//Function to search receipe API
function searchRecipes() {
  var itemSearch = $(".uk-search-input")
    .val()
    .trim();
  var queryURL =
    "https://api.edamam.com/search?q=" +
    itemSearch +
    "&app_id=" +
    edamamKey.danielID +
    "&app_key=" +
    edamamKey.danielKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    for (var i = 0; i < 5; i++) {
      var label = response.hits[i].recipe.label;
      var recipe = $(".recipes");
      var newRecipe =
      "<ul class='collapsible'>" +
      "<li>" +
      "<div class='collapsible-header'>" + label + "</div>" +
      `<div class='collapsible-body'><span class='span span${i}'></span></div>` +
      "</li>" +
      "</ul>"

      recipe.append(newRecipe);
      M.AutoInit();
    
    
      for (var j = 0; j <= response.hits[i].recipe.ingredientLines.length - 1; j++) {
        var ingredients = response.hits[i].recipe.ingredientLines[j];
        if (i == 0) console.log(ingredients);

        var span = $(`.span${i}`);
        console.log(span);
        span.append(ingredients);
      }
    };
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
});

//Click listener to search API
$(".uk-search-icon-flip").on("click", function (event) {
  event.preventDefault();
  searchRecipes();

  //Clears the search field on enter/click
  $(".uk-search-input").val("");
});

function searchMovie() {

  var genreSearch = $("input[]:checked").val();

  var queryURL =
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
    tmdbKey.danielKey +
    "&language=en-US&with_genres=" +
    +
    "&include_adult=false&sort_by=vote_count.desc"


  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  });
}
