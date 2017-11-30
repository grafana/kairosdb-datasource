define(["require", "exports"], function (require, exports) {
    var KairosDBConfigCtrl = (function () {
        /** @ngInject */
        function KairosDBConfigCtrl($scope, datasourceSrv) {
            this.allKairosDataSources = [];
            this.datasourceSrv = datasourceSrv;
            this.current.jsonData = this.current.jsonData || {};
            if (Object.keys(this.current.jsonData).length === 0) {
                this.current.jsonData.selectedDataSources = [];
                this.current.jsonData.multi = false;
            }
            this.getAllKairosDataSources();
        }
        KairosDBConfigCtrl.prototype.getAllKairosDataSources = function () {
            var allDataSources = this.datasourceSrv.getAll();
            for (var _i = 0, _a = Object.keys(allDataSources); _i < _a.length; _i++) {
                var key = _a[_i];
                var ds = allDataSources[key];
                if (ds.type == 'grafana-kairosdb-datasource' && !ds.jsonData.multi) {
                    this.allKairosDataSources.push({
                        id: ds.id,
                        name: ds.name
                    });
                }
            }
        };
        KairosDBConfigCtrl.prototype.selectDataSource = function (ds) {
            if (ds)
                this.current.jsonData.selectedDataSources.push(ds);
        };
        KairosDBConfigCtrl.prototype.isSelected = function () {
            var _this = this;
            return function (ds) {
                for (var _i = 0, _a = _this.current.jsonData.selectedDataSources; _i < _a.length; _i++) {
                    var el = _a[_i];
                    if (ds.id == el.id)
                        return false;
                }
                return true;
            };
        };
        KairosDBConfigCtrl.templateUrl = 'partials/config.html';
        return KairosDBConfigCtrl;
    })();
    exports.KairosDBConfigCtrl = KairosDBConfigCtrl;
});
