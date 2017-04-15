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
              templateUrl: 'public/plugins/kairosdb-datasource/partials/tags.select.html',
              link: function (scope, elem) {

              }
            };
          });
    });
