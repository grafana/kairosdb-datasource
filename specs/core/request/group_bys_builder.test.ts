import forEach from "mocha-each";
import {GroupBysBuilder} from "../../../src/core/request/group_bys_builder";
import {TemplatingUtils} from "../../../src/utils/templating_utils";

import {GroupByTimeEntry} from "../../../src/directives/group_by/group_by_time_entry";
import {buildSamplingConverterMock, buildTemplatingSrvMock} from "../../mocks";

describe("GroupBysBuilder", () => {
    const variables = {
        tagname1: ["v1", "v2", "v3"],
        tagname2: ["v4", "v5"]
    };
    const templatingSrvMock = buildTemplatingSrvMock(variables);
    const templatingUtils: TemplatingUtils =
        new TemplatingUtils(templatingSrvMock, {});
    const alwaysNotApplicableSamplingConverter = buildSamplingConverterMock(null, null, false);
    const groupBysBuilder: GroupBysBuilder = new GroupBysBuilder(templatingUtils, alwaysNotApplicableSamplingConverter);

    const testCases = [
        {
            groupBysDefinition: {
                tags: ["singletag"],
                time: [],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: ["singletag"]
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: ["singletag1", "singletag2", "singletag3"],
                time: [],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: ["singletag1", "singletag2", "singletag3"]
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: ["$tagname1"],
                time: [],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: variables.tagname1
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: ["$tagname1", "$tagname2"],
                time: [],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: _.concat(variables.tagname1, variables.tagname2)
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: ["$tagname1", "$tagname2", "singletag1", "singletag2"],
                time: [],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: _.concat(variables.tagname1, variables.tagname2, "singletag1", "singletag2")
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: [],
                time: [new GroupByTimeEntry("5", "HOURS", 1)],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "time",
                    group_count: 1,
                    range_size: {
                        value: "5",
                        unit: "HOURS"
                    }
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: [],
                time: [new GroupByTimeEntry("5", "HOURS", 1), new GroupByTimeEntry("1", "MINUTE", 2)],
                value: [],
            },
            expectedGroupBys: [
                {
                    name: "time",
                    group_count: 1,
                    range_size: {
                        value: "5",
                        unit: "HOURS"
                    }
                },
                {
                    name: "time",
                    group_count: 2,
                    range_size: {
                        value: "1",
                        unit: "MINUTE"
                    }
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: [],
                time: [],
                value: ["5"],
            },
            expectedGroupBys: [
                {
                    name: "value",
                    range_size: "5"
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: [],
                time: [],
                value: ["5", "10"],
            },
            expectedGroupBys: [
                {
                    name: "value",
                    range_size: "5"
                },
                {
                    name: "value",
                    range_size: "10"
                }
            ]
        },
        {
            groupBysDefinition: {
                tags: ["$tagname1", "$tagname2", "singletag1", "singletag2"],
                time: [new GroupByTimeEntry("5", "HOURS", 1), new GroupByTimeEntry("1", "MINUTE", 2)],
                value: ["5", "10"],
            },
            expectedGroupBys: [
                {
                    name: "tag",
                    tags: _.concat(variables.tagname1, variables.tagname2, "singletag1", "singletag2")
                },
                {
                    name: "time",
                    group_count: 1,
                    range_size: {
                        value: "5",
                        unit: "HOURS"
                    }
                },
                {
                    name: "time",
                    group_count: 2,
                    range_size: {
                        value: "1",
                        unit: "MINUTE"
                    }
                },
                {
                    name: "value",
                    range_size: "5"
                },
                {
                    name: "value",
                    range_size: "10"
                }
            ]
        },
    ];

    forEach(testCases).it("should create group by tags for`%j`", (testCase) => {
        // given
        const groupBysDefinition = testCase.groupBysDefinition;
        // when
        const groupBys: object[] = groupBysBuilder.build(groupBysDefinition);
        // then
        groupBys.should.have.lengthOf(testCase.expectedGroupBys.length);
        testCase.expectedGroupBys.forEach((expectedGroupBy) => {
            groupBys.should.deep.contain(expectedGroupBy);
        });
    });

    it("should use sampling converter when applicable", () => {
        // given
        const samplingConvertingGroupBysBuilder: GroupBysBuilder =
            new GroupBysBuilder(templatingUtils, buildSamplingConverterMock(500, "MILLISECONDS", true));
        const groupBysDefinition = {
            tags: [],
            time: [new GroupByTimeEntry("1.5", "HOURS", 1)],
            value: [],
        };
        const expectedGroupBy = {
            name: "time",
            group_count: 1,
            range_size: {
                value: 500,
                unit: "MILLISECONDS"
            }
        };
        // when
        const groupBys: object[] = samplingConvertingGroupBysBuilder.build(groupBysDefinition);
        // then
        groupBys.should.have.lengthOf(1);
        groupBys.should.deep.contain(expectedGroupBy);
    });
});
