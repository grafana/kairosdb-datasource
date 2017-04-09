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
            var controllerScope = scope.ctrl.$scope,
                controller = scope.ctrl;

            scope.fieldName = "select " + attr.field;
            scope.inputVisible = false;
            scope.aVisible = true;
            scope.style = {
              "width": "86px",
              "display": "block"
            };

            scope.$on('showAliasInput', function () {
              if (attr.field === "alias") {
                scope.showInput();
              }
            });

            scope.hideInput = function () {
              scope.inputVisible = false;
              scope.aVisible = true;
              controllerScope.inputVisible = false;
            };

            scope.showAndClearInput = function () {
              debugger;
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

            scope.clearDetails = function () {
              controller.target.source.row = !controllerScope.isSingleRow() ? "" : null;
              controller.target.source.column = "";
              controller.target.source.alias = "";
              controller.target.source.consolidation = null;
            };

            scope.clearFields = function () {
              controller.target.source.id = "";
              scope.clearDetails();
            };

            scope.dataGroupInputChanged = function () {
              scope.clearFields();
            };

            //todo
            scope.metricNameInputChanged = function (sourceType) {
              debugger;
              $timeout(function () {
                scope.$apply();
                var newId = parseInt(controller.target.source[sourceType], 10);
                if (!isNaN(newId) && newId !== controller.target.source.id) {
                  controller.target.source.id = newId;
                  switch (sourceType) {
                    case "query":
                      controllerScope.getQueryDetails();
                      break;
                    case "view":
                      controllerScope.setSingleRow(true);
                      controllerScope.suggestLabel();
                      break;
                    default:
                      return;
                  }
                  scope.clearDetails();
                  controllerScope.targetChanged();
                }
              });
            };
          },
          templateUrl: 'public/plugins/kairosdb-datasource/partials/metric.name.field.html'
        };
      });
    });