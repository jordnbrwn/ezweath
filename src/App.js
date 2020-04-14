import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Weather from "./components/Weather";

class App extends Component {
  constructor(props) {
    super(props);

    this.interval = null;
    this.APIKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

    this.state = {
      weather: "sunny",
      night: false,
      temperature: null,
    };
  }

  componentDidMount() {
    let url = "";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.APIKey}`;
        fetch(url)
          .then((response) => response.json())
          .then((weather) =>
            this.getWeatherConditions(
              weather.weather,
              weather.main,
              weather.sys
            )
          );

        this.interval = setInterval(() => {
          this.getUpdatedConditions(url);
          return;
        }, 300000);
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getUpdatedConditions(url) {
    console.log("Updated");
    fetch(url)
      .then((response) => response.json())
      .then((weather) =>
        this.getWeatherConditions(weather.weather, weather.main, weather.sys)
      );
  }

  getWeatherConditions(conditions, mainWeather, metadata) {
    let weather = conditions.map((condition) => {
      if (condition.id >= 200 && condition.id <= 232) {
        return "thunderstorm";
      } else if (
        (condition.id >= 500 && condition.id <= 531) ||
        condition.id === 701
      ) {
        return "rain";
      } else if (condition.id >= 600 && condition.id <= 622) {
        return "snow";
      } else if (condition.id === 800) {
        return "clear";
      } else if (condition.id === 801) {
        return "partly-cloudy";
      } else if (condition.id === 802 || condition.id === 803) {
        return "some-clouds";
      } else if (condition.id === 804) {
        return "overcast";
      } else {
        return "";
      }
    });

    if (weather === "rain") this.makeItRain();

    const today = Math.round(new Date().getTime() / 1000);
    const sunDown = metadata.sunset;
    const sunRise = metadata.sunrise;
    let night = false;

    night = today <= sunDown && today >= sunRise ? false : true;
    console.log({ today: today, sunDown: sunDown, sunRise: sunRise });

    this.setState({
      night: night,
      weather: weather,
      temperature: mainWeather.temp,
    });
  }

  makeItRain() {
    //clear out everything
    let rainContainer = document.getElementsByClassName("rain");
    while (rainContainer.firstChild) rainContainer.removeChild(rainContainer);

    var increment = 0;
    var drops = "";
    var backDrops = "";

    while (increment < 100) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      //random number between 5 and 2
      var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
      //increment
      increment += randoFiver;
      //add in a new raindrop with various randomizations to certain CSS properties
      drops +=
        '<div class="drop" style="left: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"><div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div><div class="splat" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div></div>';
      backDrops +=
        '<div class="drop" style="right: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"><div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div><div class="splat" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div></div>';
    }
    const frontRow = document.querySelector(".rain.front-row");
    const backRow = document.querySelector(".rain.back-row");
    frontRow.innerHTML = drops;
    backRow.innerHTML = backDrops;
  }

  render() {
    const weather = this.state.weather;
    const night = this.state.night ? " night" : "";
    return (
      <div className={`App ${weather}${night}`}>
        <div className="rain front-row"></div>
        <div className="rain back-row"></div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="night-clouds"></div>

        <div className="clouds">
          <div className="cloud" id="cloud-base"></div>
          <div className="cloud" id="cloud-back"></div>
          <div className="cloud" id="cloud-mid"></div>
          <div className="cloud" id="cloud-front"></div>
          <svg width="0" height="0">
            <filter id="filter-base">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011"
                numOctaves="5"
                seed="8517"
              />
              <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-back">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011"
                numOctaves="3"
                seed="8517"
              />
              <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-mid">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011"
                numOctaves="3"
                seed="8517"
              />
              <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-front">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.009"
                numOctaves="4"
                seed="8517"
              />
              <feDisplacementMap in="SourceGraphic" scale="50" />
            </filter>
          </svg>
        </div>
        <header>
          <NavBar />
        </header>
        <Weather
          conditions={this.state.weather}
          temperature={this.state.temperature}
        />
      </div>
    );
  }
}

export default App;
