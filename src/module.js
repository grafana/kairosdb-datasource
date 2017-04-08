import {loadPluginCss} from 'app/plugins/sdk';
import {KairosDBDatasource} from './datasource';
import {KairosDBQueryCtrl} from './query_ctrl';

loadPluginCss({
    dark: 'plugins/kairosdb-datasource/css/plugin.css',
    light: 'plugins/kairosdb-datasource/css/plugin.css'
});

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

//todo: only plugins
//todo: import from /var/grafana/plugins/ dir
//todo: seperate directory for dist