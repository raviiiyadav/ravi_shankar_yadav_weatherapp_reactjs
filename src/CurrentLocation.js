import React, { useState, useEffect, useCallback } from "react";
import Clock from "react-live-clock";

import AnimatedWeatherIcon from "./components/AnimatedWeather";
import Forcast from "./Forcast";
import loader from "./images/WeatherIcons.gif";
import {
  dateBuilder,
  getPosition,
  getWeatherByCoordinate,
} from "./utils/index.js";

const ONE_MINUTE_IN_MS = 60 * 1000;

const Weather = () => {
  const [coords, setCoords] = useState({
    latitude: undefined,
    longitude: undefined,
  });
  const [weatherData, setWeatherData] = useState({
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
  });
  const [timerID, setTimerID] = useState(undefined);

  const updateWeather = useCallback(async () => {
    const weather = await getWeatherByCoordinate(coords);
    const id = setTimeout(updateWeather, 10 * ONE_MINUTE_IN_MS);
    setTimerID(id);
    setWeatherData((prevWeather) => ({ ...prevWeather, ...weather }));
  }, [coords]);

  useEffect(() => {
    const fetchData = async () => {
      if (!navigator.geolocation) {
        alert("Geolocation not available");
        return;
      }

      let position;

      try {
        position = await getPosition();
      } catch (err) {
        position = { coords: { latitude: 28.67, longitude: 77.22 } };
        alert(
          "The location service is disabled. Allow 'This APP' to access your location. " +
            "Your current location will be used for real-time weather updates."
        );
      }

      setCoords(position.coords);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (coords.latitude !== undefined && coords.longitude !== undefined) {
      updateWeather();
    }
  }, [coords, updateWeather]);

  useEffect(() => {
    return () => clearTimeout(timerID);
  }, [timerID]);

  if (!weatherData.temperatureC) {
    return (
      <>
        <img
          alt="loader"
          src={loader}
          style={{ width: "50%", WebkitUserDrag: "none" }}
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </>
    );
  }

  return (
    <>
      <div className="city">
        <div className="title">
          <h2>{weatherData.city}</h2>
          <h3>{weatherData.country}</h3>
        </div>
        <AnimatedWeatherIcon
          className="mb-icon"
          icon={weatherData.icon}
          title={weatherData.main}
        />
        <div className="date-time">
          <div className="dmy">
            <div id="txt"></div>
            <div className="current-time">
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="current-date">{dateBuilder(new Date())}</div>
          </div>
          <div className="temperature">
            <p>
              {weatherData.temperatureC}°<span>C</span>
            </p>
          </div>
        </div>
      </div>
      <Forcast icon={weatherData.icon} weather={weatherData.main} />
    </>
  );
};

export default Weather;
