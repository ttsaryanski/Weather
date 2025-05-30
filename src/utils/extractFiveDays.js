export function extractFiveDays(forecastList) {
    const dailyMap = {};

    forecastList.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyMap[date] && entry.dt_txt.includes("12:00:00")) {
            dailyMap[date] = entry;
        }
    });

    return Object.values(dailyMap).slice(0, 5);
}
