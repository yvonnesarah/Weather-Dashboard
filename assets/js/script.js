// API key for OpenWeatherMap API
var APIKey = "81c0d22b83ccbe180ccf4acf19f7d978";

// Get today's date using Moment.js and format it as DD/MM/YYYY
var today = moment().format('DD/MM/YYYY');

// Initialize an empty array to store the search history of cities
var searchedCityHistoryList = [];

// Function to get the current weather condition for a specific city
function currentCondition(city) {
    // Construct the URL for the current weather API endpoint with city and API key
    var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

    // Make an AJAX GET request to the OpenWeather API
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function(cityWeather) {
        console.log(cityWeather); // Log the full city weather response for debugging
        
        // Get the latitude and longitude from the API response to use in the 5-day forecast
        var lat = cityWeather.coord.lat;
        var lon = cityWeather.coord.lon;
        
        // Call the function to get the 5-day forecast using the latitude and longitude
        fiveDaysCondition(lat, lon);
        
        // Show the weather section
        $("#weather").css("display", "block");
        
        // Clear any previous city details
        $("#cityDetails").empty();
        
        // Get the icon code from the API response for the weather icon
        var iconCode = cityWeather.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        // Create a new HTML element to display the current city weather details
        var currentCity = $(`
            <h2 id="CurrentCity">
                ${cityWeather.name} ${today} <img src="${iconURL}" alt="${cityWeather.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeather.main.temp} °C</p>
            <p>Wind: ${cityWeather.wind.speed} KPH</p>
            <p>Humidity: ${cityWeather.main.humidity}%</p>
        `);

        // Append the current city weather details to the cityDetails section
        $("#cityDetails").append(currentCity);
    });
}

// Function to get the 5-day weather forecast for a city based on latitude and longitude
function fiveDaysCondition(lat, lon) {
    // Construct the URL for the 5-day weather forecast API endpoint with lat, lon, and API key
    var fiveDaysURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={minutely,hourly,alerts}&appid=${APIKey}`;

    // Make an AJAX GET request to the OpenWeather API for the 5-day forecast
    $.ajax({
        url: fiveDaysURL,
        method: "GET"
    }).then(function(fiveDaysCondition) {
        console.log(fiveDaysCondition); // Log the full 5-day forecast response for debugging
        
        // Clear any previous 5-day forecast cards
        $("#CityfiveDays").empty();

        // Loop through the 5 days of weather forecast (index 1 to 5 as index 0 is today)
        for (let i = 1; i < 6; i++) {
            // Create an object to hold the weather information for each day
            var cityInformation = {
                date: fiveDaysCondition.daily[i].dt, // Date of the forecast
                icon: fiveDaysCondition.daily[i].weather[0].icon, // Weather icon code
                temp: fiveDaysCondition.daily[i].temp.day, // Temperature for the day
                wind: fiveDaysCondition.daily[i].wind_speed, // Wind speed for the day
                humidity: fiveDaysCondition.daily[i].humidity // Humidity for the day
            };

            // Convert the date from UNIX timestamp to a human-readable format (DD/MM/YYYY)
            var currentDate = moment.unix(cityInformation.date).format("DD/MM/YYYY");

            // Construct the URL for the weather icon image
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInformation.icon}.png" alt="${fiveDaysCondition.daily[i].weather[0].main}" />`;

            // Create an HTML card to display the weather information for each day
            var fiveDaysCard = $(`
                <div class="card pl-3">
                    <div class="card-body">
                        <h3>${currentDate}</h3>
                        <p>${iconURL}</p>
                        <p>Temp: ${cityInformation.temp} °C</p>
                        <p>Wind: ${cityInformation.wind} KPH</p>
                        <p>Humidity: ${cityInformation.humidity}%</p>
                    </div>
                </div>
            `);

            // Append the 5-day forecast card to the CityfiveDays section
            $("#CityfiveDays").append(fiveDaysCard);
        }
    });
}

// Event listener for the search button click
$("#search-Button").on("click", function(event) {
    event.preventDefault(); // Prevent the default form submission action
    
    // Get the value entered in the city input field
    var city = $("#enterACity").val().trim();
    
    // Call the function to get the current weather for the entered city
    currentCondition(city);
    
    // If the city is not already in the search history, add it
    if (!searchedCityHistoryList.includes(city)) {
        searchedCityHistoryList.push(city);
        
        // Create a new list item for the city and append it to the search history
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
        `);
        $("#searchedCityHistory").append(searchedCity);
    }

    // Save the updated search history to localStorage
    localStorage.setItem("city", JSON.stringify(searchedCityHistoryList));
    console.log(searchedCityHistoryList); // Log the search history list for debugging
});

// Event listener for clicking a city in the search history list
$(document).on("click", ".list-group-item", function() {
    // Get the city name from the clicked list item
    var CityList = $(this).text();
    
    // Call the function to get the current weather for the clicked city
    currentCondition(CityList);
});
