var APIKey = "2afc941c65b2296e9898f193e84de7e4";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APIKey;

fetch(queryURL)