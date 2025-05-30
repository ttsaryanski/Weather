import { formatLocalTime } from "../utils/formatTime";

export default function CurrentDay({ weather, units, lang }) {
    const isMetric = units === "metric";
    const isBG = lang === "bg";
    const grade = isMetric ? "C" : "F";
    const humidity = isBG ? "Влажност" : "Humidity";
    const wind = isBG ? "Вятър" : "Wind";
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
                    Today
                </h2>
                <div className="row">
                    <h1 className="col temp-title" id="current-temperature">
                        {Math.ceil(weather.main.temp)}°{grade}
                    </h1>
                    <div className="col todays-info">
                        <p id="current-time">
                            {formatLocalTime(weather, lang).time}
                        </p>
                        <h2 id="current-day">
                            {formatLocalTime(
                                weather,
                                lang
                            ).weekday.toLocaleUpperCase()}
                        </h2>
                        <p id="weather-type">
                            {weather.weather[0].description}
                        </p>
                    </div>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt="икона"
                    />
                    <div className="col d-flex align-items-center side-info">
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
                        </ul>
                    </div>
                </div>
            </div>
            <hr />
        </section>
    );
}
