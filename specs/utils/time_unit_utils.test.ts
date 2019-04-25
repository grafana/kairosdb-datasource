import forEach from "mocha-each";
import {TimeUnit} from "../../src/beans/aggregators/utils";
import {TimeUnitUtils} from "../../src/utils/time_unit_utils";

describe("TimeUnitUtils", () => {
    describe("extractUnit", () => {
        it("should extract 's' from '1s'", () => {
            // given
            const interval = "1s";
            // when
            const extractedTimeUnit = TimeUnitUtils.extractUnit(interval);
            // then
            // tslint:disable-next-line
            extractedTimeUnit.should.be.equal("s");
        });
        it("should extract 'm' from '1.5m'", () => {
            // given
            const interval = "1.5m";
            // when
            const extractedTimeUnit = TimeUnitUtils.extractUnit(interval);
            // then
            // tslint:disable-next-line
            extractedTimeUnit.should.be.equal("m");
        });
    });
    describe("extractValue", () => {
        it("should extract '2' from '2h'", () => {
            const interval = "2h";
            // when
            const extractedTimeValue = TimeUnitUtils.extractValue(interval);
            // then
            // tslint:disable-next-line
            extractedTimeValue.should.be.equal("2");
        });
        it("should extract '3.5' from '3.5d'", () => {
            const interval = "3.5d";
            // when
            const extractedTimeValue = TimeUnitUtils.extractValue(interval);
            // then
            // tslint:disable-next-line
            extractedTimeValue.should.be.equal("3.5");
        });
    });
    describe("convertTimeUnit", () => {
        forEach([
            ["ms", "MILLISECONDS"],
            ["s", "SECONDS"],
            ["m", "MINUTES"],
            ["h", "HOURS"],
            ["d", "DAYS"],
            ["w", "WEEKS"],
            ["M", "MONTHS"],
            ["y", "YEARS"]
        ]).it("should convert short format time unit: %s into %s", (timeUnit, expected) => {
            TimeUnitUtils.convertTimeUnit(timeUnit).should.be.equal(expected);
        });
        forEach([
            ["millisecond", "MILLISECONDS"],
            ["second", "SECONDS"],
            ["minute", "MINUTES"],
            ["hour", "HOURS"],
            ["day", "DAYS"],
            ["week", "WEEKS"],
            ["month", "MONTHS"],
            ["year", "YEARS"]
        ]).it("should convert long format time unit: %s into %s", (timeUnit, expected) => {
            TimeUnitUtils.convertTimeUnit(timeUnit).should.be.equal(expected);
        });
    });
    describe("getString", () => {
        forEach([
            [TimeUnit.MILLISECONDS, "MILLISECONDS"],
            [TimeUnit.SECONDS, "SECONDS"],
            [TimeUnit.MINUTES, "MINUTES"],
            [TimeUnit.HOURS, "HOURS"],
            [TimeUnit.DAYS, "DAYS"],
            [TimeUnit.WEEKS, "WEEKS"],
            [TimeUnit.MONTHS, "MONTHS"],
            [TimeUnit.YEARS, "YEARS"]
        ]).it("should use TimeUnit.%s and get %s", (timeUnit, expected) => {
            TimeUnitUtils.getString(timeUnit).should.be.equal(expected);
        });
    });
    describe("getShortUnit", () => {
        forEach([
            ["MILLISECONDS", "ms"],
            ["SECONDS", "s"],
            ["MINUTES", "m"],
            ["HOURS", "h"],
            ["DAYS", "d"],
            ["WEEKS", "w"],
            ["MONTHS", "M"],
            ["YEARS", "y"]
        ]).it("should use %s and get %s", (timeUnit, expected) => {
            TimeUnitUtils.getShortUnit(timeUnit).should.be.equal(expected);
        });
    });
});
