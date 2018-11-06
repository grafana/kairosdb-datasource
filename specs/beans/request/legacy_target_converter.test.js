"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legacy_target_converter_1 = require("../../../src/beans/request/legacy_target_converter");
var group_by_time_entry_1 = require("../../../src/directives/group_by/group_by_time_entry");
function sortNestedJSON(object) {
    return JSON.parse(JSON.stringify(object));
}
describe("LegacyTargetConverter", function () {
    var legacyTargetConverter = new legacy_target_converter_1.LegacyTargetConverter();
    var legacy_simple = {
        alias: "cnm_cnm_health.mapping_prod.net",
        aliasMode: "default",
        downsampling: "avg",
        errors: {},
        groupBy: {
            timeInterval: "1s"
        },
        horAggregator: {
            factor: "1",
            percentile: "0.75",
            samplingRate: "1s",
            trim: "both",
            unit: "millisecond"
        },
        metric: "cnm_cnm_health.mapping_prod.net",
        refId: "A"
    };
    var modern_simple = {
        hide: false,
        query: {
            aggregators: [],
            groupBy: {
                tags: [],
                time: [],
                value: []
            },
            metricName: "cnm_cnm_health.mapping_prod.net",
            tags: []
        },
        refId: "A"
    };
    var legacy_complex = {
        addFilterTagMode: false,
        addGroupByMode: false,
        addHorizontalAggregatorMode: false,
        alias: "query_12345_abcd ( rowname=$_tag_group_rowname, value_group_1=$_value_group_1, time_group_1=$_time_group_1 )",
        aliasMode: "custom",
        currentGroupByType: "time",
        currentHorizontalAggregatorName: "avg",
        currentTagKey: "",
        currentTagValue: "",
        downsampling: "avg",
        errors: {},
        groupBy: {
            groupCount: "100",
            tagKey: "",
            timeInterval: "1s",
            valueRange: "20"
        },
        groupByTags: [
            "rowname"
        ],
        hasFactor: false,
        hasNothing: false,
        hasPercentile: false,
        hasSamplingRate: false,
        hasTrim: false,
        hasUnit: false,
        hide: false,
        horAggregator: {
            factor: "1",
            percentile: "0.75",
            samplingRate: "1s",
            trim: "both",
            unit: "millisecond"
        },
        horizontalAggregators: [
            {
                name: "avg",
                sampling_rate: "1h"
            }
        ],
        isAggregatorValid: true,
        isGroupByValid: true,
        isTagGroupBy: false,
        isTimeGroupBy: false,
        isValueGroupBy: false,
        metric: "query_12346_child_count.github.net",
        nonTagGroupBys: [
            {
                name: "value",
                range_size: "20"
            },
            {
                group_count: "100",
                name: "time",
                range_size: "10m"
            }
        ],
        refId: "A",
        tags: {
            rowname: [
                "72.246.50.13"
            ]
        }
    };
    var modern_complex = {
        query: {
            aggregators: [
                {
                    autoValueSwitch: {
                        dependentParameters: [
                            {
                                name: "value",
                                text: "every",
                                type: "sampling",
                                value: "1"
                            },
                            {
                                allowedValues: {
                                    0: "MILLISECONDS",
                                    1: "SECONDS",
                                    2: "MINUTES",
                                    3: "HOURS",
                                    4: "DAYS",
                                    5: "WEEKS",
                                    6: "MONTHS",
                                    7: "YEARS"
                                },
                                name: "unit",
                                text: "unit",
                                type: "sampling_unit",
                                value: "HOURS"
                            }
                        ],
                        enabled: false
                    },
                    name: "avg",
                    parameters: [
                        {
                            allowedValues: {
                                0: "NONE",
                                1: "START_TIME",
                                2: "SAMPLING"
                            },
                            name: "sampling",
                            text: "align by",
                            type: "alignment",
                            value: "NONE"
                        },
                        {
                            name: "value",
                            text: "every",
                            type: "sampling",
                            value: "1"
                        },
                        {
                            allowedValues: {
                                0: "MILLISECONDS",
                                1: "SECONDS",
                                2: "MINUTES",
                                3: "HOURS",
                                4: "DAYS",
                                5: "WEEKS",
                                6: "MONTHS",
                                7: "YEARS"
                            },
                            name: "unit",
                            text: "unit",
                            type: "sampling_unit",
                            value: "HOURS"
                        }
                    ]
                }
            ],
            alias: "query_12345_abcd ( rowname=$_tag_group_rowname, value_group_1=$_value_group_1, time_group_1=$_time_group_1 )",
            groupBy: {
                tags: [
                    "rowname"
                ],
                value: [
                    "20"
                ],
                time: [
                    new group_by_time_entry_1.GroupByTimeEntry("10", "MINUTES", 100)
                ]
            },
            metricName: "query_12346_child_count.github.net",
            tags: {
                rowname: [
                    "72.246.50.13"
                ],
            }
        },
        refId: "A"
    };
    describe("isApplicable", function () {
        it("should return true for legacy structure", function () {
            // tslint:disable-next-line
            legacyTargetConverter.isApplicable(legacy_simple).should.be.true;
        });
        it("should return false for new structure", function () {
            // tslint:disable-next-line
            legacyTargetConverter.isApplicable(modern_simple).should.be.false;
        });
    });
    describe("convert base case", function () {
        it("should", function () {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_simple).metricName.should.be.equal(modern_simple.query.metricName);
        });
    });
    describe("convert metric name in complex case", function () {
        it("should", function () {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).metricName.should.be.equal(modern_complex.query.metricName);
        });
    });
    describe("alias", function () {
        it("convert alias properly", function () {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).alias.should.be.equal(modern_complex.query.alias);
        });
    });
    describe("alias", function () {
        it("convert tags properly", function () {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).tags.should.be.deep.equal(modern_complex.query.tags);
        });
    });
    describe("alias", function () {
        it("convert groupBy properly", function () {
            var legacyGroupBy = legacyTargetConverter.convert(legacy_complex).groupBy;
            // For some reason deep.equals returns a false negative even though the contents match
            // tslint:disable-next-line
            legacyGroupBy.time.should.be.deep.equal(modern_complex.query.groupBy.time);
            // tslint:disable-next-line
            legacyGroupBy.tags.should.be.deep.equal(modern_complex.query.groupBy.tags);
            // tslint:disable-next-line
            legacyGroupBy.value.should.be.deep.equal(modern_complex.query.groupBy.value);
        });
    });
    describe("alias", function () {
        it("convert aggregators properly", function () {
            // tslint:disable-next-line
            sortNestedJSON(legacyTargetConverter.convert(legacy_complex).aggregators).should.be.deep.equal(sortNestedJSON(modern_complex.query.aggregators));
        });
    });
});
