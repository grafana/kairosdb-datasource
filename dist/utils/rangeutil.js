System.register(["app/core/utils/datemath", "lodash", "moment"], function (exports_1, context_1) {
    "use strict";
    var dateMath, lodash_1, moment_1, spans, rangeOptions, absoluteFormat, rangeIndex;
    var __moduleName = context_1 && context_1.id;
    function getRelativeTimesList(timepickerSettings, currentDisplay) {
        var groups = lodash_1.default.groupBy(rangeOptions, function (option) {
            option.active = option.display === currentDisplay;
            return option.section;
        });
        return groups;
    }
    exports_1("getRelativeTimesList", getRelativeTimesList);
    function formatDate(date) {
        return date.format(absoluteFormat);
    }
    function describeTextRange(expr) {
        var isLast = expr.indexOf("+") !== 0;
        if (expr.indexOf("now") === -1) {
            expr = (isLast ? "now-" : "now") + expr;
        }
        var opt = rangeIndex[expr + " to now"];
        if (opt) {
            return opt;
        }
        if (isLast) {
            opt = { from: expr, to: "now" };
        }
        else {
            opt = { from: "now", to: expr };
        }
        var parts = /^now([-+])(\d+)(\w)/.exec(expr);
        if (parts) {
            var unit = parts[3];
            var amount = parseInt(parts[2], 10);
            var span = spans[unit];
            if (span) {
                opt.display = isLast ? "Last " : "Next ";
                opt.display += amount + " " + span.display;
                opt.section = span.section;
                if (amount > 1) {
                    opt.display += "s";
                }
            }
        }
        else {
            opt.display = opt.from + " to " + opt.to;
            opt.invalid = true;
        }
        return opt;
    }
    exports_1("describeTextRange", describeTextRange);
    function describeTimeRange(range) {
        var option = rangeIndex[range.from.toString() + " to " + range.to.toString()];
        if (option) {
            return option.display;
        }
        if (moment_1.default.isMoment(range.from) && moment_1.default.isMoment(range.to)) {
            return formatDate(range.from) + " to " + formatDate(range.to);
        }
        if (moment_1.default.isMoment(range.from)) {
            var toMoment = dateMath.parse(range.to, true);
            return formatDate(range.from) + " to " + toMoment.fromNow();
        }
        if (moment_1.default.isMoment(range.to)) {
            var from = dateMath.parse(range.from, false);
            return from.fromNow() + " to " + formatDate(range.to);
        }
        if (range.to.toString() === "now") {
            var res = describeTextRange(range.from);
            return res.display;
        }
        return range.from.toString() + " to " + range.to.toString();
    }
    exports_1("describeTimeRange", describeTimeRange);
    return {
        setters: [
            function (dateMath_1) {
                dateMath = dateMath_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {
            spans = {
                s: { display: "second" },
                m: { display: "minute" },
                h: { display: "hour" },
                d: { display: "day" },
                w: { display: "week" },
                M: { display: "month" },
                y: { display: "year" },
            };
            rangeOptions = [
                { from: "now/d", to: "now/d", display: "Today", section: 2 },
                { from: "now/d", to: "now", display: "Today so far", section: 2 },
                { from: "now/w", to: "now/w", display: "This week", section: 2 },
                { from: "now/w", to: "now", display: "This week so far", section: 2 },
                { from: "now/M", to: "now/M", display: "This month", section: 2 },
                { from: "now/M", to: "now", display: "This month so far", section: 2 },
                { from: "now/y", to: "now/y", display: "This year", section: 2 },
                { from: "now/y", to: "now", display: "This year so far", section: 2 },
                { from: "now-1d/d", to: "now-1d/d", display: "Yesterday", section: 1 },
                {
                    from: "now-2d/d",
                    to: "now-2d/d",
                    display: "Day before yesterday",
                    section: 1,
                },
                {
                    from: "now-7d/d",
                    to: "now-7d/d",
                    display: "This day last week",
                    section: 1,
                },
                { from: "now-1w/w", to: "now-1w/w", display: "Previous week", section: 1 },
                { from: "now-1M/M", to: "now-1M/M", display: "Previous month", section: 1 },
                { from: "now-1y/y", to: "now-1y/y", display: "Previous year", section: 1 },
                { from: "now-5m", to: "now", display: "Last 5 minutes", section: 3 },
                { from: "now-15m", to: "now", display: "Last 15 minutes", section: 3 },
                { from: "now-30m", to: "now", display: "Last 30 minutes", section: 3 },
                { from: "now-1h", to: "now", display: "Last 1 hour", section: 3 },
                { from: "now-3h", to: "now", display: "Last 3 hours", section: 3 },
                { from: "now-6h", to: "now", display: "Last 6 hours", section: 3 },
                { from: "now-12h", to: "now", display: "Last 12 hours", section: 3 },
                { from: "now-24h", to: "now", display: "Last 24 hours", section: 3 },
                { from: "now-2d", to: "now", display: "Last 2 days", section: 0 },
                { from: "now-7d", to: "now", display: "Last 7 days", section: 0 },
                { from: "now-30d", to: "now", display: "Last 30 days", section: 0 },
                { from: "now-90d", to: "now", display: "Last 90 days", section: 0 },
                { from: "now-6M", to: "now", display: "Last 6 months", section: 0 },
                { from: "now-1y", to: "now", display: "Last 1 year", section: 0 },
                { from: "now-2y", to: "now", display: "Last 2 years", section: 0 },
                { from: "now-5y", to: "now", display: "Last 5 years", section: 0 },
            ];
            absoluteFormat = "MMM D, YYYY HH:mm:ss";
            rangeIndex = {};
            lodash_1.default.each(rangeOptions, function (frame) {
                rangeIndex[frame.from + " to " + frame.to] = frame;
            });
        }
    };
});
//# sourceMappingURL=rangeutil.js.map