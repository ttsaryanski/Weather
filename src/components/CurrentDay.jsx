import { Link } from "react-router";

import { useReqData } from "../contexts/ReqDataContext";

import { formatLocalTime } from "../utils/formatTime";

export default function CurrentDay({ weather }) {
    const { reqData } = useReqData();

    const isMetric = reqData.units === "metric";
    const isBG = reqData.lang === "bg";
    const grade = isMetric ? "C" : "F";
    const title = isBG ? "Днес" : "Today";
    const humidity = isBG ? "Влажност" : "Humidity";
    const wind = isBG ? "Вятър" : "Wind";
    const info = isBG ? "Повече..." : "More info...";
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

    return (
        <section className="current-weather">
            <div className="container">
                <h2 id="current-day" style={{ marginTop: "20px" }}>
                    {title}
                </h2>
                <div className="row">
                    <h1 className="col temp-title" id="current-temperature">
                        {Math.ceil(weather.main.temp)}°{grade}
                    </h1>
                    <div className="col todays-info">
                        <p
                            id="current-day"
                            style={{
                                color: "#444e54",
                                marginBottom: "0",
                            }}
                        >
                            {formatLocalTime(
                                weather,
                                reqData.lang,
                                reqData.timeZone
                            ).weekday.toLocaleUpperCase()}
                            ,{" "}
                            {
                                formatLocalTime(
                                    weather,
                                    reqData.lang,
                                    reqData.timeZone
                                ).date
                            }
                        </p>
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

                        <Link
                            id="info"
                            to={{
                                pathname: `/currentDay/${weather.dt}`,
                            }}
                            style={{
                                display: "block",
                                color: "#444e54",
                                marginBottom: "10px",
                            }}
                        >
                            {info}
                        </Link>
                    </div>
                    <div style={{ display: "flex" }}>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt="икона"
                        />
                    </div>
                </div>
            </div>
            <hr />
        </section>
    );
}
