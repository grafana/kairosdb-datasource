import { MetricNamesStore } from "./metric_names_store";
export declare class KairosDBDatasource {
    initialized: boolean;
    initializationError: boolean;
    metricNamesStore: MetricNamesStore;
    private type;
    private url;
    private withCredentials;
    private name;
    private basicAuth;
    private responseHandler;
    private templatingFunctionsCtrl;
    private promiseUtils;
    private targetValidator;
    private backendSrv;
    private templateSrv;
    private legacyTargetConverter;
    private templatingUtils;
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any);
    initialize(): void;
    query(options: any): any;
    getMetricTags(metricNameTemplate: any, filters?: {}): any;
    metricFindQuery(query: string): Promise<{
        text: any;
        value: any;
    }[]>;
    getMetricNames(): any;
    private getRequestBuilder(scopedVars?);
    private executeRequest(request);
    private handleMetricTagsResponse(response);
    private registerTemplatingFunctions();
    private getMetricNamesContaining(metricNamePart);
    private getMetricTagNames(metricName);
    private getMetricTagValues(metricName, tagName, filters);
    private mapToTemplatingValue(entry);
}
