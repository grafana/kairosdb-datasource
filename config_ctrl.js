define(["require", "exports"], function (require, exports) {
    var KairosDBConfigCtrl = (function () {
        /** @ngInject */
        function KairosDBConfigCtrl($scope, datasourceSrv) {
            this.datasourceSrv = datasourceSrv;
            this.current.jsonData = this.current.jsonData || {};
            if (Object.keys(this.current.jsonData).length === 0) {
                this.current.jsonData.selectedDataSources = [];
                this.current.jsonData.multi = false;
            }
            this.getAllDataSources();
            this.getAllKairosDataSources();
        }
        KairosDBConfigCtrl.prototype.getAllDataSources = function () {
            this.current.jsonData.allDataSources = this.datasourceSrv.getAll();
        };
        KairosDBConfigCtrl.prototype.getAllKairosDataSources = function () {
            this.current.jsonData.allKairosDataSources = [];
            for (var _i = 0, _a = Object.keys(this.current.jsonData.allDataSources); _i < _a.length; _i++) {
                var key = _a[_i];
                var ds = this.current.jsonData.allDataSources[key];
                if (ds.type == 'grafana-kairosdb-datasource' && !ds.jsonData.multi) {
                    this.current.jsonData.allKairosDataSources.push(ds);
                }
            }
        };
        KairosDBConfigCtrl.prototype.selectDataSource = function (ds) {
            if (ds)
                this.current.jsonData.selectedDataSources.push(ds);
        };
        KairosDBConfigCtrl.templateUrl = 'partials/config.html';
        return KairosDBConfigCtrl;
    })();
    exports.KairosDBConfigCtrl = KairosDBConfigCtrl;
});
