define([
      'angular',
      'lodash',
      'jquery',
    ],
    function (angular, _, $) {
      'use strict';

      angular
          .module('grafana.directives')
          .directive('groupByValue', function () {
            return {
              restrict: 'E',
              scope: false,
              templateUrl: 'public/plugins/kairosdb-datasource/partials/group.by.value.html',
              link: function (scope, elem, ctrl) {
                debugger;
                //todo: put methods here
              }
            };
          });
    });
