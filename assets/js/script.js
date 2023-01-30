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

// function for 5 days condition
function fiveDaysCondition(lat, lon) {

    var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(fiveDaysCondition) {
        console.log(fiveDaysCondition);
        $("#CityfiveDays").empty();
        
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: fiveDaysCondition.daily[i].dt,
                icon: fiveDaysCondition.daily[i].weather[0].icon,
                temp: fiveDaysCondition.daily[i].temp.day,
                humidity: fiveDaysCondition.daily[i].humidity
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °C</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#CityfiveDays").append(futureCard);
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
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
var CityList = $(this).text();
currentCondition(CityList);
});
