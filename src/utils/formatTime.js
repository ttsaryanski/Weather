export function formatLocalTime(weather, lang, timeZone) {
    const dt = weather.dt;
    const timezoneOffsetSeconds = weather.timezone || timeZone;

    const cityTime = new Date((dt + timezoneOffsetSeconds) * 1000);

    const hours = cityTime.getUTCHours().toString().padStart(2, "0");
    const minutes = cityTime.getUTCMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    const isBG = lang === "bg";

    const daysEn = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const daysBg = [
        "Неделя",
        "Понеделник",
        "Вторник",
        "Сряда",
        "Четвъртък",
        "Петък",
        "Събота",
    ];

    const days = isBG ? daysBg : daysEn;
    const weekday = days[cityTime.getUTCDay()];

    return { time, weekday };
}
