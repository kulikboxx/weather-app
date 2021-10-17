'use strict';

const APIKey = '0d8287a4b3a6ebd715cfb24a5fb18503';
const classes = ['.time', '.temperature', '.city', '.cloudy-result', '.humidity-result', '.wind-result', ];
const input = document.querySelector('.current-location');

function generateURL(key, city) {
  if (!city) city = 'Warsaw';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;

  return url;
}

function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response.json()))
      .catch((err) => reject(err));
  });
}

function generateLocalTime(data) {
  let date = new Date();
  let tz = data.timezone;
  let zone = date.getTime() + date.getTimezoneOffset() * 60000 + 1000 * tz;
  let localTime = new Date(zone).toLocaleTimeString();
  let longDayName = new Date(zone).toLocaleDateString('en-US', {
    weekday: 'long',
  });
  let dateArr = new Date(zone).toLocaleDateString().split('.');
  let localTimeString = `${localTime} ${longDayName} ${dateArr[0]}-${dateArr[1]}-${dateArr[2]}`;

  return localTimeString;
}

function showData(data, time) {
  document.querySelectorAll(classes).forEach((element) => {
    switch (element.className) {
      case 'time':
        element.textContent = time;
        break;
      case 'temperature':
        element.textContent = `${Math.round(data.main.temp)}°C`;
        break;
      case 'city':
        element.textContent = data.name;
        break;
      case 'cloudy-result':
        element.textContent = `${data.clouds.all}%`;
        break;
      case 'humidity-result':
        element.textContent = `${data.main.humidity}%`;
        break;
      case 'wind-result':
        element.textContent = `${data.wind.speed}m/s`;
      default:
        return;
    }
  });
}

function initApp() {
  getData(generateURL(APIKey, input.value))
    .then((data) => showData(data, generateLocalTime(data)))
    .catch((err) => alert(err));
  input.value = '';
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') initApp();
});

document.querySelectorAll('.another-city').forEach((city) => {
  city.addEventListener('click', (e) => {
    if (e.target === city) {
      input.value = e.target.textContent;
      initApp();
    }
  });
});

document.addEventListener('DOMContentLoaded', initApp);