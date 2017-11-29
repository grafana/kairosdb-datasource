export class KairosDBConfigCtrl {
  static templateUrl = 'partials/config.html';
  datasourceSrv: any;
  current: any;

  /** @ngInject */
  constructor($scope, datasourceSrv) {
    this.datasourceSrv = datasourceSrv;
    this.current.jsonData = this.current.jsonData || {};
    if (Object.keys(this.current.jsonData).length === 0) this.current.jsonData.selectedDataSources = []

    this.getAllDataSources()
    console.log(this.current.jsonData.allDataSources)
    this.getAllKairosDataSources()
  }

  getAllDataSources() {
    this.current.jsonData.allDataSources = this.datasourceSrv.getAll()
  }

  getAllKairosDataSources() {
    this.current.jsonData.allKairosDataSources = []
    for (let key of Object.keys(this.current.jsonData.allDataSources)) {
      if (this.current.jsonData.allDataSources[key].type == 'grafana-kairosdb-datasource') {
        this.current.jsonData.allKairosDataSources.push(this.current.jsonData.allDataSources[key])
      }
    }
  }

  selectDataSource(ds) {
    if (ds) this.current.jsonData.selectedDataSources.push(ds)
  }

}
