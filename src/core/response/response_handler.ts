import _ from "lodash";
import {SeriesNameBuilder} from "./series_name_builder";

export class KairosDBResponseHandler {
    private seriesNameBuilder: SeriesNameBuilder;

    constructor(seriesNameBuilder: SeriesNameBuilder) {
        this.seriesNameBuilder = seriesNameBuilder;
    }

    public convertToDatapoints(data, aliases: string[]) {
        const datapoints = _.zip(aliases, data.queries)
            .map((pair) => {
                return {alias: pair[0], results: pair[1].results};
            })
            .map((entry) => _.map(entry.results, (result) => {
                return {
                    datapoints: result.values.map((value) => value.reverse()),
                    target: this.seriesNameBuilder.build(result.name, entry.alias, result.group_by)
                };
            }));

        return {data: _.flatten(datapoints)};
    }
}
