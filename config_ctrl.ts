/// <reference path="/usr/share/grafana/public/app/headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';

export class KairosDBConfigCtrl {
  static templateUrl = 'partials/config.html';
  current: any;

  /** @ngInject */
  constructor($scope) {
    this.current.jsonData = this.current.jsonData || {};
  }

}

