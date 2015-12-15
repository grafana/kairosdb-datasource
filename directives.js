define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorKairosdb', function() {
    return {controller: 'KairosDBQueryCtrl', templateUrl: 'public/plugins/kairosdb/partials/query.editor.html'};
  });

  module.directive('metricQueryOptionsKairosdb', function() {
    return {templateUrl: 'public/plugins/kairosdb/partials/query.options.html'};
  });

});
