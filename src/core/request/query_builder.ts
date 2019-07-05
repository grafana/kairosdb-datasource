import _ from "lodash";
import {Aggregator} from "../../beans/aggregators/aggregator";
import {DatapointsQuery} from "../../beans/request/datapoints_query";
import {MetricQuery} from "../../beans/request/metric_query";
import {KairosDBTarget} from "../../beans/request/target";
import {TemplatingUtils} from "../../utils/templating_utils";
import {GroupBysBuilder} from "./group_bys_builder";
import {ParameterObjectBuilder} from "./parameter_object_builder";
import {SamplingConverter} from "./sampling_converter";
import {SamplingParameterConverter} from "./sampling_parameter_converter";

export class KairosDBQueryBuilder {
    private withCredentials: boolean;
    private url: string;
    private apiPath: string;
    private scopedVars: any;
    private templateSrv: any;
    private groupBysBuilder: GroupBysBuilder;
    private templatingUtils: TemplatingUtils;
    private samplingParameterConverter: SamplingParameterConverter;

    constructor(withCredentials: boolean, url: string, apiPath: string, templateSrv: any, scopedVars: any) {
        this.withCredentials = withCredentials;
        this.url = url;
        this.apiPath = apiPath;
        this.scopedVars = scopedVars;
        this.templateSrv = templateSrv;
        this.templatingUtils = new TemplatingUtils(templateSrv, this.scopedVars);
        const samplingConverter = new SamplingConverter();
        this.groupBysBuilder = new GroupBysBuilder(this.templatingUtils, samplingConverter);
        this.samplingParameterConverter = new SamplingParameterConverter(samplingConverter);
    }

    public buildMetricNameQuery() {
        return this.buildRequest({
            method: "GET",
            url: "/metricnames"
        });
    }

    public buildMetricTagsQuery(metricName: string, filters = {}) {
        return this.buildRequest({
            data: this.buildTagsRequestBody(metricName, filters),
            method: "POST",
            url: "/datapoints/query/tags"
        });
    }

    public buildDatapointsQuery(targets, options) {
        const range = options.range;
        const panelId: string = options.panelId;
        const defaultInterval: string = options.interval;
        const requests = targets.map((target) => this.buildMetricQuery(target.query, defaultInterval)),
            data = new DatapointsQuery(range.from, range.to, requests);
        return this.buildRequest({
            data,
            method: "POST",
            requestId: this.buildRequestId("metric_names", panelId),
            url: "/datapoints/query"
        });
    }

    private buildMetricQuery(target: KairosDBTarget, defaultInterval: string) {
        return new MetricQuery(
            target.metricName,
            this.unpackTags(_.pickBy(target.tags, (tagValues) => tagValues.length)),
            target.aggregators.map((aggregator) => this.convertAggregatorToQueryObject(aggregator, defaultInterval)),
            this.groupBysBuilder.build(target.groupBy)
        );
    }

    private unpackTags(tags) {
        return _.mapValues.bind(this)(tags, (values) => _.flatten(this.templatingUtils.replaceAll(values)));
    }

    private convertAggregatorToQueryObject(aggregatorDefinition: Aggregator, defaultInterval: string) {
        const convertedAggregator =
            this.samplingParameterConverter.convertSamplingParameters(_.cloneDeep(aggregatorDefinition));
        return _.extend({name: convertedAggregator.name},
            this.convertParameters(convertedAggregator, defaultInterval));
    }

    private convertParameters(aggregatorDefinition: Aggregator, defaultInterval: string) {
        const parameterObjectBuilder =
            new ParameterObjectBuilder(defaultInterval, aggregatorDefinition.autoValueSwitch);
        return aggregatorDefinition.parameters.map((parameter) => parameterObjectBuilder.build(parameter))
            .reduce((param1, param2) => _.merge(param1, param2), {});
    }

    private buildRequest(requestStub) {
        requestStub.url = this.buildUrl(requestStub.url);
        let grafanaCookie = "";
        const match = document.cookie.match("grafana_kairos_token=([^;]+)");
        if (match) {
            grafanaCookie = match[1];
        }
        return _.extend(requestStub, {
            withCredentials: this.withCredentials,
            headers: {"X-Grafana-Token": grafanaCookie}
        });
    }

    private buildRequestId(actionName, panelId): string {
        return actionName + "_" + panelId;
    }

    private buildUrl(urlStub) {
        return this.url + this.apiPath + urlStub;
    }

    private buildTagsRequestBody(metricName, filters = {}) {
        return {
            cache_time: 0,
            metrics: [{name: metricName, tags: filters}],
            start_absolute: this.templateSrv.timeRange.from.unix() * 1000,
            end_absolute: this.templateSrv.timeRange.to.unix() * 1000,
        };
    }
}
