define([
      'angular',
      'lodash',
      'jquery',
    ],
    function (angular, _, $) {
      'use strict';

      angular
          .module('grafana.directives')
          .directive('groupByTags', function () {
            return {
              restrict: 'E',
              scope: false,
              templateUrl: 'public/plugins/kairosdb-datasource/partials/group.by.tags.html',
              link: function (scope, elem, ctrl) {
                debugger;
              }
            };
          });
    });
