'use strict';

System.register(['app/plugins/sdk', './datasource', './query_ctrl'], function (_export, _context) {
    "use strict";

    var loadPluginCss, KairosDBDatasource, KairosDBQueryCtrl, KairosDBConfigCtrl, KairosDBQueryOptionsCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_appPluginsSdk) {
            loadPluginCss = _appPluginsSdk.loadPluginCss;
        }, function (_datasource) {
            KairosDBDatasource = _datasource.KairosDBDatasource;
        }, function (_query_ctrl) {
            KairosDBQueryCtrl = _query_ctrl.KairosDBQueryCtrl;
        }],
        execute: function () {

            loadPluginCss({
                dark: 'plugins/kairosdb-datasource/css/plugin.css',
                light: 'plugins/kairosdb-datasource/css/plugin.css'
            });

            _export('ConfigCtrl', KairosDBConfigCtrl = function KairosDBConfigCtrl() {
                _classCallCheck(this, KairosDBConfigCtrl);
            });

            KairosDBConfigCtrl.templateUrl = "partials/config.html";

            _export('QueryOptionsCtrl', KairosDBQueryOptionsCtrl = function KairosDBQueryOptionsCtrl() {
                _classCallCheck(this, KairosDBQueryOptionsCtrl);
            });

            KairosDBQueryOptionsCtrl.templateUrl = "partials/query.options.html";

            _export('Datasource', KairosDBDatasource);

            _export('QueryCtrl', KairosDBQueryCtrl);

            _export('ConfigCtrl', KairosDBConfigCtrl);

            _export('QueryOptionsCtrl', KairosDBQueryOptionsCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
