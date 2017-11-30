export class KairosDBConfigCtrl {
  static templateUrl = 'partials/config.html';
  datasourceSrv: any;
  current: any;

  /** @ngInject */
  constructor($scope, datasourceSrv) {
    this.datasourceSrv = datasourceSrv;
    this.current.jsonData = this.current.jsonData || {};
    if (Object.keys(this.current.jsonData).length === 0) {
      this.current.jsonData.selectedDataSources = []
      this.current.jsonData.multi = false
    }

    this.getAllKairosDataSources()
  }

  getAllKairosDataSources() {
    const allDataSources = this.datasourceSrv.getAll()
    for (let key of Object.keys(allDataSources)) {
      const ds = allDataSources[key]
      if (ds.type == 'grafana-kairosdb-datasource' && !ds.jsonData.multi) {
        this.allKairosDataSources.push({
          id: ds.id,
          name: ds.name,
          url: ds.url,
          type: ds.type,
          basicAuth: ds.basicAuth,
          withCredentials: ds.withCredentials
        })
      }
    }
  }

  selectDataSource(ds) {
    if (ds) this.current.jsonData.selectedDataSources.push(ds)
  }

  isSelected() {
    return (ds) => {
      for (let el of this.current.jsonData.selectedDataSources) {
        if (ds.id == el.id) return false
      }
      return true
    }
  }

  allKairosDataSources = []
}
