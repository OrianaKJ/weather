const weatherCard = document.querySelector('.weatherBoard__actualWeather')
const key = "0b6964d993c0bc85cfdae89465941f41";
const button = document.querySelector('.buttons__search');
const forecastCards = document.querySelectorAll('.dayCards .card');
let city = document.querySelector('.buttons__city');


if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    console.log('Something went wrong')
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    showCurrentWeather(latitude, longitude);
    showForecast(latitude, longitude);
}

function showError(error) {
    console.log(`something went wrong ${error.message}`);
}

function showCurrentWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;

    fetch(api)
        .then(response => response.json())
        .then(data => convertToWeatherObject(data))
        .then(weather => displayWeather(weather, weatherCard))
        .catch(err => alert(`something went wrong ${error.message}`))
}

function showCurrentWeatherByCityName() {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=0b6964d993c0bc85cfdae89465941f41`;

    fetch(api)
        .then(response => response.json())
        .then(data => convertToWeatherObject(data))
        .then((weather) => displayWeather(weather, weatherCard))
        .catch(err => alert("Wrong city name"))
}

function showForecast(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            let cityName = data.city.name;
            data = data.list.filter(x => x.dt_txt.endsWith('12:00:00'));
            let weather = {};
            for (let i = 0; i < 5; i++) {
                data[i].name = cityName;
                weather = convertToWeatherObject(data[i]);
                displayWeather(weather, forecastCards[i]);
            }
        })
        .catch('Error when loading forecast');
}

function showForecastByCityName() {
    let api = `http://api.openweathermap.org/data/2.5/forecast?q=${city.value}&units=metric&appid=${key}`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            let cityName = data.city.name;
            data = data.list.filter(x => x.dt_txt.endsWith('12:00:00'));
            let weather = {};
            for (let i = 0; i < 5; i++) {
                data[i].name = cityName;
                weather = convertToWeatherObject(data[i]);
                displayWeather(weather, forecastCards[i]);
            }
        })
        .catch('Error when loading forecast');
}

function displayWeather(weather, weatherContainer, today) {
    weatherContainer.innerHTML =
        `<p>${weather.day}</p>
        <h1> ${weather.name}</h1>
        <p><img src="../src/img/${weather.icon}.png"</p>
        <p>${weather.description}</p>
            <p>min ${weather.tempMin} &#8451; / max ${weather.tempMax} &#8451;</p >
            <p>Humidity: ${weather.humidity} %</p>
            <p>Pressure: ${weather.pressure} hPa </p>`;
}

function convertToWeatherObject(data) {
    let weather = {};
    weather.name = data.name
    weather.day = new Date(data.dt * 1000).toISOString().substring(0, 10)
    weather.temp = Math.round(data.main.temp)
    weather.pressure = data.main.pressure
    weather.humidity = data.main.humidity
    weather.tempMin = Math.round(data.main.temp_min)
    weather.tempMax = Math.round(data.main.temp_max)
    weather.description = data.weather[0].description
    weather.icon = data.weather[0].icon
    weather.id = data.weather[0].id
    return weather;
}

button.addEventListener('click', showForecastByCityName);
button.addEventListener('click', showCurrentWeatherByCityName);
