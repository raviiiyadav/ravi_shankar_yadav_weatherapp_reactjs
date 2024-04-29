import React, { useEffect, useState, useCallback } from "react";

import AnimatedWeatherIcon from "./components/AnimatedWeather";
import { getWeatherByQuery } from "./utils/index.js";

export const Forcast = (props) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = useCallback(async (query) => {
    try {
      const weather = await getWeatherByQuery(query);
      setWeather(weather);
      setQuery("");
    } catch (err) {
      console.log("error", err);
      setWeather({});
      setQuery("");
      setError({ message: "Not Found", query });
    }
  }, []);

  useEffect(() => {
    search("Delhi");
  }, [search]);

  return (
    <div className="forecast">
      <AnimatedWeatherIcon className="forecast-icon" icon={props.icon} />
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <form
          onSubmit={(e) => e.preventDefault() || search(query)}
          className="search-box"
        >
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button type="submit">Search</button>
        </form>
        <ul>
          {weather.main ? (
            <>
              <li className="cityHead">
                <p>
                  {weather.city}, {weather.country}
                </p>
                <img
                  alt={`weather icon ${weather.icon}`}
                  className=""
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                />
              </li>
              <li className="temp-side">
                <span>Temperature </span>
                <span>
                  {weather.temperatureC}°c ({weather.main})
                </span>
              </li>
              <li className="temp-side">
                Humidity <span>{Math.round(weather.humidity)}%</span>
              </li>
              <li className="temp-side">
                Wind Speed <span>{Math.round(weather.windSpeed)} Km/h</span>
              </li>
              <li className="temp-side">
                Sunrise <span>{weather.sunrise} AM</span>
              </li>
              <li className="temp-side">
                Sunset <span>{weather.sunset} PM</span>
              </li>
            </>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Forcast;
