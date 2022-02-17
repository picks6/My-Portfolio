
// LIST OF VARIABLES TO BE USED, some given, some empty
var apiKey = "nae9f81ug4cq6pljys6me3xxj";
var preSearchUrlUser = "https://www.speedrun.com/api/v1/users";
var preSearchUrlGame = "https://www.speedrun.com/api/v1/games";
var preSearchUrlRun = "https://www.speedrun.com/api/v1/runs";
var preSearchUrlVariable = "https://www.speedrun.com/api/v1/variables";
var preSearchUrlID = "https://www.speedrun.com/api/v1";
var humanInputUser;
var humanInputGame;
var humanInputRun;
var humanInputVariable;
var humanInputID;
var completedFetchUrl;
var initialData;
var userData;
var gameData;
var runData;
var variableData;
var idData;
var userId;
var url;
var id;
var arrayUser = [];
var arrayGame = [];
var arrayRun = [];
var arrayVariable = [];
var arrayID = [];
var buildArray = [];
var searchArrayReturn = []
var userName = "";
var gameID = '';
var urlTest = '';
var gameName = '';
var secondAPIdata;
var btnEl = document.getElementById("searchBtn");
var fetchURL;
var quoteData = {
  author: '',
  quote: '',
}

// TAKES USER INPUT AND MAKES A USABLE URL OUT OF IT
function createURL(){
  var searchInputEl = document.querySelector("#form1");
  var userNameSearch = searchInputEl.value;
  var fetchURL = "https://www.speedrun.com/api/v1/users/"+userNameSearch;
  console.log(fetchURL);
  findUser(fetchURL);
}

// OMITS THE USER-INPUT STEP, INSTEAD USES THE STORED VALUE TO SEARCH
function searchFromFavorite () {
  var fromFavoriteURL = "https://www.speedrun.com/api/v1/users/"+userName;
  console.log(fromFavoriteURL);
  findUser(fromFavoriteURL);
}
/* 
function makeSearchUrlUser () {
  url = preSearchUrlUser + "/" + humanInputUser;
}; */

// RETRIEVES AND ORDERS ALL THE INFO ABOUT THAT USER
function userInfoFetch(url) {
    searchArrayReturn = [];
    fetch(url)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    userData = data;
    console.log("User data is here:")
    console.log(userData); 
    var buildArray = [];
    for(i=0; i<userData.data.length; i++){
      gameID = userData.data[i].run.game;
        //console.log(gameID);
      gameFetchURL = "https://www.speedrun.com/api/v1/games/"+gameID;
        // urltest.substring(25, urltest.indexOf('/run'))
      sysID = userData.data[i].run.system.platform
      urlTest = userData.data[i].run.weblink;
      catID =  userData.data[i].run.category
      fetchCatUrl = "https://www.speedrun.com/api/v1/categories/"+catID;
      fetchSystemUrl = "https://www.speedrun.com/api/v1/platforms/"+sysID

      var runObject = {
        name: "",
        game: "",
        category: "",
        place: "",
        time: "",
        run_link: "",
      };
      runObject.name = userName;
        //runObject.game =  gameName //urlTest.substring(25, urlTest.indexOf('/run'))
        runObject.place = userData.data[i].place;
        //runObject.time = userData.data[i].run.times.primary_t;
        runObject.run_link = urlTest;
        //console.log(gameName);
        
        findGameName(runObject, gameFetchURL);
        findCatName(runObject, fetchCatUrl);

        toTime(runObject, userData.data[i].run.times.primary_t)
        buildArray.push(runObject);
    };
    searchArrayReturn = buildArray;
    console.log(searchArrayReturn);
    console.log(newFetchUrl);
    console.log("All processes complete.");
    function awaitResults () {
      setTimeout( displayResults, 1000);
    };
    awaitResults();  
    return;
    
  })
};


function findUser(url) {
  fetch(url)
    .then(function (response) {
      //console.log(response.status);
      //Error Handling for users not found
      if (response.status == '404'){
        showErrorModal();
        console.log("this is where an error modal would go");
      }
      return response.json();
    })
    .then(function (data) {
      initialData = data;
      console.log("Un-organized Data is here:");
      userName = initialData.data.names.international
      console.log(userName)
      return initialData;
    })
    .then(function(initialData) {
      id = initialData.data.id;
      console.log("Variable ID: " + id);
      newFetchUrl = 'https://www.speedrun.com/api/v1/users/'+id+'/personal-bests';
      return newFetchUrl;
    })
    .then(function() {
      userInfoFetch(newFetchUrl);
      return;  
    });
};

