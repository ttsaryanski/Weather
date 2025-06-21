import { createContext, useContext, useState, useEffect } from "react";

const ReqDataContext = createContext();

const defaultReqData = {
    coords: { lat: 0, lon: 0 },
    lang: "bg",
    units: "metric",
    timeZone: 0,
    city: "Габрово",
};

export function ReqDataProvider({ children }) {
    const [reqData, setReqData] = useState(() => {
        const saved = localStorage.getItem("reqData");
        return saved ? JSON.parse(saved) : defaultReqData;
    });

    useEffect(() => {
        localStorage.setItem("reqData", JSON.stringify(reqData));
    }, [reqData]);

    const saveCoords = (lat, lon) => {
        setReqData((prev) => ({
            ...prev,
            coords: { lat, lon },
        }));
    };

    const editLang = (lang) => {
        setReqData((prev) => ({
            ...prev,
            lang,
        }));
    };

    const editUnits = (unit) => {
        setReqData((prev) => ({
            ...prev,
            units: unit,
        }));
    };

    const saveTimeZone = (val) => {
        setReqData((prev) => ({
            ...prev,
            timeZone: val,
        }));
    };

    const editCity = (cityName) => {
        setReqData((prev) => ({
            ...prev,
            city: cityName,
        }));
    };

    return (
        <ReqDataContext.Provider
            value={{
                reqData,
                saveCoords,
                editLang,
                editUnits,
                saveTimeZone,
                editCity,
            }}
        >
            {children}
        </ReqDataContext.Provider>
    );
}

export const useReqData = () => useContext(ReqDataContext);
