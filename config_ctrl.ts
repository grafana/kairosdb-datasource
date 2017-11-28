export class KairosDBConfigCtrl {
  static templateUrl = 'partials/config.html';
  datasourceSrv: any;
  current: any;

  /** @ngInject */
  constructor($scope, datasourceSrv) {
  this.datasourceSrv = datasourceSrv;
  this.current.jsonData = this.current.jsonData || {};
  this.getAllKairosDataSource();
}

getAllKairosDataSource() {
  this.datasourceSrv.loadDatasource(this.current.name)
  .then((ds) => {
    return ds.backendSrv.$http
  }).then(($http) => {
    $http({
      method: 'GET',
      url: '/api/datasources'
    }).then((response) => {
      let kairosDatasourceList = []
      for (let source of response.data) {
        if (source.type == 'grafana-kairosdb-datasource') kairosDatasourceList.push(source)
      }
      this.current.jsonData.allKairosDataSource = kairosDatasourceList
    })
  })
}

}
