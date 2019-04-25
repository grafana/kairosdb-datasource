import {KairosDBResponseHandler} from "../../../src/core/response/response_handler";
import {SeriesNameBuilder} from "../../../src/core/response/series_name_builder";

describe("KairosDBResponseHandler", () => {
    const seriesNameBuilder: SeriesNameBuilder = sinon.createStubInstance(SeriesNameBuilder);
    const responseHandler: KairosDBResponseHandler = new KairosDBResponseHandler(seriesNameBuilder);

    it("should convert datapoints correctly with single result", () => {
        // given
        const data = {
            queries: [{
                results: [
                    {
                        group_by: [
                            {
                                group: {
                                    key: "GROUPby1",
                                    key2: "GROUPby2"
                                },
                                name: "tag"
                            },
                            {
                                group: {
                                    group_number: 123
                                },
                                name: "value"
                            },
                            {
                                group: {
                                    group_number: 456
                                },
                                group_count: 3,
                                name: "time"
                            }
                        ],
                        name: "name",
                        values: [[1, 1512405294], [234, 1512405294]]
                    }
                ]
            }
            ]
        };
        const aliases = ["result1"];
        const expectedDatapoints = [[1512405294, 1], [1512405294, 234]];
        // when
        const datapoints = responseHandler.convertToDatapoints(data, aliases);
        // then
        datapoints.data[0].datapoints.should.deep.equal(expectedDatapoints);
    });

    it("should convert datapoints correctly with multiple results", () => {
        // given
        const data = {
            queries: [{
                results: [
                    {
                        group_by: [
                            {
                                group: {
                                    key: "GROUPby1",
                                    key2: "GROUPby2"
                                },
                                name: "tag"
                            },
                            {
                                group: {
                                    group_number: 123
                                },
                                name: "value"
                            },
                            {
                                group: {
                                    group_number: 456
                                },
                                group_count: 3,
                                name: "time"
                            }
                        ],
                        name: "name",
                        values: [[1, 1512405294], [234, 1512405294]]
                    },
                    {
                        group_by: [
                            {
                                group: {
                                    key: "key",
                                    someOtherKey: "other_key"
                                },
                                name: "tag"
                            },
                            {
                                group: {
                                    group_number: 77
                                },
                                group_count: 31,
                                name: "time"
                            }
                        ],
                        name: "name",
                        values: [[14, 1512413381], [2343, 1512427385]]
                    }
                ]
            }
            ]
        };
        const aliases = ["result1"];
        const expectedDatapoints1 = [[1512405294, 1], [1512405294, 234]];
        const expectedDatapoints2 = [[1512413381, 14], [1512427385, 2343]];
        // when
        const datapoints = responseHandler.convertToDatapoints(data, aliases);
        // then
        datapoints.data[0].datapoints.should.deep.equal(expectedDatapoints1);
        datapoints.data[1].datapoints.should.deep.equal(expectedDatapoints2);
    });
});
