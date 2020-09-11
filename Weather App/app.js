const api = {
    key: "07230eceb422f118128e0e94af555ded",
    base: "https://api.openweathermap.org/data/2.5/"
  }

  const searchbox = document.querySelector(".search-box");
  searchbox.addEventListener("keypress", setQuery);
  
  function setQuery(event) {
    if (event.keyCode === 13) {
      getResults(searchbox.value);
    }
  }

  function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
  }
  
  function displayResults (weather) {
    let city = document.querySelector(".location .city");
    city.innerText = `${weather.name}, ${weather.sys.country}`;
  
    let now = new Date();
    let date = document.querySelector(".location .date");
    date.innerText = dateBuilder(now);
  
    let temp = document.querySelector(".current .temp");
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  
    let weather_el = document.querySelector(".current .weather");
    weather_el.innerText = weather.weather[0].main;
  
    let hilow = document.querySelector(".hi-low");
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
  }
  
  function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
  }

//service worker insert
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
     navigator.serviceWorker.register("/sw.js")  
      .then(reg => {
        console.log("Service Worker Registered", reg);
      }).catch(err => {
        console.log("Service Worker Registration Failed:", err);  
    });
  });
} 

//install to home screen prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

buttonInstall.addEventListener ("click", (e) => {
  hideMyInstallPromotion();
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted"){
      console.log ("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt")
    }
  });
});

window.addEventListener("appinstalled", (evt) => {
  app.logEvent("installed");
});
