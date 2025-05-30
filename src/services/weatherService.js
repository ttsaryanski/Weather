import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function getWeatherByCoords(lat, lon, units, lang) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
}

async function getWeatherByCity(city, units, lang) {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
}

async function getWeatherByCoordsForFiveDays(lat, lon, units, lang) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
}

async function getWeatherByCityForFiveDays(city, units, lang) {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
}

export const weatherService = {
    getWeatherByCoords,
    getWeatherByCity,
    getWeatherByCoordsForFiveDays,
    getWeatherByCityForFiveDays,
};
