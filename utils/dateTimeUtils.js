export const fromMomentRangeToObjectRange = (dates) => {
    let range = {
        start: null,
        end : null
    }
    if (dates === undefined || dates === null || dates.length === 0)
        return range;
    if (dates[0] !== undefined || dates[0] !== null) {
        range = {
            ...range,
            start: dates[0].format('DD-MM-YYYY')
        }
    }
    if (dates[1] !== undefined || dates[1] !== null) {
        range = {
            ...range,
            end: dates[1].format('DD-MM-YYYY')
        }
    }
    return range;
}