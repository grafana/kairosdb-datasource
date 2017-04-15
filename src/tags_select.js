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
                  return _.filter(scope.variable.options, option => option.selected);
                };

                scope.getSelectedValuesString = function () {
                  var fullString = _.chain(scope.getSelectedValues())
                      .map(option => option.value)
                      .join(' + ')
                      .value();
                  return fullString.length < SELECTED_VALUES_STRING_LIMIT ? fullString : getSelectedValues.length + " tags selected";
                };

                scope.clearSelections = function() {
                  scope.variable.options.forEach(option => option.selected = false);
                };

                scope.getNewTags = function (value) {
                  return that.tags.tag1;
                };

                scope.addNewTag = function (tagName, tagVlue) {
                  debugger;
                };

                function bodyOnClick (e) {
                  if (elem.has(e.target).length === 0) {
                    scope.$apply(function() {
                      scope.dropdownVisible = false;
                      bodyEl.off('click', bodyOnClick);
                    });
                  }
                }

                scope.showDropdown = function() {
                  $timeout(function() { bodyEl.on('click', bodyOnClick); }, 0, false);
                  scope.dropdownVisible = true;
                };

                scope.selectValue = function (option) {
                  //todo; handle all
                  option.selected = !option.selected;
                };

                //todo: cleanup
                var currentValue = {
                  value: "value",
                  text: "Text"
                };

                scope.variable = {
                  label: "label",
                  name: "name",
                  options: [
                    {
                      value: "value1",
                      text: "text1"
                    },
                    {
                      value: "value2",
                      text: "text2"
                    },
                    {
                      value: "value2",
                      text: "text2"
                    }],
                  current: currentValue,
                  multi: true
                };
              }
            };
          });
    });