function findGameName(object, url){
  fetch(url)
    .then(function (response){
      return response.json();
    })
    .then (function(data) {
      gameData = data;
      object.game = (gameData.data.names.international);
      console.log(gameName);
    });
}

function findCatName(object, url){
  fetch(url)
    .then(function (response){
        return response.json();
    })
    .then (function(data) {
        catData = data;
        console.log(catData);
        object.category = (catData.data.name);
        // searchArrayReturn.push(object)
    });
}

//CONVERTS TIME TO hrs/mins/seconds
function toTime(object, seconds){
  var retime = ''
  var date = new Date(null);
  date.setSeconds(seconds);
  retime = date.toISOString().substr(11, 8);
//if hrs = 0, only show mins/seconds
  if(retime.substr(0,3) == '00:'){
    retime2 = retime.substr(3,retime.length)
    object.time = retime2
  }
  else object.time = retime 
    
};

// BUILDS THE RESULTS BOX
function displayResults() {
  var searchResultsContainer = document.getElementById("search-results");
  var resultsTitleBarEl = document.getElementById("results-title-bar");
  var searchInputEl = document.querySelector("#form1");
  var userNameSearch = searchInputEl.value;
  // RESET RESULTS BOX TO BLANK
  document.getElementById('search-results').innerHTML = '<h2 id="search-results-header"></h2><br><table id="search-results-table"></table>';
  var searchResultsHeader = document.getElementById("search-results-header");
  
  if (searchArrayReturn[0] == null || searchArrayReturn[0] == undefined) {
    console.log("user has no runs");
    showNoRunsModal();
    //fetchQuote();
    return;
  }
  
  // SEARCH RESULTS HEADER
  searchResultsHeader.innerHTML = "Search Results: " + searchArrayReturn[0].name;

  // TABLE-BUILDING BEGINS
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  table.classList.add("table", "table-striped", "table-hover");

  table.appendChild(thead);
  table.appendChild(tbody);

  // SETTING UP ROW OF LABELS
  let row_1 = document.createElement('tr');
  let heading_1 = document.createElement('th');
  let heading_2 = document.createElement('th');
  let heading_3 = document.createElement('th');
  let heading_4 = document.createElement('th');
  let heading_5 = document.createElement('th');
  heading_1.setAttribute("scope", "col");
  heading_2.setAttribute("scope", "col");
  heading_3.setAttribute("scope", "col");
  heading_4.setAttribute("scope", "col");
  heading_5.setAttribute("scope", "col");
  heading_1.innerHTML = "Game";
  heading_2.innerHTML = "Category";
  heading_3.innerHTML = "Place";
  heading_4.innerHTML = "Time";
  heading_5.innerHTML = "Link";

  // DISPLAYING ROW OF LABELS
  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  row_1.appendChild(heading_4);
  row_1.appendChild(heading_5);
  thead.appendChild(row_1);

  // SETTING UP AND DISPLAYING ROWS OF RESULTS (the entire for-loop)
  var runCounter = Math.min(searchArrayReturn.length,5)
  
  for (i=0; i<runCounter; i++) {
    let row = document.createElement('tr');
    let name = document.createElement('td');
    let game = document.createElement('td');
    let place = document.createElement('td');
    let time = document.createElement('td');
    let run_link = document.createElement('td');

    var anchor = document.createElement("a");
    anchor.setAttribute("href", searchArrayReturn[i].run_link);
    anchor.setAttribute("target", "_blank");
    var link = document.createElement("button");
    link.setAttribute("name", "col-1");
    link.setAttribute("href", searchArrayReturn[i].run_link);
    link.setAttribute("target", "_blank");
    link.className = "followLinkBtn";
    var fontAwesomeGraphic = document.createElement("i");
    fontAwesomeGraphic.classList.add("fas", "fa-play");

    run_link.appendChild(anchor);
    anchor.appendChild(link);
    link.appendChild(fontAwesomeGraphic);

    row.setAttribute("scope", "row");

    name.innerHTML = searchArrayReturn[i].game;
    game.innerHTML = searchArrayReturn[i].category;
    place.innerHTML = searchArrayReturn[i].place;
    time.innerHTML = searchArrayReturn[i].time;

    row.appendChild(name);
    row.appendChild(game);
    row.appendChild(place);
    row.appendChild(time);
    row.appendChild(run_link);
    tbody.appendChild(row);
  }
  
  //create favorite button
  createButtonEl.textContent = "Make " + searchArrayReturn[0].name + " a Favorite";
  createButtonEl.classList.add("btn-primary", "favBtn");
  createButtonEl.id = 'favBtn';
  searchResultsContainer.append(createButtonEl);
  
  // DISPLAY THE TABLE
  searchResultsContainer.appendChild(table);
};

