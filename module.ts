import {KairosDBDatasource} from './datasource';
import {KairosDBQueryCtrl} from './query_ctrl';
import {KairosDBConfigCtrl} from './config_ctrl'

class KairosDBQueryOptionsCtrl {
  static templateUrl = "partials/query.options.html";
}

export {
    KairosDBDatasource as Datasource,
    KairosDBQueryCtrl as QueryCtrl,
    KairosDBConfigCtrl as ConfigCtrl,
    KairosDBQueryOptionsCtrl as QueryOptionsCtrl
};
