const {DateTime} = require("luxon")

export default {
    from: DateTime.fromISO,

    relative: (date: string) => {
        return DateTime.fromISO(date).toRelative()
    },

    toRfc: (date: string) => {
        return DateTime.fromISO(date).toRFC2822()
    },
}
