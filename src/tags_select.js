define([
      'angular',
      'lodash',
      'jquery',
    ],
    function (angular, _, $) {
      'use strict';

      angular
          .module('grafana.directives')
          .directive('tagsSelect', function ($timeout, $window) {
            return {
              restrict: 'E',
              templateUrl: 'public/plugins/kairosdb-datasource/partials/tags.select.html',
              link: function (scope, elem) {
                var that = this,
                    SELECTED_VALUES_STRING_LIMIT = 100,
                    bodyEl = angular.element($window.document.body);

                scope.getSelectedValues = function () {
                  return _.filter(scope.tagOption.options, option => option.selected);
                };

                scope.getSelectedValuesString = function () {
                  if (scope.customValue) {
                    return scope.customValue;
                  }
                  var selectedValues = scope.getSelectedValues();
                  var fullString = _.chain(selectedValues)
                      .map(option => option.value)
                      .join(' + ')
                      .value();
                  return fullString.length < SELECTED_VALUES_STRING_LIMIT ? fullString : selectedValues.length + " tags selected";
                };

                scope.clearSelections = function() {
                  scope.tagOption.options.forEach(option => option.selected = false);
                };

                scope.setCustomValue = function(value) {
                  scope.customValue = value;
                  //todo: templating validation
                };

                function handleBodyClick (event) {
                  var dropdownItem = elem[0].querySelector("#optionsDropdown");
                  if ($(dropdownItem).has(event.target).length === 0) {
                    scope.$apply(function() {
                      scope.hideInput();
                      bodyEl.off('click', handleBodyClick);
                    });
                  }
                }

                scope.showInput = function() {
                  $timeout(function() { bodyEl.on('click', handleBodyClick); }, 0, false);
                  scope.customValue = "";
                  scope.inputVisible = true;
                };

                scope.hideInput = function() {
                  scope.inputVisible = false;
                };

                scope.selectValue = function (option) {
                  //todo: move to const
                  var allOption = _.find(scope.tagOption.options, option => option.value === "$__all");
                  if (option === allOption) {
                    scope.tagOption.options.forEach(option => {
                      option.selected = false;
                    });
                  } else {
                    allOption.selected = false;
                  }
                  option.selected = !option.selected;
                };
              }
            };
          });
    });
