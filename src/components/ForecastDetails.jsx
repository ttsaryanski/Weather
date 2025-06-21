import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useReqData } from "../contexts/ReqDataContext";
import { useError } from "../contexts/ErrorContext";

import { weatherService } from "../services/weatherService";

import { formatLocalTime } from "../utils/formatTime";

import Spinner from "./spinner/Spinner";
import { extractFiveDays } from "../utils/extractFiveDays";

export default function CurrentDayDetails() {
    const navigate = useNavigate();
    const { setError } = useError();
    const { reqData } = useReqData();
    const { dt } = useParams();

    const [city, setCity] = useState("");
    const [selectedDay, setSelectedDay] = useState({});
    const [airPollutionData, setAirPollutionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isMetric = reqData.units === "metric";
    const isBG = reqData.lang === "bg";
    const grade = isMetric ? "C" : "F";
    const cityTitle = isBG ? "Град" : "City";
    const title = isBG ? "Прогноза за" : "Forecast for";
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
                    weatherService.getWeatherByCoordsForFiveDays(
                        reqData.coords.lat,
                        reqData.coords.lon,
                        reqData.units,
                        reqData.lang
                    ),
                    weatherService.getForecastAirPollutionByCoords(
                        reqData.coords.lat,
                        reqData.coords.lon
                    ),
                ]);

                const filteredDay = extractFiveDays(data.list).find(
                    (item) => item.dt === Number(dt)
                );
                setSelectedDay(filteredDay);

                const selectedAQI = result.list.find(
                    (item) => item.dt === Number(dt)
                );
                setAirPollutionData(selectedAQI.main.aqi);

                setCity(data.city.name);
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
                            {cityTitle}: {city}
                        </h2>

                        <h3
                            id="current-day"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            {title}:{" "}
                            {
                                formatLocalTime(
                                    selectedDay,
                                    reqData.lang,
                                    reqData.timeZone
                                ).weekday
                            }
                            ,{" "}
                            {
                                formatLocalTime(
                                    selectedDay,
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
                                {Math.ceil(selectedDay.main.temp)}°{grade}
                            </h1>
                            <div className="col todays-info">
                                <p
                                    id="weather-type"
                                    style={{
                                        color: "#444e54",
                                        fontWeight: "bold",
                                        fontSize: "1.2em",
                                    }}
                                >
                                    {selectedDay.weather[0].description}
                                </p>
                            </div>
                            <div id="img">
                                <img
                                    src={`https://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@2x.png`}
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
                                            {selectedDay.main.humidity}%
                                        </span>
                                    </li>
                                    <li>
                                        {wind}:{" "}
                                        <span id="wind">
                                            {selectedDay.wind.speed} {speed}
                                        </span>
                                    </li>
                                    <li>
                                        {visibility}:{" "}
                                        <span id="visibility">
                                            {selectedDay.visibility} {distance}
                                        </span>
                                    </li>
                                    <li>
                                        {pressure}:{" "}
                                        <span id="pressure">
                                            {selectedDay.main.pressure} hPa
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
