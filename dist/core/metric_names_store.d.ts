import { PromiseUtils } from "../utils/promise_utils";
import { KairosDBDatasource } from "./datasource";
export declare class MetricNamesStore {
    private initialized;
    private datasource;
    private cacheKey;
    private fetchingPromise;
    private promiseUtils;
    private metricNames;
    constructor(datasource: KairosDBDatasource, promiseUtils: PromiseUtils, datasourceUrl: string);
    initialize(): Promise<string[]>;
    get(): Promise<string[]>;
    private cacheInitialized();
    private fetch();
}