var createButtonEl = document.createElement('button');


// MODAL for ERRORS
function showErrorModal () {errorInputModal.toggle();}
var errorInputModal = new bootstrap.Modal(document.getElementById('bad-input-modal'));

function showNoRunsModal () {noRunsModal.toggle();};
var noRunsModal = new bootstrap.Modal(document.getElementById('no-runs-for-user'));


// LOCAL STORAGE

// USER STORAGE of RECENT SEARCHES
var storedSearches = JSON.parse(localStorage.getItem("lsStoredRunnerSearches")) || [];
var mostRecentSearch = localStorage.getItem("lsMostRecentRunnerSearch");

// HTML REFERENCE OF THE FAVORITE BUTTONS AND VAULES
var savedFavoriteButton1El = document.getElementById("fav1-btn");
var savedFavoriteButton2El = document.getElementById("fav2-btn");
var savedFavoriteButton3El = document.getElementById("fav3-btn");
var savedFavoriteButton4El = document.getElementById("fav4-btn");
var savedFavoriteButton5El = document.getElementById("fav5-btn");
var savedFavoriteButton6El = document.getElementById("fav6-btn");
var savedFavoriteButton7El = document.getElementById("fav7-btn");
var savedFavoriteButton8El = document.getElementById("fav8-btn");
var savedFavoriteText1El = document.getElementById("fav1-txt");
var savedFavoriteText2El = document.getElementById("fav2-txt");
var savedFavoriteText3El = document.getElementById("fav3-txt");
var savedFavoriteText4El = document.getElementById("fav4-txt");
var savedFavoriteText5El = document.getElementById("fav5-txt");
var savedFavoriteText6El = document.getElementById("fav6-txt");
var savedFavoriteText7El = document.getElementById("fav7-txt");
var savedFavoriteText8El = document.getElementById("fav8-txt");

// FUNCTION TO SAVE SEARCH
function storeSearch () {
  displaySearchHistory();
  updateFavorites();
  console.log("search button was pressed");
  localStorage.setItem("lsMostRecentWeatherSearch", userName);
  console.log(userName + " was stored to localStorage.");
  mostRecentSearch = localStorage.getItem("lsMostRecentWeatherSearch");
  storedSearches.unshift(mostRecentSearch);
  storedSearches.splice(8);
  localStorage.setItem("lsStoredRunnerSearches", JSON.stringify(storedSearches));
  displaySearchHistory();
  setInterval(updateFavorites(), 500);
};

function updateFavorites () {
  if (storedSearches[0] == null || storedSearches[0] == '' || storedSearches[0] == undefined) {savedFavoriteButton1El.classList.add("invisible");};
  if (storedSearches[1] == null || storedSearches[1] == '' || storedSearches[1] == undefined) {savedFavoriteButton2El.classList.add("invisible");};
  if (storedSearches[2] == null || storedSearches[2] == '' || storedSearches[2] == undefined) {savedFavoriteButton3El.classList.add("invisible");};
  if (storedSearches[3] == null || storedSearches[3] == '' || storedSearches[3] == undefined) {savedFavoriteButton4El.classList.add("invisible");};
  if (storedSearches[4] == null || storedSearches[4] == '' || storedSearches[4] == undefined) {savedFavoriteButton5El.classList.add("invisible");};
  if (storedSearches[5] == null || storedSearches[5] == '' || storedSearches[5] == undefined) {savedFavoriteButton6El.classList.add("invisible");};
  if (storedSearches[6] == null || storedSearches[6] == '' || storedSearches[6] == undefined) {savedFavoriteButton7El.classList.add("invisible");};
  if (storedSearches[7] == null || storedSearches[7] == '' || storedSearches[7] == undefined) {savedFavoriteButton8El.classList.add("invisible");};
  showNonNullButtons();
};

