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
              templateUrl: 'public/plugins/kairosdb-datasource/partials/group.by.time.html',
              link: function (scope, elem, ctrl) {
                scope.newGroupByTime = {};
                scope.addGroupByTime = function () {
                  debugger;
                  if(scope.newGroupByTime) {
                    scope.ctrl.target.groupByTimes.push(scope.newGroupByTime);
                    scope.newGroupByTime = {};
                  }
                  scope.groupByTimeInputVisible = !scope.groupByTimeInputVisible;
                };
                scope.removeGroupByTime = function(value) {
                  scope.ctrl.target.groupByTimes = _.without(scope.ctrl.target.groupByTimes, value);
                }
              }
            };
          });
    });
