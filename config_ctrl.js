define(["require", "exports"], function (require, exports) {
    var KairosDBConfigCtrl = (function () {
        /** @ngInject */
        function KairosDBConfigCtrl($scope, datasourceSrv) {
            this.datasourceSrv = datasourceSrv;
            this.current.jsonData = this.current.jsonData || {};
            if (Object.keys(this.current.jsonData).length === 0)
                this.current.jsonData.selectedDataSources = [];
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
                if (this.current.jsonData.allDataSources[key].type == 'grafana-kairosdb-datasource') {
                    this.current.jsonData.allKairosDataSources.push(this.current.jsonData.allDataSources[key]);
                }
            }
        };
        KairosDBConfigCtrl.templateUrl = 'partials/config.html';
        return KairosDBConfigCtrl;
    })();
    exports.KairosDBConfigCtrl = KairosDBConfigCtrl;
});
