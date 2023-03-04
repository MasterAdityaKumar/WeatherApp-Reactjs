import React, { Component } from "react";
import { useState, useEffect } from "react";
import apiKey from "../apiKey";
import Clock from 'react-live-clock';
import Forcast from "./Forcast";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from 'react-animated-weather';


const dateBuilder =(d) =>{
    let months = [
        "January",
        "February", 
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let day = d.getDay();
      let date= d.getDate();
      let month = d.getMonth();
      let year = d.getFullYear();


      return `${day} ,${date} ${month} ${year}`
};

const defaults = {
    icon: 'CLEAR_DAY',
    color: 'goldenrod',
    size: 512,
    animate: true
  };


const Weather = () => {
  const [lat, setLat] = useState(undefined);
  const [lon, setLon] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [temperatureC, setTemperatureC] = useState(undefined);
  const [temperatureF, setTemperatureF] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [humidity, setHumidity] = useState(undefined);
  const [description, setDescription] = useState(undefined);

  const [icon, setIcon] = useState("CLEAR_DAY");
  const [main, setMain] = useState('');
 
  const [sunrise, setSunrise] = useState(undefined);
  const [sunset, setSunset] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const interval = setInterval(
      () => getWeather(lat, lon),
      600000
    );
    return () => clearInterval(interval);
  }, [lat, lon]);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKey.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKey.key}`
    );
    const data = await api_call.json();
    setLat(lat);
    setLon(lon);
    setCity(data.name);
    setTemperatureC(Math.round(data.main.temp));
    setTemperatureF(Math.round(data.main.temp * 1.8 + 32));
    setHumidity(data.main.humidity);
    setDescription(data.weather[0].main);
    setMain(data.weather[0].main);
    setCountry(data.sys.country);

    switch (main) {
      case "Haze":
        setIcon("CLEAR_DAY");
        break;
      case "Clouds":
        setIcon("CLOUDY");
        break;
      case "Rain":
        setIcon("RAIN");
        break;
      case "Snow":
        setIcon("SNOW");
        break;
      case "Dust":
        setIcon("WIND");
        break;
      case "Drizzle":
        setIcon("SLEET");
        break;
      case "Fog":
        setIcon("FOG");
        break;
      case "Smoke":
        setIcon("FOG");
        break;
      case "Tornado":
        setIcon("WIND");
        break;
      default:
        setIcon("CLEAR_DAY");
    }
  };

  if (temperatureC) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{currentDate}</div>
            </div>
            <div className="temperature">
              <p>
                {temperatureC}°<span>C</span>
              </p>
              {/* <span className="slash">/</span>
              {temperatureF} &deg;F */}
            </div>
          </div>
        </div>
         <Forcast icon={icon} weather={main} /> 
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used
          for calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }
}
// export default Currentlocation;

export default Weather;