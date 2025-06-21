export function formatLocalTime(param, lang, timeZone) {
    let dt;
    let timezoneOffsetSeconds;

    if (typeof param === "object" && param.dt !== undefined) {
        dt = param.dt;
        timezoneOffsetSeconds =
            timeZone !== undefined ? timeZone : param.timezone ?? 0;
    } else {
        dt = param;
        timezoneOffsetSeconds = timeZone ?? 0;
    }

    const utcTime = new Date(dt * 1000);

    const offsetHours = timezoneOffsetSeconds / 3600;
    const timeZoneName = `Etc/GMT${offsetHours >= 0 ? "-" : "+"}${Math.abs(
        offsetHours
    )}`;

    const options = {
        timeZone: timeZoneName,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const formatter = new Intl.DateTimeFormat(
        lang === "bg" ? "bg-BG" : "en-US",
        options
    );
    const parts = formatter.formatToParts(utcTime);

    const time = `${parts.find((p) => p.type === "hour").value}:${
        parts.find((p) => p.type === "minute").value
    }`;
    const weekday = parts.find((p) => p.type === "weekday").value;
    const date = `${parts.find((p) => p.type === "day").value}.${
        parts.find((p) => p.type === "month").value
    }.${parts.find((p) => p.type === "year").value}`;

    return { time, weekday, date };
}
