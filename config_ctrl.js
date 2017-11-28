define(["require", "exports"], function (require, exports) {
    var KairosDBConfigCtrl = (function () {
        /** @ngInject */
        function KairosDBConfigCtrl($scope, datasourceSrv) {
            this.datasourceSrv = datasourceSrv;
            this.current.jsonData = this.current.jsonData || {};
            this.getAllKairosDataSource();
        }
        KairosDBConfigCtrl.prototype.getAllKairosDataSource = function () {
            var _this = this;
            this.datasourceSrv.loadDatasource(this.current.name)
                .then(function (ds) {
                return ds.backendSrv.$http;
            }).then(function ($http) {
                $http({
                    method: 'GET',
                    url: '/api/datasources'
                }).then(function (response) {
                    var kairosDatasourceList = [];
                    for (var _i = 0, _a = response.data; _i < _a.length; _i++) {
                        var source = _a[_i];
                        if (source.type == 'grafana-kairosdb-datasource')
                            kairosDatasourceList.push(source);
                    }
                    _this.current.jsonData.allKairosDataSource = kairosDatasourceList;
                });
            });
        };
        KairosDBConfigCtrl.templateUrl = 'partials/config.html';
        return KairosDBConfigCtrl;
    })();
    exports.KairosDBConfigCtrl = KairosDBConfigCtrl;
});
