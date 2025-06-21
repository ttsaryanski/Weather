import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useReqData } from "../contexts/ReqDataContext";
import { useError } from "../contexts/ErrorContext";

import { weatherService } from "../services/weatherService";

import { formatLocalTime } from "../utils/formatTime";

import Spinner from "./spinner/Spinner";

export default function CurrentDayDetails() {
    const navigate = useNavigate();
    const { setError } = useError();
    const { reqData } = useReqData();

    const [weather, setWeather] = useState(null);
    const [airPollutionData, setAirPollutionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isMetric = reqData.units === "metric";
    const isBG = reqData.lang === "bg";
    const grade = isMetric ? "C" : "F";
    const title = isBG ? "Днес" : "Today";
    const city = isBG ? "Град" : "City";
    const subTitle = isBG ? "Качество на въздуха: " : "Air Quality: ";
    const humidity = isBG ? "Влажност" : "Humidity";
    const wind = isBG ? "Вятър" : "Wind";
    const sunrise = isBG ? "Изгрев" : "Sunrise";
    const sunset = isBG ? "Залез" : "Sunset";
    const visibility = isBG ? "Видимост" : "Visibility";
    const distance = isBG ? "метра" : "meters";
    const pressure = isBG ? "Налягане" : "Pressure";

    let speed = "";
    if (isMetric && isBG) {
        speed = "м/с";
    } else if (isMetric && !isBG) {
        speed = "meter/sec";
    } else if (!isMetric && isBG) {
        speed = "мили/час";
    } else {
        speed = "miles/hour";
    }

    useEffect(() => {
        setError(null);
        setIsLoading(true);
        const fetchAirQuality = async () => {
            try {
                const [data, result] = await Promise.all([
                    weatherService.getWeatherByCoords(
                        reqData.coords.lat,
                        reqData.coords.lon,
                        reqData.units,
                        reqData.lang
                    ),
                    weatherService.getCurrentAirPollutionByCoords(
                        reqData.coords.lat,
                        reqData.coords.lon
                    ),
                ]);
                setWeather(data);
                setAirPollutionData(result.list[0].main.aqi);
            } catch (error) {
                setError("Error fetch air pollution data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAirQuality();
    }, [reqData, setError]);

    const getAQIDescription = (data) => {
        switch (data) {
            case 1:
                return isBG
                    ? { text: "Добро", color: "green" }
                    : { text: "Good", color: "green" };
            case 2:
                return isBG
                    ? { text: "Умерено", color: "yellow" }
                    : { text: "Moderate", color: "yellow" };
            case 3:
                return isBG
                    ? {
                          text: "Нездравословно за чувствителни",
                          color: "orange",
                      }
                    : {
                          text: "Unhealthy for sensitive groups",
                          color: "orange",
                      };
            case 4:
                return isBG
                    ? { text: "Нездравословно", color: "red" }
                    : { text: "Unhealthy", color: "red" };
            case 5:
                return isBG
                    ? { text: "Много нездравословно", color: "purple" }
                    : { text: "Very Unhealthy", color: "purple" };
            default:
                return isBG
                    ? { text: "Няма данни", color: "gray" }
                    : { text: "No data", color: "gray" };
        }
    };

    const aqiInfo = airPollutionData
        ? getAQIDescription(airPollutionData)
        : null;

    return (
        <section className="current-weather">
            <div className="container">
                {isLoading && (
                    <div
                        style={{
                            marginTop: "40px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spinner />
                    </div>
                )}

                {!isLoading && aqiInfo && (
                    <>
                        <h2 id="current-city" style={{ marginTop: "20px" }}>
                            {city}: {weather.name}
                        </h2>

                        <h3
                            id="current-day"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            {title}:{" "}
                            {
                                formatLocalTime(
                                    weather,
                                    reqData.lang,
                                    reqData.timeZone
                                ).weekday
                            }
                            ,{" "}
                            {
                                formatLocalTime(
                                    weather,
                                    reqData.lang,
                                    reqData.timeZone
                                ).date
                            }
                        </h3>

                        <button
                            style={{ display: "block" }}
                            className="button"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                        <div
                            style={{
                                backgroundColor: aqiInfo.color,
                                padding: "10px",
                                borderRadius: "8px",
                                marginTop: "20px",
                                marginBottom: "20px",
                                color:
                                    aqiInfo.color === "yellow"
                                        ? "black"
                                        : "white",
                            }}
                        >
                            <strong>{subTitle}</strong> {aqiInfo.text} (AQI:{" "}
                            {airPollutionData})
                        </div>

                        <div className="row">
                            <h1
                                className="col temp-title"
                                id="current-temperature"
                            >
                                {Math.ceil(weather.main.temp)}°{grade}
                            </h1>
                            <div className="col todays-info">
                                <p id="current-time">
                                    {
                                        formatLocalTime(
                                            weather,
                                            reqData.lang,
                                            reqData.timeZone
                                        ).time
                                    }
                                </p>

                                <p
                                    id="weather-type"
                                    style={{
                                        color: "#444e54",
                                        fontWeight: "bold",
                                        fontSize: "1.2em",
                                    }}
                                >
                                    {weather.weather[0].description}
                                </p>
                            </div>
                            <div id="img">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                    alt="икона"
                                />
                            </div>
                            <div
                                className="col d-flex align-items-center side-info info"
                                style={{ marginLeft: "20px" }}
                            >
                                <ul>
                                    <li>
                                        {humidity}:{" "}
                                        <span id="humidity">
                                            {weather.main.humidity}%
                                        </span>
                                    </li>
                                    <li>
                                        {wind}:{" "}
                                        <span id="wind">
                                            {weather.wind.speed} {speed}
                                        </span>
                                    </li>
                                    <li>
                                        {sunrise}:{" "}
                                        <span id="sunrise">
                                            {
                                                formatLocalTime(
                                                    weather.sys.sunrise,
                                                    reqData.lang,
                                                    reqData.timeZone
                                                ).time
                                            }
                                        </span>
                                    </li>
                                    <li>
                                        {sunset}:{" "}
                                        <span id="sunset">
                                            {
                                                formatLocalTime(
                                                    weather.sys.sunset,
                                                    reqData.lang,
                                                    reqData.timeZone
                                                ).time
                                            }
                                        </span>
                                    </li>
                                    <li>
                                        {visibility}:{" "}
                                        <span id="visibility">
                                            {weather.visibility} {distance}
                                        </span>
                                    </li>
                                    <li>
                                        {pressure}:{" "}
                                        <span id="pressure">
                                            {weather.main.pressure} hPa
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <hr />
        </section>
    );
}
