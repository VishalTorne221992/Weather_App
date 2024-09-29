const searchButton = document.querySelector(".search-btn");

const locationButton = document.querySelector('.location-btn');

const CityInput = document.querySelector(".city-input");

const currentWeatherDiv = document.querySelector('.current-weather');

const weatherCardsDiv = document.querySelector(".weather-cards");

const weatherInputDiv = document.querySelector(".weather-input");

const SelectedCityDropdown = document.querySelector("#SearchedCity");

const API_key = "2b4f33086f031c29ab547ef872e5ebdd";

let SearchedCities = [];

// Get User Coodinates for current weather data
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
       position => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            //if(!data.length) return (`No coordinates for the city ${CityName}`);
            //console.log(data);

            const {name, lat, lon} = data[0];

            getWeatherDetails(name, lat, lon);
    
        }).catch(() => {
            alert("An error occurred while fetching the coordinates!");
        })

       },
       error => {
        if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request denied. Please reset location permission ")
        }
       }
    );
}


locationButton.addEventListener('click', getUserCoordinates);

window.onload = homefunction();

function homefunction(){

    
    SearchedCities = JSON.parse(localStorage.getItem("Searched Cities"));
    
    getUserCoordinates();
   
    if(SearchedCities.length){
        createDropdownMenu(SearchedCities);
    }else{
        getUserCoordinates();
    } 

    localStorage.setItem("Searched Cities", JSON.stringify(SearchedCities));

}

window.onbeforeunload = function(){
    if(!(JSON.parse(localStorage.getItem("Searched Cities")))){
        SearchedCities = []
    }
    localStorage.setItem("Searched Cities", JSON.stringify(SearchedCities));
}


searchButton.addEventListener("click", getCityCoordinates);
CityInput.addEventListener('keyup', e => e.key === "Enter" && getCityCoordinates());



function getCityCoordinates(){
    const CityName =  CityInput.value.trim();
    SearchedCities = JSON.parse(localStorage.getItem("Searched Cities"));

    if(!CityName){
        alert('No City Name Entered !');
        return
    } 

    const weather_url = `https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_key}`;
    console.log(CityName);

    fetch(weather_url).then(res => res.json()).then(data => {
        if(!data.length){
            alert(`No coordinates for the city ${CityName}`);
            return
        }
        SearchedCities.push(CityName);
        let dropdownCities = new Set(SearchedCities)
        console.log('Set Cities', dropdownCities);
        localStorage.setItem("Searched Cities", JSON.stringify(SearchedCities));

        if(SearchedCities.length === 1){
        createDropdownMenu(dropdownCities);
        }else{
        updateDropdown(dropdownCities);
        } 

        const {name, lat, lon} = data[0];

        getWeatherDetails(name, lat, lon);

    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    })
}

function updateDropdown(cities){

    let updatedCitiesSelect = document.getElementById("SearchedCity"); 
    updatedCitiesSelect.replaceChildren();

    cities.forEach((city) => {
        var option = document.createElement("option");
        option.innerHTML = city;
        updatedCitiesSelect.appendChild(option);
    })


}

function handleSelectCityChange(e){
        console.log('select city', e.target.options[e.target.selectedIndex]);
        let selectedCity = e.target.value;

        const weather_url_Selected = `https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity}&limit=1&appid=${API_key}`;

        // Get user city weather information
        fetch(weather_url_Selected).then(res => res.json()).then(data => {
            if(!data.length){
                alert(`No coordinates for the city ${CityName}`);
                return
            } 
            console.log(data);
            const {name, lat, lon} = data[0];
    
            getWeatherDetails(name, lat, lon);
    
        }).catch(() => {
            alert("An error occurred while fetching the coordinates!");
        })
}

function createDropdownMenu(cities){
 
         const dropdown = document.createElement('select');
         dropdown.id = 'SearchedCity';


         cities.forEach(city => {
            var option = document.createElement("option");
            option.defaultSelected = true;
            option.innerHTML = city;
            dropdown.appendChild(option);
         })

         dropdown.addEventListener('change', handleSelectCityChange.bind(this));
         weatherInputDiv.appendChild(dropdown);

}


function getWeatherDetails(cityName, lat, lon){


    const Weather_API_Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(Weather_API_Url).then(res => res.json()).then(data => {
        const UniqueForcastDays = [];
        console.log(data);
   
        // Get unique forcast date based on date of weather of the city
    const FiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();

            if(!UniqueForcastDays.includes(forecastDate)){
                return UniqueForcastDays.push(forecastDate);
            }

        })

        CityInput.value = "";
        currentWeatherDiv.replaceChildren();
        weatherCardsDiv.replaceChildren();

        console.log(FiveDaysForecast);
        FiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherItemCard(cityName, weatherItem, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherItemCard(cityName, weatherItem, index));
            }
            

        })
    }).catch(() => {
        alert("An error occurred while fetching weather forecast!");
    })
}


const createWeatherItemCard = (cityName, weatherItem, index) => {

    if(index === 0){

        return `<div class="details">
                    <h2>${cityName} <p>(${weatherItem.dt_txt.split(" ")[0]})</p></h2>
                    <h4>Temperature : ${(weatherItem.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</h4>
                    <h4>Wind : ${weatherItem.wind.speed} m/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    }else{

        return `<li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp : ${(weatherItem.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</h4>
                        <h4>Wind : ${weatherItem.wind.speed} m/s</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </li>`
    }     
}