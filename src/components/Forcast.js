import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiKey from "../apiKey";
import ReactAnimatedWeather from "react-animated-weather";
import PropTypes from "prop-types";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = useCallback((city) => {
    axios
      .get(
        `${apiKey.base}weather?q=${city}&units=metric&APPID=${apiKey.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setWeather({});
        setError({ message: "Not Found", query: query });
      });
  }, [query]);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    if (query.trim() !== "") {
      search(query);
    }
  }, [query, search]);

  const handleSearch = () => {
    search(query);
    // setTimeout(() => setQuery(""), 1000); // Clear after 1 second
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={handleSearch}
              alt="Search"
            />
          </div>
        </div>
        <ul>
          {weather.main ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys && weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// PropTypes validation
Forecast.propTypes = {
  icon: PropTypes.string.isRequired,
  weather: PropTypes.string.isRequired,
};

export default Forecast;
