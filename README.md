# 🌦️ Weather App

A simple weather forecast application built with **React**, providing current weather and a 5-day forecast for any city. Powered by the [OpenWeatherMap API](https://openweathermap.org/api) and deployed via **Firebase Hosting**.

## 🔗 Live Demo

🌍 [Weather app](https://weather-55483.web.app)

---

## ✨ Features

-   📍 Auto-detects user location using the Geolocation API.
-   🔍 Search for weather by city.
-   ☀️ Displays current weather, daily forecast, and detailed view.
-   🌀 Shows Air Quality Index (AQI) data.
-   🌍 Supports both **English** and **Bulgarian** languages.
-   🌡️ Toggle between **Metric** and **Imperial** units.
-   🧠 **Global App Context** (`ReqDataContext`) manages:
    -   selected **city**
    -   preferred **language**
    -   chosen **units**
-   💾 **Preferences are saved in `localStorage`**:
    -   Automatically restored on app load or page refresh.
    -   Preserves selected settings when navigating back from the details view.
-   🗑️ **Clear `localStorage`**:
    -   Reset setings in localStorage.

---

## ⚙️ Technologies

-   **React 19** + Vite
-   **Context API**
-   **Firebase Hosting**
-   **OpenWeatherMap API**
    -   Current Weather
    -   5-Day / 3-Hour Forecast
    -   Air Pollution

---

## 🛠️ Setup Instructions

1. **Clone the repo**:

```bash
git clone https://github.com/ttsaryanski/Weather.git
cd Weather
```
