import { useState, useEffect } from "react";

import { useReqData } from "../contexts/ReqDataContext";
import { useError } from "../contexts/ErrorContext";

import { weatherService } from "../services/weatherService";

import CurrentDay from "./CurrentDay";
import ErrorMsg from "./errorComponent/ErrorMsg";
import FiveDay from "./FiveDay";
import Spinner from "./spinner/Spinner";
import Search from "./Search";

export default function Weather() {
    const { reqData, saveCoords, editLang, editUnits, saveTimeZone, editCity } =
        useReqData();
    const { setError } = useError();

    const [weather, setWeather] = useState(null);
    const [fiveDaysWeather, setFiveDaysWeather] = useState([]);
    const [searchCity, setSearchCity] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState({ search: "" });

    const fetchWeatherData = async (city, lat, lon, useCoords = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const [data, fiveDaysData] = await Promise.all([
                useCoords
                    ? weatherService.getWeatherByCoords(
                          lat,
                          lon,
                          reqData.units,
                          reqData.lang
                      )
                    : weatherService.getWeatherByCity(
                          city,
                          reqData.units,
                          reqData.lang
                      ),
                useCoords
                    ? weatherService.getWeatherByCoordsForFiveDays(
                          lat,
                          lon,
                          reqData.units,
                          reqData.lang
                      )
                    : weatherService.getWeatherByCityForFiveDays(
                          city,
                          reqData.units,
                          reqData.lang
                      ),
            ]);

            setWeather(data);
            setFiveDaysWeather(fiveDaysData.list);
            saveCoords(data.coord.lat, data.coord.lon);
            saveTimeZone(fiveDaysData.city.timezone);
            editCity(data.name);
        } catch (error) {
            setError(`Error loading weather for ${city || "coordinates"}.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (reqData.city === "") {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        await fetchWeatherData(null, latitude, longitude, true);
                    },
                    async () => {
                        await fetchWeatherData("");
                    }
                );
            } else {
                await fetchWeatherData(reqData.city);
            }
        };

        loadInitialData();
    }, [reqData.units, reqData.lang]);

    const searchCityHandler = async (e) => {
        e.preventDefault();

        setPending(true);
        await fetchWeatherData(searchCity);
        setSearchCity("");
        setPending(false);
    };

    const validateSearch = (value) => {
        const trimmed = value.trim();

        const cityRegex = /^[A-Za-zА-Яа-яЁё]+(?: [A-Za-zА-Яа-яЁё]+)*$/;

        if (!trimmed) return "City name is required.";
        if (!cityRegex.test(trimmed))
            return "Only letters and single spaces allowed.";

        return "";
    };

    const searchChangeHandler = (e) => {
        const value = e.target.value;
        setSearchCity(value);
        setErrors({ search: validateSearch(value) });
    };

    const changeUnitsHandler = (e) => {
        editUnits(e);
    };

    const changeLangHandler = (e) => {
        editLang(e);
    };

    const isFormValid = !errors.search && searchCity;

    return (
        <>
            <ErrorMsg />

            <Search
                currentCityName={reqData.city}
                onSearch={searchCityHandler}
                onChange={searchChangeHandler}
                pending={pending}
                isFormValid={isFormValid}
                errors={errors}
                searchCity={searchCity}
                changeUnits={changeUnitsHandler}
                changeLang={changeLangHandler}
            />

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

            {weather && !isLoading && (
                <>
                    <CurrentDay weather={weather} />

                    <FiveDay data={fiveDaysWeather} />
                </>
            )}
        </>
    );
}
