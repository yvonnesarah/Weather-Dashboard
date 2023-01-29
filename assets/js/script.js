var apiKey = "23e942d86d90cbac1cd7f900775196d1";
var today = moment().format('L');
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
<p>Temperature: ${cityWeather.main.temp} °F</p>
<p>Wind: ${cityWeather.wind.speed} MPH</p>
 <p>Humidity: ${cityWeather.main.humidity}\%</p>
`);

$("#cityDetails").append(currentCity);
});
}
