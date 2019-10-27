// tslint:disable:no-console
import {LegacyTargetConverter} from "../../../src/beans/request/legacy_target_converter";

function sortNestedJSON(object) {
    return JSON.parse(JSON.stringify(object));
}

describe("LegacyTargetConverter", () => {
    const legacyTargetConverter = new LegacyTargetConverter();
    const legacy_simple = {
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
    const modern_simple = {
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
    const legacy_complex = {
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
    const modern_complex = {
        query: {
            aggregators: [
                {
                    autoValueSwitch: {
                        dependentParameters: [
                            {
                                name: "value",
                                text: "every",
                                type: "sampling",
                                value: "1h"
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
                            value: "1h"
                        }
                    ]
                }
            ],
            alias: "query_12345_abcd ( rowname=$_tag_group_rowname, value_group_1=$_value_group_1, time_group_1=$_time_group_1 )",
            groupBy: {
                tags: [
                    "rowname"
                ],
                time: [
                    {
                        count: "100",
                        interval: "10",
                        unit: "MINUTES"
                    }
                ],
                value: [
                    "20"
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
    describe("isApplicable", () => {
        it("should return true for legacy structure", () => {
            // tslint:disable-next-line
            legacyTargetConverter.isApplicable(legacy_simple).should.be.true;
        });
        it("should return false for new structure", () => {
            // tslint:disable-next-line
            legacyTargetConverter.isApplicable(modern_simple).should.be.false;
        });
    });
    describe("convert base case", () => {
        it("should", () => {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_simple).metricName.should.be.equal(modern_simple.query.metricName);
        });
    });
    describe("convert metric name in complex case", () => {
        it("should", () => {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).metricName.should.be.equal(modern_complex.query.metricName);
        });
    });
    describe("alias", () => {
        it("convert alias properly", () => {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).alias.should.be.equal(modern_complex.query.alias);
        });
    });
    describe("alias", () => {
        it("convert tags properly", () => {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).tags.should.be.deep.equal(modern_complex.query.tags);
        });
    });
    describe("alias", () => {
        it("convert groupBy properly", () => {
            // tslint:disable-next-line
            legacyTargetConverter.convert(legacy_complex).groupBy.should.be.deep.equal(modern_complex.query.groupBy);
        });
    });
    describe("alias", () => {
        it("convert aggregators properly", () => {
            // tslint:disable-next-line
            sortNestedJSON(legacyTargetConverter.convert(legacy_complex).aggregators).should.be.deep.equal(sortNestedJSON(modern_complex.query.aggregators));
        });
    });
});
