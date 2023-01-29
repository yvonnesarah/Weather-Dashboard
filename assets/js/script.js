var apiKey = "23e942d86d90cbac1cd7f900775196d1";
var today = moment().format('D/M/Y');
var searchedCityHistoryList = [];

// function for current condition
function currentCondition(city) {

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

$.ajax({
url: queryURL,
method: "GET"
}).then(function(cityWeather) {
console.log(cityWeather);
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
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
var CityList = $(this).text();
currentCondition(CityList);
});
    
