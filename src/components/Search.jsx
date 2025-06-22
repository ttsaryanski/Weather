import { Link } from "react-router";

import { useReqData } from "../contexts/ReqDataContext";

export default function Search({
    currentCityName,
    onChange,
    onSearch,
    pending,
    isFormValid,
    searchCity,
    errors,
    changeUnits,
    changeLang,
}) {
    const { reqData, resetAll } = useReqData();
    const isBG = reqData.lang === "bg";
    const reset = isBG ? "Нулиране на настройките" : "Reset Settings";

    const handleReset = () => {
        resetAll();
        window.location.reload();
    };

    return (
        <section className="container">
            <div>
                <button
                    style={{ display: "block" }}
                    className="button"
                    onClick={handleReset}
                >
                    {reset}
                </button>
            </div>

            <div className="row">
                <form onSubmit={onSearch} className="col" id="search-form">
                    <input
                        type="text"
                        id="search-input"
                        aria-describedby="searchCity"
                        placeholder="BG & EN allowed..."
                        className="search-form"
                        value={searchCity}
                        onChange={onChange}
                    />
                    {errors.search && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.search}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={!isFormValid || pending}
                        style={
                            !isFormValid || pending
                                ? {
                                      cursor: "not-allowed",
                                  }
                                : {}
                        }
                    >
                        Search
                    </button>
                </form>
                <Link
                    className="col d-flex justify-content-center align-items-center city-title"
                    style={{ color: "#444e54" }}
                    id="searched-city"
                    to="/"
                >
                    {currentCityName}
                </Link>
            </div>
            <span className="measurements">
                <button
                    onClick={() => changeUnits("metric")}
                    id="celcius-link"
                    disabled={reqData.units === "metric"}
                    className={reqData.units === "metric" ? "notactive" : ""}
                >
                    C°
                </button>{" "}
                |
                <button
                    onClick={() => changeUnits("imperial")}
                    id="fahrenheit-link"
                    style={{ marginLeft: "5px" }}
                    disabled={reqData.units === "imperial"}
                    className={reqData.units === "imperial" ? "notactive" : ""}
                >
                    F°
                </button>
            </span>

            <span className="measurements" style={{ marginLeft: "20px" }}>
                <button
                    onClick={() => changeLang("bg")}
                    id="celcius-link"
                    disabled={reqData.lang === "bg"}
                    className={reqData.lang === "bg" ? "notactive" : ""}
                >
                    bg
                </button>{" "}
                |
                <button
                    onClick={() => changeLang("en")}
                    id="fahrenheit-link"
                    style={{ marginLeft: "5px" }}
                    disabled={reqData.lang === "en"}
                    className={reqData.lang === "en" ? "notactive" : ""}
                >
                    en
                </button>
            </span>
        </section>
    );
}
