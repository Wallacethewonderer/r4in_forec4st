var APIKey = "9cc6336f081865ae4ced614ce1d56d65";
var searchEvent = document.querySelector("#searchForm");
var city = document.querySelector("#searchInput");
var currentWeather = document.querySelector("#currentWeather");
var forecast = document.querySelector("#forecast");


// Search event listener
searchEvent.addEventListener("submit", function(event) {
    event.preventDefault();
    var nameOfCity = city.value.trim();
    if (nameOfCity !== "") {
        getWeather(nameOfCity);
    }
});

// Get weather function after form submission with keyword
function getWeather(nameOfCity) {

    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + nameOfCity + "&appid="+ APIKey + "&units=imperial";

    // Fetch current weather data
    fetch(currentURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // Function that displays current weather data
                    displayCurrent(data);
                    // Function that saves search history
                    saveHistory(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        });


    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + nameOfCity + "&appid="+ APIKey + "&units=imperial";

    // Fetch forecast data
    fetch(forecastURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        }
    );
};

// Function that displays current weather data
function displayCurrent(data) {

    var city = data.name;
    //dt is a unix timestamp, so we need to convert it to a date format 
    //using the Date() constructor function and the toLocaleDateString() method 
    //to display the date in a readable format for the user 
    var date = new Date(data.dt * 1000).toLocaleDateString();
    var icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var wind = data.wind.speed;

    var currentWeatherHTML = "<h1>Current Weather</h1>" +
                             "<h2>" + city + " (" + date + ") " + "<img src='" + icon + "' alt='" + data.weather[0].description + "'></h2>" 
                             +  "<p>Temperature: " + temp + " °F</p>" + "<p>Humidity: " + humidity + "%</p>" + "<p>Wind Speed: " + wind + " MPH</p>";

    currentWeather.innerHTML = currentWeatherHTML;
};

// Function that displays forecast data
function displayForecast(data) {

    var timePicker = data.list.filter(function (time) {
        return time.dt_txt.indexOf("09:00:00") !== -1;
    });

    var forecastHTML = "<h1>5-Day Forecast</h1>"

    timePicker.forEach(function (time) {
        var date = new Date(time.dt * 1000).toLocaleDateString();
        var icon = "https://openweathermap.org/img/w/" + time.weather[0].icon + ".png";
        var temp = time.main.temp;
        var humidity = time.main.humidity;
        var wind = time.wind.speed;

        forecastHTML += "<div>" + "<h5>" + date + "</h5>" + "<img src='" + icon + "' alt='" + time.weather[0].description + "'>"
                            + "<p>Temperature: " + temp + " °F</p>" + "<p>Humidity: " + humidity + "%</p>" + "<p>Wind Speed: " + wind + " MPH</p>" + "</div>";
    });

    forecast.innerHTML = forecastHTML;
};

// Function that saves search history
function saveHistory(data) {
    var savedHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
    savedHistory.push(data.name);
    localStorage.setItem("SearchHistory", JSON.stringify(savedHistory));
    displayHistory();
};

// Function that displays search history
function displayHistory() {
    var history = document.querySelector("#searchHistory");
    var savedHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
    var historyHTML = "<h1>Search History</h1>";

    savedHistory.forEach(function (city) {
        historyHTML += "<button class='historyBtn'>" + city + "</button>";
    });

    history.innerHTML = historyHTML;

    historyElement.querySelectorAll('.historyBtn').forEach(function(button) {
        button.addEventListener('click', displayHistoryWeather);
    });
};

// Function that displays weather for search history
function displayHistoryWeather(event) {
    var nameOfCity = event.target.textContent;
    getWeather(nameOfCity);
};
