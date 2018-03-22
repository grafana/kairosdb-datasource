import {MetricTags} from "../../../src/beans/request/metric_tags";

describe("MetricTags", () => {
    const metricTags: MetricTags = new MetricTags();

    it("should update info correctly", () => {
        // given
        // tslint:disable
        const tags = {
            "tag1": ["just", "a", "set", "of", "tags"],
            "another tag": ["another tag", "with multiword", "values"],
            "simple tag": ["single value"],
            "an empty tag": []
        };
        // tslint:enable

        // when
        metricTags.updateTags(tags);
        // then
        // tslint:disable
        expect(metricTags.size).to.equal(4);
        expect(metricTags.combinations).to.equal(15);
        expect(metricTags.size).to.equal(4);
        expect(metricTags.combinations).to.equal(15);
        expect(metricTags.multiValuedTags).to.deep.equal(["tag1", "another tag"]);
        expect(metricTags.initialized).to.be.true;
    });
});