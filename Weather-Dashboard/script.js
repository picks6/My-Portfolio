const APIKey = '4b2bbe282fd4b670bb04b96fa1aed3da';
var cityBank = [];


var btnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
btnEl.on("click", createUrl);
$(".past-searches").on("click", ".cityBtn", pastSearch);

//curent date applied to jumbotron
var date = moment().format("dddd, MMM Do");
var dateEl = document.getElementById("current-date")    
dateEl.textContent = date

// Creating the button for past searches
function addButton(city, state, lat, lon) {
  var a = $("<button>" + city + "</button>");
  a.attr("data-lat", lat).attr("data-lon", lon).attr("data-state", state);
  a.addClass("cityBtn");
  $(".past-searches").append(a);
}

// allows former searches to be searched again
function pastSearch(event) {
  event.preventDefault();
  event.stopPropagation();
  var lat = $(this).data().lat;
  var lon = $(this).data().lon;
  var state = $(this).data().state;
  var city = $(this).text();

  findWeather(city, state, lat, lon);
}


// local storage is called which will add buttons for previous searches
function loadPrevious() {
  if (localStorage.getItem("searches") !== null) {
    var j = localStorage.getItem("searches");
    cityBank = JSON.parse(j);

    for (i = 0; i < cityBank.length; i++) {
      var lat = cityBank[i].lat;
      var lon = cityBank[i].lon;
      var city = cityBank[i].city;
      var state = cityBank[i].state;

      addButton(city, state, lat, lon);
    }
  } 
}


// grabbing the city that was input and creating the url to search for it's coordinates
function createUrl(event) {
  event.preventDefault();
  event.stopPropagation();

  var city = searchInputEl.val();
  var fetchURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&limit=1&appid=" + APIKey;

  findLatLon(fetchURL);

  // Find latitutde and longitude data for the city
  function findLatLon(url) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var state = data[0].state;

        for (i = 0; i < cityBank.length; i++) {
          if (city.toLowerCase() !== cityBank[i].city.toLowerCase()) {
            i++;
          } else {
            findWeather(city, state, lat, lon);
            return;
          }
        }

        var object = {
          lat: lat,
          lon: lon,
          state: state,
          city: city,
        };

        cityBank.push(object);
        localStorage.setItem("searches", JSON.stringify(cityBank));
        addButton(city, state, lat, lon);
        findWeather(city, state, lat, lon);
      });
  }
}

// create fetchURL

function findWeather(city, state, lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=Imperial&appid=" +
    APIKey;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      populateCurrent(data, city, state);
      populateFiveDay(data);
    });
}


// clear what is currently there
// add the new city and weather information to current-weather
function populateCurrent(data, city, state) {
  $(".current-weather").empty();
  

  var cityDiv = $("<div></div>");
  cityDiv.addClass("cityDiv");


  var cityHeader = $("<h2>" + city + ", " + state + "</h2>");
  cityHeader.addClass("cityHeader");
  cityDiv.append(cityHeader);

  $(".current-weather").append(cityDiv);

  var icon = $("<img>");
  var iconCode = data.daily[0].weather[0].icon;
  var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
  icon.attr("src", iconUrl);
  $(".current-weather").append(icon);

  var temp = data.current.temp;
  var tempData = $("<p>Temp: " + temp + "&deg;F</p>");
  $(".current-weather").append(tempData);

  var wind = data.current.wind_speed;
  var winddirection = data.current.wind_deg;
  var directional = "N";
 
  if(winddirection < 11.25){
    directional == "S"
  } else if (winddirection < 33.75){
    directional == 'SSW'
  } else if (winddirection < 56.25){
    directional = 'SW'
  } else if (winddirection < 78.75){
    directional = 'WSW'
  } else if (winddirection < 101.25){
    directional = 'W'
  } else if (winddirection < 123.75){
    directional = 'WNW'
  } else if (winddirection < 146.25){
    directional = 'NW'
  } else if (winddirection < 168.75){
    directional = 'NNW'
  }else if (winddirection < 191.25){
    directional = 'N'
  }else if (winddirection < 213.75){
    directional = 'NNE'
  }else if (winddirection < 236.25){
    directional = 'NE'
  }else if (winddirection < 258.75){
    directional = 'ENE'
  }else if (winddirection < 281.25){
    directional = 'E'
  }else if (winddirection < 303.75){
    directional = 'ESE'
  }else if (winddirection < 326.25){
    directional = 'SE'
  } else if (winddirection < 348.75){
    directional = 'SSE'
  } else {
    directional = 'S'
  };

  var windData = $("<p>Wind: " + wind + " MPH " + directional + "</p>");
  $(".current-weather").append(windData);

  var humidity = data.current.humidity;
  var humidityData = $("<p>Humidity: " + humidity + "%</p>");
  $(".current-weather").append(humidityData);

  var uvIndex = data.current.uvi;
  var uviData = $("<p>UV Index: <span>" + uvIndex + "</span></p>");
  uviData.find("span").addClass('uv');
  $(".current-weather").append(uviData);

  //   Coloring uvIndex Value
  if (uvIndex < 3) {
    $(".uv").attr("style", "background: green; color: white");
  } else if (uvIndex < 6) {
    $(".uv").attr("style", "background: yellow");
  } else {
    $(".uv").attr("style", "background: red; color: white");
  }
  console.log(data.current)
}

// populate the 5 days forecast
//add i iterates as day+1, day+2 etc
function populateFiveDay(data) {
  $(".five-day").empty();

  for (i = 1; i <= 5; i++) {
    var card = $("<div></div>");
    card.addClass("card");
    card.addClass("col-2");

    var date = moment().add(i, "days").format("ddd, MMM Do");
    var cardDate = $("<h3>" + date + "</h3>");
    card.append(cardDate);

    var icon = $("<img>");
    var iconCode = data.daily[i].weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    icon.attr("src", iconUrl);
    card.append(icon);

    var max = data.daily[i].temp.max;
    var highTemp = $("<p>High: " + max + "&deg;F</p>");
    card.append(highTemp);

    var min = data.daily[i].temp.min;
    var lowTemp = $("<p>Low: " + min + "&deg;F</p>");
    card.append(lowTemp);

    var wind = data.daily[i].wind_speed;

    var directional = "N";

    if(winddirection < 11.25){
      directional == "S"
    } else if (winddirection < 33.75){
      directional == 'SSW'
    } else if (winddirection < 56.25){
      directional = 'SW'
    } else if (winddirection < 78.75){
      directional = 'WSW'
    } else if (winddirection < 101.25){
      directional = 'W'
    } else if (winddirection < 123.75){
      directional = 'WNW'
    } else if (winddirection < 146.25){
      directional = 'NW'
    } else if (winddirection < 168.75){
      directional = 'NNW'
    }else if (winddirection < 191.25){
      directional = 'N'
    }else if (winddirection < 213.75){
      directional = 'NNE'
    }else if (winddirection < 236.25){
      directional = 'NE'
    }else if (winddirection < 258.75){
      directional = 'ENE'
    }else if (winddirection < 281.25){
      directional = 'E'
    }else if (winddirection < 303.75){
      directional = 'ESE'
    }else if (winddirection < 326.25){
      directional = 'SE'
    } else if (winddirection < 348.75){
      directional = 'SSE'
    } else {
      directional = 'S'
    };
    var windData = $("<p>Wind: " + wind + " MPH " + directional +"</p>");
    var winddirection = data.current.wind_deg;
    card.append(windData);

    var hum = data.daily[i].humidity;
    var humidityData = $("<p>Humidity: " + hum + "%</p>");
    card.append(humidityData);

    $(".five-day").append(card);
  }
}
