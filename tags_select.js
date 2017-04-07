define([
      'angular',
      'lodash',
      'jquery',
    ],
    function (angular, _, $) {
      'use strict';

      angular
          .module('grafana.directives')
          .directive('tagsSelect', function () {
            debugger;
            return {
              restrict: 'A',
              templateUrl: 'partials/tags.select.html'
            };
          });
    });