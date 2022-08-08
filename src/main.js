const DAYS = ["Sunday", "Monday", "Tuesday", "Wendesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
const MAIN_TEMP = 0;

let celsius = document.getElementById("C");
let farenheit = document.getElementById("F");
let form = document.querySelector("#form");
let locationButton = document.querySelector("#location-button");
let apiKey = "b5baaf103625c4d622aae5b9f9a12952";
let apiUrl = "https://api.openweathermap.org/data/2.5/";
let currentDate = new Date();
let timezone;
let tempC = new Array();
let tempF = new Array();
celsius.addEventListener("click", changeC);
farenheit.addEventListener("click", changeF);
form.addEventListener("submit", send);
locationButton.addEventListener("click", getLocation)

loadDefaultData();


function loadDefaultData() {
    axios.get(`${apiUrl}weather?q=London&units=metric&appid=${apiKey}`).then(updateValues).catch();
    let date = document.getElementById("date");
    let time = document.getElementById("time");
    date.innerHTML = currentDate.toDateString();
    time.innerHTML = currentDate.toLocaleTimeString();
}
function getLocation() {
    let searchBar = document.querySelector("#searchBar");
    searchBar.value = "";
    navigator.geolocation.getCurrentPosition(changeLocation);
}
function send(event) {
    event.preventDefault();
    let city = document.getElementById("searchBar").value;
    let searchBar = document.querySelector("#searchBar");
    searchBar.value = "";
    axios.get(`${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`).then(updateValues).catch();
}
function changeLocation(position) {
    let latitud = position.coords.latitude;
    let longitude = position.coords.longitude;
    axios.get(`${apiUrl}weather?lat=${latitud}&lon=${longitude}&units=metric&appid=${apiKey}`).then(updateValues).catch();
    console.log(position);
}
function updateValues(response) {

    let temp = document.getElementsByClassName("temp-value").item(0);
    let city = document.querySelector("#city");
    let lon = response.data.coord.lon;
    let lat = response.data.coord.lat;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,current,minutely`;
    let icon = document.querySelector("#mainIcon");

    timezone = response.data.timezone;
    tempC[MAIN_TEMP] = Math.round(response.data.main.temp);
    tempF[MAIN_TEMP] = Math.round(tempC[MAIN_TEMP] * 1.8 + 32);
    icon.src = `Pictures/SVG/${response.data.weather[0].icon}.svg`;
    icon.alt = response.data.weather[0].description;


    temp.innerHTML = Math.round(response.data.main.temp);
    city.innerHTML = response.data.name;

    
    getCurrentDateTime(timezone);
    axios.get(`${apiUrl}&lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`).then(updateForecast).catch();
    changeC();

    console.log(response);
}

function updateForecast(response) {
    let dailyWeather = response.data.daily;
    let tempDays = document.getElementsByClassName("temp-value");
    let date;
    let day = document.getElementsByClassName("name");
    let icons = document.getElementsByClassName("icon");
    
    

    for(i=1;i<=5;i++)
    {
        date = new Date(dailyWeather[i].dt*1000);
        day[i-1].innerHTML = DAYS[date.getDay()];
        tempC[i] = Math.round(dailyWeather[i].temp.day);
        tempF[i] = Math.round(tempC[i] * 1.8 + 32);
        tempDays[i].innerHTML = tempC[i];
        icons[i-1].src = `Pictures/SVG/${response.data.daily[i].weather[0].icon}.svg`;
        icons[i-1].alt = response.data.daily[i].weather[0].description;

    }
    
    console.log(response);
   
}
function getCurrentDateTime(timezone) {
    let timezoneHours = timezone / 3600;
    let timezoneMinutes = (timezone % 3600) / 60; //Get the reminder of timezoneHours and convert ir to seconds 
    let date = document.getElementById("date");
    let time = document.getElementById("time");
    currentDate = new Date();
    currentDate.setFullYear(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());
    currentDate.setHours(currentDate.getUTCHours() + timezoneHours, currentDate.getUTCMinutes() + timezoneMinutes);

    date.innerHTML = currentDate.toDateString();
    time.innerHTML = currentDate.toLocaleTimeString();
}
//Change Farenheit Celcius 
function changeC() {
    let temp = document.getElementsByClassName("temp-value");
    let degreeCF = document.getElementsByClassName("degree-C-F");
    let C = document.getElementById("C").style.opacity = "1";
    let F = document.getElementById("F").style.opacity = "0.5";
    temp[0].innerHTML = tempC[0];
    for(let index=1;index<temp.length;index++)
    {
        degreeCF[index+2].innerHTML = "°C";
        temp[index].innerHTML = tempC[index];
    }

    
}
function changeF(){
    
    let temp = document.getElementsByClassName("temp-value");
    let degreeCF = document.getElementsByClassName("degree-C-F");
    let C = document.getElementById("F").style.opacity = "1";
    let F = document.getElementById("C").style.opacity = "0.5";
    temp[0].innerHTML = tempF[0];
    for(let index=1;index<temp.length;index++)
    {
        degreeCF[index+2].innerHTML = "°F";
        temp[index].innerHTML = tempF[index];
    }
    

}

setInterval(function () {
    getCurrentDateTime(timezone);
}, 1000);