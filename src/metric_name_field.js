define([
      'angular',
      'lodash',
      'app/plugins/sdk'
    ],
    function (angular) {
      'use strict';

      angular.module('grafana.controllers').directive('metricNameField', function ($timeout) {

        return {
          restrict: 'E',
          scope: true,
          link: function (scope, elem, attr) {
            var controllerScope = scope.ctrl.$scope;

            scope.inputVisible = false;
            scope.aVisible = true;

            scope.hideInput = function () {
              scope.inputVisible = false;
              scope.aVisible = true;
              controllerScope.inputVisible = false;
            };

            scope.showAndClearInput = function () {
              elem[0].getElementsByTagName("input")[0].value = '';
              scope.showInput();
            };

            scope.showInput = function () {
              scope.inputVisible = true;
              scope.aVisible = false;
              $timeout(function () {
                elem[0].getElementsByTagName("input")[0].focus();
                controllerScope.inputVisible = true;
              });
            };

            scope.keyHit = function (key) {
              if (key.keyCode === 13) { //enter
                scope.hideInput();
              }
            };

            scope.metricNameInputChanged = function (sourceType) {
              $timeout(function () {
                scope.$apply();


                //
                // var newId = parseInt(controller.target.source[sourceType], 10);
                // if (!isNaN(newId) && newId !== controller.target.source.id) {
                //   controller.target.source.id = newId;
                //   switch (sourceType) {
                //     case "query":
                //       controllerScope.getQueryDetails();
                //       break;
                //     case "view":
                //       controllerScope.setSingleRow(true);
                //       controllerScope.suggestLabel();
                //       break;
                //     default:
                //       return;
                //   }
                //   scope.clearDetails();
                //   controllerScope.targetChanged();
                // }
              });
            };
          },
          templateUrl: 'public/plugins/kairosdb-datasource/partials/metric.name.field.html'
        };
      });
    });