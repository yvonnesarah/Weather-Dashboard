var APIKey = "23e942d86d90cbac1cd7f900775196d1";
var today = moment().format('DD/MM/YYYY');
var searchedCityHistoryList = [];

// function for current condition
function currentCondition(city) {

var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

$.ajax({
url: currentURL,
method: "GET"
}).then(function(cityWeather) {
console.log(cityWeather);
var lat = cityWeather.coord.lat;
var lon = cityWeather.coord.lon;
fiveDaysCondition(lat,lon);
$("#weather").css("display", "block");
$("#cityDetails").empty();
        
var iconCode = cityWeather.weather[0].icon;
var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

// showing current city weather conditions information
var currentCity = $(`
<h2 id="CurrentCity">
${cityWeather.name} ${today} <img src="${iconURL}" alt="${cityWeather.weather[0].description}" />
</h2>
<p>Temperature: ${cityWeather.main.temp} °C</p>
<p>Wind: ${cityWeather.wind.speed} KPH</p>
 <p>Humidity: ${cityWeather.main.humidity}\%</p>
`);

$("#cityDetails").append(currentCity);
});
}

// function for 5 days condition
function fiveDaysCondition(lat, lon) {

var fiveDaysURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={minutely,hourly,alerts}&appid=${APIKey}`;

$.ajax({
url: fiveDaysURL,
method: "GET"
}).then(function(fiveDaysCondition) {
console.log(fiveDaysCondition);
$("#CityfiveDays").empty();
        
for (let i = 1; i < 6; i++) {
var cityInformation = {
date: fiveDaysCondition.daily[i].dt,
icon: fiveDaysCondition.daily[i].weather[0].icon,
temp: fiveDaysCondition.daily[i].temp.day,
wind: fiveDaysCondition.daily[i].wind_speed,
humidity: fiveDaysCondition.daily[i].humidity
};

var currentDate = moment.unix(cityInformation.date).format("DD/MM/YYYY");
var iconURL = `<img src="https://openweathermap.org/img/w/${cityInformation.icon}.png" alt="${fiveDaysCondition.daily[i].weather[0].main}" />`;
// displays the date
// an icon representation of weather conditions
// the temperature
// the Wind speed
// the humidity
var fiveDaysCard = $(`
<div class="card pl-3">
<div class="card-body">
<h3>${currentDate}</h3>
<p>${iconURL}</p>
<p>Temp: ${cityInformation.temp} °C</p>
<p>Wind: ${cityInformation.wind} KPH</p>
<p>Humidity: ${cityInformation.humidity}\%</p>
</div>
</div>
<div>
`);
$("#CityfiveDays").append(fiveDaysCard);
}
}); 
}

// add on click event listener 
$("#search-Button").on("click", function(event) {
event.preventDefault();
    
var city = $("#enterACity").val().trim();
currentCondition(city);
if (!searchedCityHistoryList.includes(city)) {
searchedCityHistoryList.push(city);
var searchedCity = $(`
<li class="list-group-item">${city}</li>
`);
$("#searchedCityHistory").append(searchedCity);
};
        
localStorage.setItem("city", JSON.stringify(searchedCityHistoryList));
console.log(searchedCityHistoryList);
});

// WHEN I click on a city in the search history
// THEN I am again presented with current and fivedays conditions for that city
$(document).on("click", ".list-group-item", function() {
var CityList = $(this).text();
currentCondition(CityList);
});
