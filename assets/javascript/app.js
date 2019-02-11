$(document).ready(function() {
  random_bg_color();
  $("body, html").on("load", function() {
      random_bg_color();
  });
});

var bgColors = ["46,139,87", "30,144,255", "60,179,113" , "255,0,255", "245,176,203", "220,106,207", 
                "212,77,92", "148, 197, 204", "180, 210, 231", "169, 206, 244", "34, 174, 209", 
                "175, 169, 141", "105, 153, 93", "132, 192, 198", "70, 177, 201", "207, 142, 128", 
                "60, 136, 110", "239, 136, 227", "103, 142, 54", "221, 162, 79", "193, 77, 148",
                "160, 157, 165", "87, 222, 193", "27, 173, 196", "240, 153, 81", "48, 197, 136", 
                "3, 198, 214"];

function random_bg_color() {
  var randomColor = bgColors[Math.floor(Math.random()*bgColors.length)];
  $("body, html").css("background-color", "rgb(" + randomColor + ")");
};

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
      // Label Var's for click events
      var label0 = response.hits[0].recipe.label;
      var label1 = response.hits[1].recipe.label;
      var label2 = response.hits[2].recipe.label;
      var label3 = response.hits[3].recipe.label;
      var label4 = response.hits[4].recipe.label;
      // Image Var's for click events
      var  image0 = response.hits[0].recipe.image;
      var  image1 = response.hits[1].recipe.image;
      var  image2 = response.hits[2].recipe.image;
      var  image3 = response.hits[3].recipe.image;
      var  image4 = response.hits[4].recipe.image;
      // URL Var's for click events
      var URL0 = response.hits[0].recipe.url;
      var URL1 = response.hits[1].recipe.url;
      var URL2 = response.hits[2].recipe.url;
      var URL3 = response.hits[3].recipe.url;
      var URL4 = response.hits[4].recipe.url;
      // Dynamic Var's
      var label = response.hits[i].recipe.label;
      var  image = response.hits[i].recipe.image;
      var URL = response.hits[i].recipe.url;
      var recipe = $(".recipes");
      var newRecipe =
      "<ul class='collapsible popout'>" +
      "<li>" +
      "<div class='collapsible-header' id='hope' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label + "</div>" +
      `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image + `><h4 class='text'>Ingredients:</h4><span class='span span${i}'></span>` + 
      `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL + `"target="_blank">See Recipe</a>` +
      "<a class='waves-effect waves-light btn grey darken-2 save' id='save-recipe"+i+"'>Save Recipe</div>" +
      "</li>" +
      "</ul>"

      recipe.append(newRecipe);
      M.AutoInit();
    
      for (var j = 0; j <= response.hits[i].recipe.ingredientLines.length - 1; j++) {
        var ingredients = response.hits[i].recipe.ingredientLines[j];

        var spanIngredients = $(`.span${i}`);

        // added line break for each ingredient
        spanIngredients.append(ingredients + "<br>");

      };
    };
        // Click event for first recipe
        $(document.body).on("click", "#save-recipe0", (e) => {
        e.preventDefault();
        var clickOne = 
        "<ul class='collapsible popout'>" +
        "<li>" +
        "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label0 + "</div>" +
        `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image0 + `><h4 class='text'></h4><span class='span span${i}'></span>` + 
        `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL0 + `"target="_blank">See Recipe</a>` +
        "</li>" +
        "</ul>"
  
        $(".recipes-details").append(clickOne);
        M.AutoInit();
      });
        // Click event for second recipe
        $(document.body).on("click", "#save-recipe1", (e) => {
        e.preventDefault();
        var clickTwo = 
        "<ul class='collapsible popout'>" +
        "<li>" +
        "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label1 + "</div>" +
        `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image1 + `><h4 class='text'></h4><span class='span span${i}'></span>` + 
        `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL1 + `"target="_blank">See Recipe</a>` +
        "</li>" +
        "</ul>"
  
        $(".recipes-details").append(clickTwo);
        M.AutoInit(); 
      });
        // Click event for third recipe
        $(document.body).on("click", "#save-recipe2", (e) => {
        e.preventDefault();
        var clickThree = 
        "<ul class='collapsible popout'>" +
        "<li>" +
        "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label2 + "</div>" +
        `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image2 + `><h4 class='text'></h4><span class='span span${i}'></span>` + 
        `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL2 + `"target="_blank">See Recipe</a>` +
        "</li>" +
        "</ul>"
  
        $(".recipes-details").append(clickThree);
        M.AutoInit();
      });
        // Click event for fourth recipe
        $(document.body).on("click", "#save-recipe3", (e) => {
        e.preventDefault();
        var clickFour = 
        "<ul class='collapsible popout'>" +
        "<li>" +
        "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label3 + "</div>" +
        `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image3 + `><h4 class='text'></h4><span class='span span${i}'></span>` + 
        `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL3 + `"target="_blank">See Recipe</a>` +
        "</li>" +
        "</ul>"
  
        $(".recipes-details").append(clickFour);
        M.AutoInit();
      });
        // Click event for fifth recipe
        $(document.body).on("click", "#save-recipe4", (e) => {
        e.preventDefault();
        var clickFive = 
        "<ul class='collapsible popout'>" +
        "<li>" +
        "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label4 + "</div>" +
        `<div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=` + image4 + `><h4 class='text'></h4><span class='span span${i}'></span>` + 
        `<a class="waves-effect waves-light btn grey darken-2 see-recipe" href="` + URL4 + `"target="_blank">See Recipe</a>` +
        "</li>" +
        "</ul>"
  
        $(".recipes-details").append(clickFive);
        M.AutoInit();
      });
  });
}


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
});

//Click listener to search both APIs at the same time
$(".uk-search-icon-flip").on("click", function (event) {
  event.preventDefault();
  searchRecipes();
  searchMovie();

  //Clears the search field on enter/click
  $(".uk-search-input").val("");
});

function searchMovie() {
  
  if($("input[type='radio'].with-gap").is(':checked')) {
    var genreSearch = $("input[type='radio'].with-gap:checked").val();
  }

  var queryURL =
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
    tmdbKey.danielkey +
    "&language=en-US&with_genres=" +
    genreSearch +
    "&include_adult=false&sort_by=vote_count.desc"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    var randomIndex = [Math.floor(Math.random() * response.results.length)];
    var randomMovie = response.results[randomIndex].title;
    var moviePoster = "<img src='https://image.tmdb.org/t/p/w500" + response.results[randomIndex].poster_path + "'/>"
    console.log(randomMovie);
    console.log(moviePoster);

    $(".movie").append(randomMovie + "<br>");
    $(".movie").append(moviePoster + "<br> <br>");

  });
}