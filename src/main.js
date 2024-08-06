"use strict";
// DOM Elements

const date = document.getElementById("date");
const time = document.getElementById("time");
const searchInput = document.querySelector("#search-input");
const city = document.querySelector("#city");
const temp = document.getElementsByClassName("temp-value");
const degreeCF = document.getElementsByClassName("degree-C-F");

// Constants and Variables


const DAYS = ["Sunday", "Monday", "Tuesday", "Wendesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
const MAIN_TEMP = 0;

const celsius = document.getElementById("C");
const farenheit = document.getElementById("F");
const form = document.querySelector("#form");
const locationButton = document.querySelector("#location-button");
const apiKey = "f87be47dba932c04ee16ed4f73c5db4d";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const tempC = new Array();
const tempF = new Array();
let currentDate = new Date();
let timezone;

celsius.addEventListener("click", changeC);
farenheit.addEventListener("click", changeF);
form.addEventListener("submit", send);
locationButton.addEventListener("click", getLocation)

loadDefaultData();


function loadDefaultData() {
    axios.get(`${apiUrl}weather?q=Guadalajara&units=metric&appid=${apiKey}`).then(updateValuesWeather).catch();
    date.innerHTML = currentDate.toDateString();
    time.innerHTML = currentDate.toLocaleTimeString();
}

function getLocation() {
    const city = searchInput.value;
    searchInput.value = "";
    navigator.geolocation.getCurrentPosition(changeLocation);
}

function send(event) {
    event.preventDefault();
    searchInput.value = "";
    axios.get(`${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`).then(updateValuesWeather).catch();
}
function changeLocation(position) {
    const latitud = position.coords.latitude;
    const longitude = position.coords.longitude;
    axios.get(`${apiUrl}weather?lat=${latitud}&lon=${longitude}&units=metric&appid=${apiKey}`)
    .then(updateValuesWeather).catch();
}
function updateValuesWeather(response) {
   
    const temp = document.getElementsByClassName("temp-value").item(0);
   
    const lon = response.data.coord.lon;
    const lat = response.data.coord.lat;

    const icon = document.querySelector("#mainIcon");

    timezone = response.data.timezone;
    tempC[MAIN_TEMP] = Math.round(response.data.main.temp);
    tempF[MAIN_TEMP] = Math.round(tempC[MAIN_TEMP] * 1.8 + 32);
    icon.src = `Pictures/SVG/${response.data.weather[0].icon}.svg`;
    icon.alt = response.data.weather[0].description;


    temp.innerHTML = Math.round(response.data.main.temp);
    city.innerHTML = response.data.name;

    
    getCurrentDateTime(timezone);
    axios.get(`${apiUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`).then(updateForecast).catch();
    changeC();

}

function updateForecast(response) {
    
    const dailyWeather = response.data.list;
    const tempDays = document.getElementsByClassName("temp-value");
    const day = document.getElementsByClassName("day-name");
    const icons = document.getElementsByClassName("day-icon");
    let date;
    let currentDay;
    let dayOfWeek = 0;

    for(let i=1;i<=dailyWeather.length;i++)
    {
      
        date = new Date((dailyWeather[i].dt+timezone)*1000);
        currentDay = date.getDay();
        console.log(currentDay);
        day[dayOfWeek].innerHTML = DAYS[date.getDay()];
        icons[dayOfWeek].src = `Pictures/SVG/${dailyWeather[i].weather[0].icon}.svg`;
        icons[dayOfWeek].alt = dailyWeather[i].weather[0].description;
        
        tempC[dayOfWeek + 1] = Math.round(dailyWeather[i].main.temp);
        tempF[dayOfWeek + 1] = Math.round(tempC[dayOfWeek + 1] * 1.8 + 32);
        tempDays[dayOfWeek + 1].innerHTML = tempC[dayOfWeek + 1];
        i++;
        while(i<dailyWeather.length && currentDay == date.getDay())
        {
            date = new Date((dailyWeather[i].dt+timezone)*1000);
            i++;
        }
        dayOfWeek++;
        
        if(dayOfWeek == 5)
        {
            break;
        }
    }
    
   
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
    const C = document.getElementById("C").style.opacity = "1";
    const F = document.getElementById("F").style.opacity = "0.5";
    temp[0].innerHTML = tempC[0];
    for(let index=1;index<temp.length;index++)
    {
        degreeCF[index+2].innerHTML = "°C";
        temp[index].innerHTML = tempC[index];
    }

    
}
function changeF(){
    
    const C = document.getElementById("F").style.opacity = "1";
    const F = document.getElementById("C").style.opacity = "0.5";
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