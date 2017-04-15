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
              templateUrl: 'public/plugins/kairosdb-datasource/partials/group.by.tags.html',
              link: function (scope, elem, attrs, ctrl) {
                scope.toggleGroupByTag = function (tagName) {
                  if (scope.isActiveGroupByTag(tagName)) {
                    scope.ctrl.target.groupByTags = _.without(scope.ctrl.target.groupByTags, tagName);
                  }
                  else {
                    scope.ctrl.target.groupByTags.push(tagName);
                  }
                };

                scope.isActiveGroupByTag = function (tagName) {
                  return _.contains(scope.ctrl.target.groupByTags, tagName);
                };

                scope.removeCustomGroupByValue = function (value) {
                  scope.ctrl.target.customGroupByTags = _.without(scope.ctrl.target.customGroupByTags, value);
                };

                scope.addCustomGroupByValue = function () {
                  if (!scope.groupByTagValueInputVisible) {
                    scope.groupByTagValueInputVisible = true;
                  }
                  else {
                    scope.ctrl.target.customGroupByTags = scope.ctrl.target.customGroupByTags || []; //todo: move to init
                    scope.ctrl.target.customGroupByTags.push(scope.newCustomGroupByValue);
                    scope.newCustomGroupByValue = "";
                    scope.groupByTagValueInputVisible = false;
                  }
                };
              }
            };
          });
    });
