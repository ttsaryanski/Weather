import { createContext, useContext, useState } from "react";

const ReqDataContext = createContext();

const getFromLocalStorage = (key, fallback) => {
    const item = localStorage.getItem(key);
    try {
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

export const ReqDataProvider = ({ children }) => {
    const [city, setCity] = useState(getFromLocalStorage("city", "Габрово"));
    const [units, setUnits] = useState(getFromLocalStorage("units", "metric"));
    const [lang, setLang] = useState(getFromLocalStorage("lang", "bg"));
    const [coords, setCoords] = useState(
        getFromLocalStorage("coords", { lat: null, lon: null })
    );
    const [timeZone, setTimeZone] = useState(
        getFromLocalStorage("timeZone", 0)
    );

    const saveCoords = (lat, lon) => {
        const newCoords = { lat, lon };
        setCoords(newCoords);
        localStorage.setItem("coords", JSON.stringify(newCoords));
    };

    const saveTimeZone = (tz) => {
        setTimeZone(tz);
        localStorage.setItem("timeZone", JSON.stringify(tz));
    };

    const editCity = (newCity) => {
        setCity(newCity);
        localStorage.setItem("city", JSON.stringify(newCity));
    };

    const editLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem("lang", JSON.stringify(newLang));
    };

    const editUnits = (newUnits) => {
        setUnits(newUnits);
        localStorage.setItem("units", JSON.stringify(newUnits));
    };

    const resetAll = () => {
        setCity("Габрово");
        setUnits("metric");
        setLang("bg");
        setCoords({ lat: null, lon: null });
        setTimeZone(0);

        localStorage.removeItem("city");
        localStorage.removeItem("units");
        localStorage.removeItem("lang");
        localStorage.removeItem("coords");
        localStorage.removeItem("timeZone");
    };

    return (
        <ReqDataContext.Provider
            value={{
                reqData: {
                    city,
                    units,
                    lang,
                    coords,
                    timeZone,
                },
                saveCoords,
                saveTimeZone,
                editCity,
                editLang,
                editUnits,
                resetAll,
            }}
        >
            {children}
        </ReqDataContext.Provider>
    );
};

export const useReqData = () => useContext(ReqDataContext);
