import { Link } from "react-router";

import { useReqData } from "../contexts/ReqDataContext";

import { formatLocalTime } from "../utils/formatTime";

export default function OneDay({ ...day }) {
    const { reqData } = useReqData();
    const isBG = reqData.lang === "bg";
    const info = isBG ? "Повече..." : "More info...";

    return (
        <div className="col">
            <h3 style={{ display: "block", marginBottom: "10px" }}>
                <p
                    to={{
                        pathname: `/forecast/${day.dt}`,
                    }}
                    style={{
                        color: "#444e54",
                        fontWeight: "bold",
                        fontSize: "1.2em",
                    }}
                >
                    {
                        formatLocalTime(day, reqData.lang, reqData.timeZone)
                            .weekday
                    }
                </p>
            </h3>
            <p style={{ display: "block" }}>
                {formatLocalTime(day, reqData.lang, reqData.timeZone).date}
            </p>
            <Link
                to={{
                    pathname: `/forecast/${day.dt}`,
                }}
                style={{ color: "#444e54", fontSize: "12px" }}
            >
                {info}
            </Link>
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
