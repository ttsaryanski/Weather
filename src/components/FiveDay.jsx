import { extractFiveDays } from "../utils/extractFiveDays";

import OneDay from "./oneDay";

export default function FiveDay({ data }) {
    let days = [];
    if (data) {
        days = extractFiveDays(data);
    }

    return (
        <section className="container">
            <div className="row week-forecast">
                {days &&
                    days.map((day, idx) => <OneDay key={day.dt} {...day} />)}
            </div>
        </section>
    );
}
