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
    private snapToIntervals?;
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any);
    initialize(): void;
    testDatasource(): any;
    query(options: any): any;
    getMetricTags(metricNameTemplate: any, filters?: {}): any;
    metricFindQuery(query: string): Promise<{
        text: any;
        value: any;
    }[]>;
    getMetricNames(): any;
    private getRequestBuilder;
    private executeRequest;
    private handleMetricTagsResponse;
    private registerTemplatingFunctions;
    private getMetricNamesContaining;
    private getMetricTagNames;
    private getMetricTagValues;
    private mapToTemplatingValue;
}
