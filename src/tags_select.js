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
                var that = this;

                scope.getNewTags = function (value) {
                  return that.tags.tag1;
                };

                scope.addNewTag = function (tagName, tagVlue) {
                  debugger;
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