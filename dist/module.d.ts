/// <reference path="node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { KairosDBConfigCtrl } from "./core/config_ctrl";
import { KairosDBDatasource } from "./core/datasource";
import { KairosDBQueryCtrl } from "./core/query_ctrl";
declare class KairosDBQueryOptionsCtrl {
    static templateUrl: string;
}
export { KairosDBDatasource as Datasource, KairosDBQueryCtrl as QueryCtrl, KairosDBConfigCtrl as ConfigCtrl, KairosDBQueryOptionsCtrl as QueryOptionsCtrl };
