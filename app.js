// Tutorial by http://youtube.com/CodeExplained
// api key : 82005d27a116c2880c8f0fcb866998a0
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

const weather  = {};

weather.temperature= {
    unit: "celsius"
}

const KELVIN = 273;

const KEY = "c8822e1d64d60c757a04a7bdf93b6dea";

//Sacando la ubicacion desde la IP
function ipLookUp () {
    $.ajax('http://ip-api.com/json')
    .then(
        function success(response) {
            let latitude  =  response.lat 
            let longitude = response.lon

            getWeather(latitude, longitude)
        },
  
        function fail(data, status) {
            console.log('Request failed.  Returned status of',
                        status);
        },
    );
  }

//CHECK GEOLOCATION 

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition,ipLookUp)
}else{
    ipLookUp();
}
//CHECK USER 
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//GET WEATHER FROM API
function getWeather(latitude, longitude){
    let api = ` https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${KEY}`;
   
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.current.temp - KELVIN);
            weather.description = data.current.weather[0].description;
            weather.iconId = data.current.weather[0].icon;
            weather.locat = data.timezone;

        })
        .then(function(){
            displayWeather();
        });

        function displayWeather(){
            iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`;
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            descElement.innerHTML = `${weather.description}`;
            locationElement.innerHTML = `${weather.locat}`
        }
}

//convercion de C a F

function celsiusToFahrenhait(temperature){
    return (temperature * 9/5) + 32;
}

//convercion de F a C

function FahrenhaitToCelsius(temperature){
    return (temperature - 32) *  5/9;
}

//El listener del Click

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenhait = celsiusToFahrenhait(weather.temperature.value);
        fahrenhait = Math.floor(fahrenhait);
        weather.temperature.value = fahrenhait;

        tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;
        weather.temperature.unit = "fahrenhait";
    }else{
        let celsius = FahrenhaitToCelsius(weather.temperature.value);
        celsius = Math.ceil(celsius);
        weather.temperature.value = celsius;

        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
})
