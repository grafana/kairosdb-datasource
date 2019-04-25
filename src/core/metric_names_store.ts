import _ from "lodash";
import {PromiseUtils} from "../utils/promise_utils";
import {KairosDBDatasource} from "./datasource";

export class MetricNamesStore {
    private initialized: boolean = false;
    private datasource: KairosDBDatasource;
    private cacheKey: string;
    private fetchingPromise: any;
    private promiseUtils: PromiseUtils;
    private metricNames: string[];

    constructor(datasource: KairosDBDatasource, promiseUtils: PromiseUtils, datasourceUrl: string) {
        this.cacheKey = "KAIROSDB_METRIC_NAMES_" + datasourceUrl;
        this.promiseUtils = promiseUtils;
        this.datasource = datasource;
    }

    public getMetricNames(): Promise<string[]> {
        if (this.cacheInitialized()) {
            return this.promiseUtils.resolvedPromise(this.metricNames);
        } else if (this.fetchingPromise) {
            return this.fetchingPromise;
        } else {
            return this.fetch();
        }
    }

    private cacheInitialized() {
        return !_.isUndefined(window[this.cacheKey]);
    }

    private fetch(): Promise<string[]> {
        this.fetchingPromise = this.datasource.getMetricNames()
            .then((response) => response.data.results)
            .then((metricNames) => {
                this.metricNames = metricNames;
                window[this.cacheKey] = metricNames;
                this.initialized = true;
                return this.metricNames;
            });
        return this.fetchingPromise;
    }
}
