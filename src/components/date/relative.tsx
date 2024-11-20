import { useState, useEffect } from "react";
import DateJs from "../../helpers/DateJs";

export default function RelativeDate({ date }: { date: string }) {
    const [relativeDate, setRelativeDate] = useState(() => DateJs.relative(date));

    useEffect(() => {
        const now = DateJs.now;
        const dateTime = DateJs.from(date);
        const diff = now.diff(dateTime, ["seconds"]);
        const isUnderAMinute = diff.seconds < 60;

        const updateRelativeDate = () => {
            setRelativeDate(DateJs.relative(date));
        };

        // Initial update
        updateRelativeDate();

        // Set interval based on the time difference
        const interval = setInterval(updateRelativeDate, isUnderAMinute ? 1000 : 60000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [date]);

    return <>{relativeDate}</>;
}
