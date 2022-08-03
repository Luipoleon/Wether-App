const DAYS = ["Sunday","Monday","Tuesday" , "Wendesday", "Thursday", "Friday","Saturday"];
const  MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", 
              "September", "October", "November", "December"];

let celsiusFarenheit = document.getElementsByClassName("degree-C-F");
let form = document.querySelector("#form");
let locationButton = document.querySelector("#location-button");
let apiKey = "b5baaf103625c4d622aae5b9f9a12952";
let apiUrl = "https://api.openweathermap.org/data/2.5/";
let currentDate = new Date(); 
let timezone;

celsiusFarenheit[0].addEventListener("click",changeCF);
form.addEventListener("submit",send);
locationButton.addEventListener("click", getLocation)

loadDefaultData();


function loadDefaultData()
{
    axios.get(`${apiUrl}weather?q=Paris&units=metric&appid=${apiKey}`).then(updateValues).catch();
    let date = document.getElementById("date");
    let time = document.getElementById("time");
    date.innerHTML = currentDate.toDateString();
    time.innerHTML = currentDate.toLocaleTimeString();
}
function getLocation()
{
    let searchBar = document.querySelector("#searchBar");
    searchBar.value = "";
    navigator.geolocation.getCurrentPosition(changeLocation);
}
function send(event)
{
    event.preventDefault();
    let city = document.getElementById("searchBar").value;
    let searchBar = document.querySelector("#searchBar");
    searchBar.value = "";
    axios.get(`${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`).then(updateValues).catch();
}
function changeLocation (position)
{
    let latitud = position.coords.latitude;
    let longitude = position.coords.longitude;
    axios.get(`${apiUrl}weather?lat=${latitud}&lon=${longitude}&units=metric&appid=${apiKey}`).then(updateValues).catch();
    console.log(position);
}
function updateValues(response)
{
    let temp = document.getElementsByClassName("temp-value").item(0);
    let city = document.querySelector("#city");
    let longitude = response.data.coord.lon;
    let latitude = response.data.coord.lat;
    
    timezone = response.data.timezone;

    temp.innerHTML = Math.round(response.data.main.temp);
    city.innerHTML = response.data.name;
    getCurrentDateTime(timezone);
    axios.get(`${apiUrl}forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`).then(updateForecast).catch();
    
    console.log(response);
}

function updateForecast(response)
{
    console.log(response);
}



function getCurrentDateTime(timezone)
{
    let timezoneHours = timezone/3600;
    let timezoneMinutes = (timezone%3600)/60;
    let date = document.getElementById("date");
    let time = document.getElementById("time");
    currentDate = new Date(); 
    currentDate.setFullYear(currentDate.getUTCFullYear(),currentDate.getUTCMonth(), currentDate.getUTCDate());
    currentDate.setHours(currentDate.getUTCHours()+timezoneHours,currentDate.getUTCMinutes()+timezoneMinutes);

    date.innerHTML = currentDate.toDateString();
    time.innerHTML = currentDate.toLocaleTimeString();
}
//Change Farenheit Celcius 
function changeCF()
{
    let temp = document.getElementsByClassName("temp-value");
    
    if(celsiusFarenheit[0].innerHTML=="°C")
    {
        for(let i=0;i<celsiusFarenheit.length;i++)
        {
            temp[i].innerHTML =Math.round(parseInt(temp[i].innerHTML)*1.8+32);
            celsiusFarenheit[i].innerHTML = "°F";
        }
        
    }
    else
    {
        for(let i=0;i<celsiusFarenheit.length;i++)
        {
            temp[i].innerHTML = Math.round((temp[i].innerHTML-32)*5/9);
            celsiusFarenheit[i].innerHTML = "°C";
        }
    }
   
}

setInterval(function(){
    getCurrentDateTime(timezone);
},1000);
