const { DateTime } = require("luxon");

const DateJs = {
    from: DateTime.fromISO,

    now: DateTime.now(),

    relative: (date: string) => {
        return DateTime.fromISO(date).toRelative();
    },

    toRfc: (date: string) => {
        return DateTime.fromISO(date).toRFC2822();
    },
};

export default DateJs;