function showNonNullButtons () {
  if (storedSearches[0] != null) {savedFavoriteButton1El.classList.remove("invisible"); savedFavoriteButton1El.classList.add("visible");};
  if (storedSearches[1] != null) {savedFavoriteButton2El.classList.remove("invisible"); savedFavoriteButton2El.classList.add("visible");};
  if (storedSearches[2] != null) {savedFavoriteButton3El.classList.remove("invisible"); savedFavoriteButton3El.classList.add("visible");};
  if (storedSearches[3] != null) {savedFavoriteButton4El.classList.remove("invisible"); savedFavoriteButton4El.classList.add("visible");};
  if (storedSearches[4] != null) {savedFavoriteButton5El.classList.remove("invisible"); savedFavoriteButton5El.classList.add("visible");};
  if (storedSearches[5] != null) {savedFavoriteButton6El.classList.remove("invisible"); savedFavoriteButton6El.classList.add("visible");};
  if (storedSearches[6] != null) {savedFavoriteButton7El.classList.remove("invisible"); savedFavoriteButton7El.classList.add("visible");};
  if (storedSearches[7] != null) {savedFavoriteButton8El.classList.remove("invisible"); savedFavoriteButton8El.classList.add("visible");};
}

function displaySearchHistory () {
  savedFavoriteButton1El.textContent = storedSearches[0];
  savedFavoriteButton2El.textContent = storedSearches[1];
  savedFavoriteButton3El.textContent = storedSearches[2];
  savedFavoriteButton4El.textContent = storedSearches[3];
  savedFavoriteButton5El.textContent = storedSearches[4];
  savedFavoriteButton6El.textContent = storedSearches[5];
  savedFavoriteButton7El.textContent = storedSearches[6];
  savedFavoriteButton8El.textContent = storedSearches[7];
  updateFavorites();
};


// SEARCH BUTTON EVENT LISTENER
btnEl.addEventListener('click',createURL);

// SAVE FAVORITE EVENT LISTENER
createButtonEl.addEventListener('click',storeSearch);

// ON-CLICKs FOR STORED SEARCHES
savedFavoriteButton1El.onclick = function () {userName = storedSearches[0]; searchInputEl = storedSearches[0]; searchFromFavorite();}
savedFavoriteButton2El.onclick = function () {userName = storedSearches[1]; searchInputEl = storedSearches[1]; searchFromFavorite();}
savedFavoriteButton3El.onclick = function () {userName = storedSearches[2]; searchInputEl = storedSearches[2]; searchFromFavorite();}
savedFavoriteButton4El.onclick = function () {userName = storedSearches[3]; searchInputEl = storedSearches[3]; searchFromFavorite();}
savedFavoriteButton5El.onclick = function () {userName = storedSearches[4]; searchInputEl = storedSearches[4]; searchFromFavorite();}
savedFavoriteButton6El.onclick = function () {userName = storedSearches[5]; searchInputEl = storedSearches[5]; searchFromFavorite();}
savedFavoriteButton7El.onclick = function () {userName = storedSearches[6]; searchInputEl = storedSearches[6]; searchFromFavorite();}
savedFavoriteButton8El.onclick = function () {userName = storedSearches[7]; searchInputEl = storedSearches[7]; searchFromFavorite();}


// 2nd and 3rd API USE
var randomActivity;
var activityEl = document.getElementById("activity");
var quoteEl = document.getElementById("quote");
var authorEl = document.getElementById("author");

function fetchAndShowRandomActivity () {
  fetch("https://www.boredapi.com/api/activity")
  .then(response => {
    return response.json();
  })
  .then(data => {
    randomActivity = data;
    console.log(randomActivity);
    return
  })
  .then(showRandomActivity);
}

function showRandomActivity () {
  activityEl.textContent = randomActivity.activity;
}

function showQuote(){
  quoteEl.textContent = quoteData.quote;
  authorEl.textContent = "-- " + quoteData.author;
}

function fetchAndShowQuote(){
  fetch("https://free-quotes-api.herokuapp.com/") 
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.author)
    console.log(data.quote)
    quoteData.author = data.author;
    quoteData.quote = data.quote;
  })
  .then(showQuote);
};


// FUNCTIONS RUN ON PAGE-LOAD
fetchAndShowRandomActivity();
fetchAndShowQuote();
displaySearchHistory();