// Loads a random background color on page load
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

var database = firebase.firestore();
var auth = firebase.auth();

// Setup materialize components. This will call the modals when the buttons are clicked
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var elems = document.querySelectorAll('.carousel');
  M.Carousel.init(elems);
});

// Listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    database.collection("recipes").onSnapshot(snapshot => {
      setupList(snapshot.docs);
      setupUI(user);
      M.AutoInit();
    }, err => {
      console.log(err.message);
    });
  } else {
    setupUI();
    setupList([]);
  }
});

var loggedOutLinks = document.querySelectorAll(".logged-out");
var loggedInLinks = document.querySelectorAll(".logged-in");
var accountDetails = document.querySelector(".account-details");

var setupUI = user => {
  if (user) {
    // Account info
    var html = `<div>Logged in as ${user.email}</div>`;
    accountDetails.innerHTML = html;
    // Toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    // Hide account detials
    accountDetails.innerHTML = "";
    // Toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

var recipeList = document.querySelector(".recipes-details");

var setupList = (data) => {

  if (data.length) {
    var html = "";
    data.forEach(doc => {
      var recipes = doc.data();
      var ul = `
       <ul class='collapsible popout'> 
       <li> 
       <div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>${recipes.label}</div>
       <div class='collapsible-body test' style='font-family: Rajdhani, sans-serif;'><img src=${recipes.image}><h4 class='text'></h4><span class='span'></span>
       <a class="waves-effect waves-light btn grey darken-2 see-recipe" href="${recipes.URL}" target="_blank">See Recipe</a>
       </li>
       </ul>
      `;
      html += ul
      
    });
    recipeList.innerHTML = html;
  } else {
    recipeList.innerHTML = `<h6 class="no-recipes center-align">Make Sure You're Signed In To Save Recipes</h6>`
  }
}
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

  // Sign Up user in firebase
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    var modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    $(".recipes").empty();
    $(".movie").empty();
    $(".carousel").hide();
    signupForm.reset();
  });
});

// Log User Out
var logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  $(".recipes").empty();
  $(".movie").empty();
  $(".carousel").hide();
  auth.signOut();
});

// User Login
var loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  $(".recipes").empty();
  $(".movie").empty();
  $(".carousel").hide();
  // Get User Info
  var email = $("#login-email")
    .val()
    .trim();
  var password = $("#login-password")
    .val()
    .trim();

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // Close the login modal and reset the form
    var modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

// Function to search receipe API
function searchRecipes() {
  // Clears the div
  $(".recipes").empty();

  var itemSearch = $(".uk-search-input")
    .val()
    .trim();
  var queryURL =
    "https://api.edamam.com/search?q=" +
    itemSearch +
    "&app_id=" +
    edamamKey.ashleyID +
    "&app_key=" +
    edamamKey.ashleyKey;

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

        // Added line break for each ingredient
        spanIngredients.append(ingredients + "<br>");

      };
    };
        // Click event for first recipe
        $(document.body).on("click", "#save-recipe0", (e) => {
        e.preventDefault();
        database.collection("recipes").add({
          label: label0,
          image: image0,
          URL: URL0
        }).then(() => {
          var favReciep = document.querySelector("#modal-recipe");
          M.Modal.getInstance(favReciep).open();
        });
        M.AutoInit();
      });
        // Click event for second recipe
        $(document.body).on("click", "#save-recipe1", (e) => {
        e.preventDefault();
        database.collection("recipes").add({
          label: label1,
          image: image1,
          URL: URL1
        }).then(() => {
          var favReciep = document.querySelector("#modal-recipe");
          M.Modal.getInstance(favReciep).open();
        });
        M.AutoInit(); 
      });
        // Click event for third recipe
        $(document.body).on("click", "#save-recipe2", (e) => {
        e.preventDefault();
        database.collection("recipes").add({
          label: label2,
          image: image2,
          URL: URL2
        }).then(() => {
          var favReciep = document.querySelector("#modal-recipe");
          M.Modal.getInstance(favReciep).open();
        });
        M.AutoInit();
      });
        // Click event for fourth recipe
        $(document.body).on("click", "#save-recipe3", (e) => {
        e.preventDefault();
        database.collection("recipes").add({
          label: label3,
          image: image3,
          URL: URL3
        }).then(() => {
          var favReciep = document.querySelector("#modal-recipe");
          M.Modal.getInstance(favReciep).open();
        });
        M.AutoInit();
      });
        // Click event for fifth recipe
        $(document.body).on("click", "#save-recipe4", (e) => {
        e.preventDefault();
        database.collection("recipes").add({
          label: label4,
          image: image4,
          URL: URL4
        }).then(() => {
          var favReciep = document.querySelector("#modal-recipe");
          M.Modal.getInstance(favReciep).open();
        });
        M.AutoInit();
      });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
});

// Click listener to search both APIs at the same time
$("#required-fields").on("submit", function(event) {
  event.preventDefault();
  searchRecipes();
  // SetTimeout because the movie API sends data back faster than the recipes
  setTimeout(function() {
    searchMovie();
  }, 1000);
  // Clears the search field on enter/click
  $(".uk-search-input").val("");
});

function searchMovie() {
  //Clears the div
  $(".movie").empty();


  // Grabs the value of the radio buttons
  if ($("input[type='radio'].with-gap").is(":checked")) {
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
    
    // The nums array is 1-20 for the number of movie results returned from the API's query (it only allows a max of 20 per page unless you query multiple times)
    var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    ranNums = [],
    i = nums.length,
    j = 0;

    // This loop grabs a random number, pushes it to the ranNums array, and removes it from the original pool of the nums array to prevent a dupe 
    while (i--) {
    j = Math.floor(Math.random() * (i+1));
    ranNums.push(nums[j]);
    nums.splice(j,1);
    }

    var moviePoster_1 = "https://image.tmdb.org/t/p/w500" + response.results[ranNums[0]].poster_path + "";
    var moviePoster_2 = "https://image.tmdb.org/t/p/w500" + response.results[ranNums[1]].poster_path + "";
    var moviePoster_3 = "https://image.tmdb.org/t/p/w500" + response.results[ranNums[2]].poster_path + "";
    var moviePoster_4 = "https://image.tmdb.org/t/p/w500" + response.results[ranNums[3]].poster_path + "";
    var moviePoster_5 = "https://image.tmdb.org/t/p/w500" + response.results[ranNums[4]].poster_path + "";

    $(".carousel").show();

    $("#movie_1").attr("src", moviePoster_1);
    $("#movie_2").attr("src", moviePoster_2);
    $("#movie_3").attr("src", moviePoster_3);
    $("#movie_4").attr("src", moviePoster_4);
    $("#movie_5").attr("src", moviePoster_5);
    M.AutoInit();

  });
}