define(["require", "exports", './datasource', './query_ctrl', './config_ctrl'], function (require, exports, datasource_1, query_ctrl_1, config_ctrl_1) {
    exports.Datasource = datasource_1.KairosDBDatasource;
    exports.QueryCtrl = query_ctrl_1.KairosDBQueryCtrl;
    exports.ConfigCtrl = config_ctrl_1.KairosDBConfigCtrl;
    var KairosDBQueryOptionsCtrl = (function () {
        function KairosDBQueryOptionsCtrl() {
        }
        KairosDBQueryOptionsCtrl.templateUrl = "partials/query.options.html";
        return KairosDBQueryOptionsCtrl;
    })();
    exports.QueryOptionsCtrl = KairosDBQueryOptionsCtrl;
});
