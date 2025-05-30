import { useState, useEffect } from "react";

import { useError } from "../contexts/ErrorContext";

import { weatherService } from "../services/weatherService";

import CurrentDay from "./CurrentDay";
import ErrorMsg from "./errorComponent/ErrorMsg";
import FiveDay from "./FiveDay";
import Spinner from "./spinner/Spinner";
import Search from "./Search";

export default function Weather() {
    const { setError } = useError();

    const [weather, setWeather] = useState(null);
    const [fiveDaysWeather, setFiveDaysWeather] = useState([]);
    const [timeZone, setTimeZone] = useState(null);
    const [searchCity, setSearchSity] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [currentCity, setCurrentCity] = useState("");
    const [units, setUnits] = useState("metric");
    const [lang, setLang] = useState("bg");
    const [errors, setErrors] = useState({ search: "" });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const [data, fiveDaysData] = await Promise.all([
                        weatherService.getWeatherByCoords(
                            latitude,
                            longitude,
                            units,
                            lang
                        ),
                        weatherService.getWeatherByCoordsForFiveDays(
                            latitude,
                            longitude,
                            units,
                            lang
                        ),
                    ]);
                    setWeather(data);
                    setFiveDaysWeather(fiveDaysData.list);
                    setTimeZone(fiveDaysData.city.timezone);
                    setCurrentCity(data.name);
                } catch {
                    setError("Error loading time by coordinates.");
                } finally {
                    setIsLoading(false);
                }
            },
            async () => {
                try {
                    const [data, fiveDaysData] = await Promise.all([
                        weatherService.getWeatherByCity("Gabrovo", units, lang),
                        weatherService.getWeatherByCityForFiveDays(
                            "Gabrovo",
                            units,
                            lang
                        ),
                    ]);
                    setWeather(data);
                    setFiveDaysWeather(fiveDaysData.list);
                    setTimeZone(fiveDaysData.city.timezone);
                    setCurrentCity(data.name);
                } catch {
                    setError("Error loading weather for Gabrovo.");
                } finally {
                    setIsLoading(false);
                }
            }
        );
    }, [setError]);

    useEffect(() => {
        if (!weather?.name) return;

        const fetchCity = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const [data, fiveDaysData] = await Promise.all([
                    weatherService.getWeatherByCity(currentCity, units, lang),
                    weatherService.getWeatherByCityForFiveDays(
                        currentCity,
                        units,
                        lang
                    ),
                ]);

                setWeather(data);
                setFiveDaysWeather(fiveDaysData.list);
                setTimeZone(fiveDaysData.city.timezone);
                setCurrentCity(data.name);
            } catch (error) {
                setError("Error updating units.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCity();
    }, [units, lang, setError]);

    const searchCityHandler = async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        try {
            const [data, fiveDaysData] = await Promise.all([
                weatherService.getWeatherByCity(searchCity, units, lang),
                weatherService.getWeatherByCityForFiveDays(
                    searchCity,
                    units,
                    lang
                ),
            ]);

            setWeather(data);
            setFiveDaysWeather(fiveDaysData.list);
            setTimeZone(fiveDaysData.city.timezone);
            setCurrentCity(data.name);
            setSearchSity("");
            setIsLoading(false);
        } catch (error) {
            setError("Error loading weather for the searched city.");
        } finally {
            setPending(false);
        }
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
        setSearchSity(value);
        setErrors({ search: validateSearch(value) });
    };

    const changeUnitsHandler = (e) => {
        setUnits(e);
    };

    const changeLangHandler = (e) => {
        setLang(e);
    };

    const isFormValid = !errors.search && searchCity;

    return (
        <>
            <ErrorMsg />

            <Search
                currentCityName={currentCity}
                onSearch={searchCityHandler}
                onChange={searchChangeHandler}
                pending={pending}
                isFormValid={isFormValid}
                errors={errors}
                searchCity={searchCity}
                changeUnits={changeUnitsHandler}
                units={units}
                changeLang={changeLangHandler}
                lang={lang}
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

            {weather && (
                <>
                    <CurrentDay weather={weather} units={units} lang={lang} />

                    <FiveDay
                        data={fiveDaysWeather}
                        lang={lang}
                        timezone={timeZone}
                    />
                </>
            )}
        </>
    );
}
