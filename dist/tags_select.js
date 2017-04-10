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
            return {
              restrict: 'E',
              templateUrl: 'public/plugins/kairosdb-datasource/partials/tags.select.html',
              link: function (scope) {
                var that = this,
                    SELECTED_VALUES_STRING_LIMIT = 100;

                scope.getSelectedValuesString = function () {
                  var selectedValues = _.filter(scope.variable.options, option => option.selected),
                      fullString = _.chain(selectedValues)
                          .map(option => option.value)
                          .join(' + ')
                          .value();
                  return fullString.length < SELECTED_VALUES_STRING_LIMIT ? fullString : selectedValues.length + " tags selected";
                };

                scope.getNewTags = function (value) {
                  return that.tags.tag1;
                };

                scope.addNewTag = function (tagName, tagVlue) {
                  debugger;
                };

                scope.dropdownVisible = false;

                scope.selectValue = function (option) {
                  //todo; handle all
                  option.selected = !option.selected;
                };

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
