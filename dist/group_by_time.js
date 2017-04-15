define([
      'angular',
      'lodash',
      'jquery',
    ],
    function (angular, _, $) {
      'use strict';

      angular
          .module('grafana.directives')
          .directive('groupByTime', function () {
            return {
              restrict: 'E',
              scope: false,
              templateUrl: 'public/plugins/kairosdb-datasource/partials/group.by.time.html',
              link: function (scope, elem, ctrl) {
              }
            };
          });
    });
