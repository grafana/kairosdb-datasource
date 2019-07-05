import moment from "moment";
import {KairosDBQueryBuilder} from "../../../src/core/request/query_builder";
import {buildTemplatingSrvMock} from "../../mocks";

describe("QueryBuilder", () => {
    const templatingSrvMock = buildTemplatingSrvMock({
        ping: ["pong"],
        vars: ["variable_1", "variable_2", "variable_3"],
    });

    const queryBuilder: KairosDBQueryBuilder =
        new KairosDBQueryBuilder(true, "url", "api", templatingSrvMock, {});
    const defaultTimeRange = {
        from: moment(),
        to: moment().add(1, "weeks")
    };
    const emptyTarget = {
        metricName: "target",
        query: {
            aggregators: [],
            groupBy: {
                name: "tag",
                tags: [],
                time: [],
                value: []
            }
        }
    };

    it("should build with credentials", () => {
        // given
        const options = {
            panelId: "panelId",
            range: defaultTimeRange,
        };
        const panelId = "panelId";
        // when
        const datapointsQuery = queryBuilder.buildDatapointsQuery([emptyTarget], options);
        // then
        // tslint:disable-next-line
        datapointsQuery.withCredentials.should.be.true;
    });

    it("should build without credentials", () => {
        // given
        const options = {
            panelId: "panelId",
            range: defaultTimeRange
        };
        const queryBuilderWithoutCredentials: KairosDBQueryBuilder =
            new KairosDBQueryBuilder(false, "url", "api", templatingSrvMock, {});
        // when
        const datapointsQuery =
            queryBuilderWithoutCredentials.buildDatapointsQuery([emptyTarget], options);
        // then
        // tslint:disable-next-line
        datapointsQuery.withCredentials.should.be.false;
    });

    it("should build request id containing panel id", () => {
        // given
        const panelId = "unique_panel_id";
        const options = {
            panelId,
            range: defaultTimeRange
        };
        // when
        const datapointsQuery = queryBuilder.buildDatapointsQuery([emptyTarget], options);
        // then
        // tslint:disable-next-line
        datapointsQuery.requestId.should.contain(panelId);
    });

    it("should use correct time range", () => {
        // given
        const from = moment(1511861103);
        const expectedFrom = 1511861000;
        const to = moment(1511893173);
        const expectedTo = 1511893000;
        const options = {
            panelId: "panelId",
            range: {from, to}
        };
        // when
        const datapointsQuery = queryBuilder.buildDatapointsQuery([], options);
        // then
        datapointsQuery.data.start_absolute.should.equal(expectedFrom);
        datapointsQuery.data.end_absolute.should.equal(expectedTo);
    });

    it("should unpack tags correctly", () => {
        // given
        const tags: object = {
            "an empty tag": [],
            "tag1": ["$ping", "$not_a_variable", "set", "of", "tags"],
            "yet another tag": ["another tag", "with multiword", "$vars"]
        };
        const expectedTags: object = {
            "tag1": ["pong", "$not_a_variable", "set", "of", "tags"],
            "yet another tag": ["another tag", "with multiword", "variable_1", "variable_2", "variable_3"]
        };
        const options = {
            panelId: "panelId",
            range: defaultTimeRange
        };
        // when
        const datapointsQuery = queryBuilder.buildDatapointsQuery([{
            metricName: "testMetric",
            query: {
                aggregators: [],
                groupBy: {
                    name: "tag",
                    tags: [],
                    time: [],
                    value: []
                },
                tags
            }
        }], options);
        // then
        datapointsQuery.data.metrics[0].tags.should.deep.equal(expectedTags);
    });

    it("should include filters in tags request", () => {
        // given
        const tagsFilters: object = {
            tag1: ["val1", "val2"],
            tag2: ["val3", "val4"],
        };
        // when
        const request = queryBuilder.buildMetricTagsQuery("metric_name", tagsFilters);
        // then
        request.data.metrics[0].tags.should.be.equal(tagsFilters);
    });
});
