import { formatLocalTime } from "../utils/formatTime";

export default function OneDay(day, timezone) {
    return (
        <div className="col">
            <h3>{formatLocalTime(day, day.lang, timezone).weekday}</h3>
            <br />
            <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="икона"
            />
            <br />
            <p className="weather">{day.weather[0].description}</p>
            <span>{Math.ceil(day.main.temp)}°</span>
        </div>
    );
}
