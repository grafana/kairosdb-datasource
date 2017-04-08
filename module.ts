import {KairosDBDatasource} from './datasource';
import {KairosDBQueryCtrl} from './query_ctrl';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
    dark: 'app/plugins/datasource/grafana-kairosdb-datasource/css/plugin.css',
    light: 'app/plugins/datasource/grafana-kairosdb-datasource/css/plugin.css'
});

//todo: only plugins
//todo: import from /var/grafana/plugins/ dir

class KairosDBConfigCtrl {
  static templateUrl = "partials/config.html";
}

class KairosDBQueryOptionsCtrl {
  static templateUrl = "partials/query.options.html";
}

export {
    KairosDBDatasource as Datasource,
    KairosDBQueryCtrl as QueryCtrl,
    KairosDBConfigCtrl as ConfigCtrl,
    KairosDBQueryOptionsCtrl as QueryOptionsCtrl
};
