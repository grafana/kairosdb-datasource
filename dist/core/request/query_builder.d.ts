export declare class KairosDBQueryBuilder {
    private withCredentials;
    private url;
    private apiPath;
    private scopedVars;
    private templateSrv;
    private groupBysBuilder;
    private templatingUtils;
    private samplingParameterConverter;
    constructor(withCredentials: boolean, url: string, apiPath: string, templateSrv: any, scopedVars: any);
    buildMetricNameQuery(): any;
    buildMetricTagsQuery(metricName: string, filters?: {}): any;
    buildDatapointsQuery(targets: any, options: any): any;
    private buildMetricQuery(target, defaultInterval);
    private unpackTags(tags);
    private convertAggregatorToQueryObject(aggregatorDefinition, defaultInterval);
    private convertParameters(aggregatorDefinition, defaultInterval);
    private buildRequest(requestStub);
    private buildRequestId(actionName, panelId);
    private buildUrl(urlStub);
    private buildTagsRequestBody(metricName, filters?);
}
