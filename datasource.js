define([
  'angular',
  'lodash',
  'app/plugins/sdk',
  'app/core/utils/datemath',
  'app/core/utils/kbn',
  './query_ctrl'
],
function (angular, _, sdk, dateMath, kbn) {
  'use strict';

  var self;

  /** @ngInject */
  function KairosDBDatasource(instanceSettings, $q, backendSrv, templateSrv, datasourceSrv) {
    console.log('==============================================');
    console.log('CONSTRUCTOR START');
    console.log('instanceSettings', instanceSettings);
    console.log('backendSrv', backendSrv);
    console.log('backendSrv.datasourceRequest', backendSrv.datasourceRequest);
    console.log('datasourceSrv', datasourceSrv);

    this.type = instanceSettings.type;  // "datasoruce"
    this.url = instanceSettings.url.replace(/\/+$/, ""); // Datasource Url
    this.name = instanceSettings.name; // "KairosDB"
    this.withCredentials = instanceSettings.withCredentials; // if has cred, here undefined
    this.supportMetrics = true;
    this.q = $q; // Javascript Promise by Angular : https://toddmotto.com/promises-angular-q
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.datasourceSrv = datasourceSrv;
    this.multi = instanceSettings.jsonData.multi;
    if (this.multi) {
      this.selectedDS = this.getLatestSelectedDS(instanceSettings.jsonData.selectedDataSources);
    } else {
      this.selectedDS = [instanceSettings]
    }
    console.log('this.selectedDS', this.selectedDS)
    self = this;
    console.log('CONSTRUCTOR END');
  }

  KairosDBDatasource.prototype.getLatestSelectedDS = function (selectedDS) {
    const allDataSources = this.datasourceSrv.getAll()
    let latestSelectedDS = []
    let foundLatest = []
    for (let ds of selectedDS) {
      for (let key of Object.keys(allDataSources)) {
        if (ds.id == allDataSources[key].id) {
          latestSelectedDS.push(allDataSources[key])
          foundLatest.push(ds.id)
        }
      }
    }
    if (latestSelectedDS.length !== selectedDS.length) {
      latestSelectedDS.map(o => {
        if (o.id in foundLatest) return
        else throw `${o.id}: ${o.name} is probably deleted, please remove that from multi-node-support datasource before futhur action.`
      })
    }
    return latestSelectedDS
  }

  // Function to check Datasource health
  KairosDBDatasource.prototype.testDatasource = function() {
    console.log('TEST DATASOURCE');
    if (!this.multi) {
      return this.backendSrv.datasourceRequest({
        url: this.url + '/api/v1/health/check',
        method: 'GET'
      }).then(function(response) {
        if (response.status === 204) {
          return { status: "success", message: "Data source is working", title: "Success" };
        }
      });
    } else {
      let promises = this.selectedDS.map( o => {
        return new Promise((resolve, reject) => {
          this.backendSrv.datasourceRequest({ url: o.url + '/api/v1/health/check', method: 'GET' })
              .then((response) => {
                if (response.status === 204) resolve()
                else reject(o + 'fails')
              }).catch((err) => {
                reject('Datasource:' + o.name + ' fails')
              });
        })
      });
      return this.q.all(promises)
                 .then((value) => {
                   return { status: "success", message: "All Data sources are working", title: "Success" };
                 }).catch((err) => {
                   return { status: "error", message: err, title: "Error" }
                 })
    }
  };

  // Called once per panel (graph)
  KairosDBDatasource.prototype.query = function (options) {
    console.log('QUERY START');
    console.log('options', options); // I think options are passed from grafana directly
    // Lots of useful variables here. Maybe coming from query_ctrl

    self.panelId = options.panelId;
    var start = options.rangeRaw.from;
    var end = options.rangeRaw.to;

    var targets = expandTargets(options);
    var queries = _.compact(_.map(targets, _.partial(convertTargetToQuery, options)));
    var plotParams = _.compact(_.map(targets, function(target) {
      var alias = target.alias || self.getDefaultAlias(target);

      if (!target.hide) {
        return { alias: alias, exouter: target.exOuter };
      }
      else {
        return null;
      }
    }));

    var handleKairosDBQueryResponseAlias = _.partial(handleKairosDBQueryResponse, plotParams, self.templateSrv);

    // No valid targets, return the empty result to save a round trip.
    if (_.isEmpty(queries)) {
      var d = this.q.defer();
      d.resolve({ data: [] });
      return d.promise;
    }

    // return this.performMultiTimeSeriesQuery(queries, start, end)
    //   .then(handleKairosDBQueryResponseAlias, handleQueryError);
    return this.performTimeSeriesQuery(queries, start, end)
      .then(handleKairosDBQueryResponseAlias, handleQueryError);
  };

  KairosDBDatasource.prototype.performMultiTimeSeriesQuery = function (queries, start, end) {
    var reqBody = {
      metrics: queries,
      cache_time: 0
    };

    convertToKairosTime(start, reqBody, 'start');
    convertToKairosTime(end, reqBody, 'end');

    var options = {
      method: 'POST',
      withCredentials: this.withCredentials,
      url: this.url + '/api/v1/datapoints/query',
      data: reqBody
    };

    let promises = [this.backendSrv.datasourceRequest(options), this.backendSrv.datasourceRequest(options)]

    return this.q.all(promises)
  }

  KairosDBDatasource.prototype.performTimeSeriesQuery = function (queries, start, end) {
    console.log('TIMESERIES QUERY START');
    var reqBody = {
      metrics: queries,
      cache_time: 0
    };

    convertToKairosTime(start, reqBody, 'start');
    convertToKairosTime(end, reqBody, 'end');

    var options = {
      method: 'POST',
      withCredentials: this.withCredentials,
      url: this.url + '/api/v1/datapoints/query',
      data: reqBody
    };
    console.log('TIMESERIES QUERY END');

    return this.backendSrv.datasourceRequest(options);
  };

  /**
   * Gets the list of metrics
   * @returns {*|Promise}
   */
  KairosDBDatasource.prototype._performMetricSuggestQuery = function (metric) {
    //Requires a KairosDB version supporting server-side metric names filtering
    console.log('START _performMetricSuggestQuery');
    console.log(' MULTI ');
    let promises = this.selectedDS.map( o => {
      return new Promise((resolve, reject) => {
        console.log('START _performMetricSuggestQuery: ' + o.name);
        console.log(o.url + '/api/v1/metricnames?containing=' + metric);
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/metricnames?containing=' + metric,
              method: 'GET',
              withCredentials: o.withCredentials,
              requestId: self.panelId + '.metricnames' +  + o.id
            })
            .then((result) => {
              console.log('RETURN _performMetricSuggestQuery: ' + o.name);
              if (!result.data) resolve([]);
              var metrics = [];
              _.each(result.data.results, function (r) {
                if (r.indexOf(metric) >= 0) {
                  metrics.push(r);
                }
              });
              console.log('_performMetricSuggestQuery: metrics -' + metrics);
              resolve(metrics); // array type
            }).catch((err) => {
              console.log('ERROR _performMetricSuggestQuery: ' + o.name);
              resolve([]) // show partials success even if one of more fails
            });
      })
    });
    // promises.unshift(
    //   new Promise((resolve, reject) => {
    //     self.backendSrv.$http
    //   })
    // )
    console.log(data)
    console.log(`There are ${promises.length} request in _performMetricSuggestQuery promises`)
    return this.q.all(promises)
               .then((value) => {
                 console.log('value', value)
                 let allMetrics = []
                 for (let list of value) {
                   allMetrics = allMetrics.concat(list)
                 }
                 console.log('RETURN multi _performMetricSuggestQuery: allMetrics', allMetrics);
                 return allMetrics
               }).catch((err) => {
                 console.log('ERROR multi _performMetricSuggestQuery: allMetrics', err);
                 return self.q.when([]);
               })
  };

  KairosDBDatasource.prototype._performMetricKeyLookup = function (metric) {
    console.log('START _performMetricKeyLookup');
    if (!metric) return this.q.when([]);
    let promises = this.selectedDS.map( o => {
      return new Promise((resolve, reject) => {
        console.log('START _performMetricKeyLookup: ' + o.name);
        console.log(o.url + '/api/v1/datapoints/query/tags');
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/datapoints/query/tags',
              method: 'POST',
              withCredentials: o.withCredentials,
              requestId: 'metricKeyLookup' + o.id,
              data: {
                metrics: [{ name: metric }],
                cache_time: 0,
                start_absolute: 0
              }
            }).then((result) => {
              console.log('RETURN _performMetricKeyLookup: ' + o.name);
              if (!result.data) resolve([]);
              var tagks = [];
              _.each(result.data.queries[0].results[0].tags, function (tagv, tagk) {
                if (tagks.indexOf(tagk) === -1) {
                  tagks.push(tagk);
                }
              });
              console.log('_performMetricKeyLookup: tagks', tagks);
              resolve(tagks); // array type
            }).catch((err) => {
              console.log('ERROR _performMetricKeyLookup: ' + o.name);
              resolve([]) // show partials success even if one of more fails
            });
      })
    });
    console.log(`There are ${promises.length} request in _performMetricKeyLookup promises`)
    return this.q.all(promises)
               .then((value) => {
                 console.log('value', value)
                 let allTagks = []
                 for (let list of value) { allTagks = allTagks.concat(list) }
                 console.log('RETURN multi _performMetricKeyLookup: allKeys', allTagks);
                 return allTagks
               }).catch((err) => {
                 return self.q.when([]);
               })
  };

  KairosDBDatasource.prototype._performMetricKeyValueLookup = function(metric, key, otherTags) {
    console.log('START _performMetricKeyValueLookup');
    metric = metric.trim();
    key = key.trim();
    if (!metric || !key) return this.q.when([]);

    var metricsOptions = { name: metric };
    if (otherTags) {
      var tags = {};
      var kvps = otherTags.match(/\w+\s*=\s*(?:[^,{}]+|\{[^,{}]+(?:,\s*[^,{}]+)*\})/g);
      kvps.forEach(function(pair) {
        var kv = pair.split("=");
        var k = kv[0] ? kv[0].trim() : "";
        var value = kv[1] ? kv[1].trim() : "";
        if (value.search(/^\{.*\}$/) !== -1) // multi-value, probably from a template var. e.g., "{dog,cat,bird}"
        {
          value = value.slice(1,-1).split(/\s*,\s*/);
        }
        if (k && value) {
          tags[k] = value;
        }
      });
      metricsOptions["tags"] = tags;
    }

    let promises = this.selectedDS.map( o => {
      return new Promise((resolve, reject) => {
        console.log('START _performMetricKeyValueLookup');
        console.log(o.url + '/api/v1/datapoints/query/tags');
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/datapoints/query/tags',
              method: 'POST',
              withCredentials: o.withCredentials,
              requestId: self.panelId + '.' + metric + '.' + key + '.' + 'metricKeyValueLookup' + o.id,
              data: {
                metrics: [metricsOptions],
                cache_time: 0,
                start_absolute: 0
              }
            })
            .then((result) => {
              console.log('RETURN _performMetricKeyValueLookup');
              if (!result.data) resolve([]);
              console.log('_performMetricKeyValueLookup: keys -' + o.name, result.data.queries[0].results[0].tags[key]);
              resolve(result.data.queries[0].results[0].tags[key]); // array type
            }).catch((err) => {
              console.log('ERROR _performMetricKeyValueLookup');
              resolve([]) // show partials success even if one of more fails
            });
        })
      });
      console.log(`There are ${promises.length} request in promises`)
      return this.q.all(promises)
                 .then((value) => {
                   let allKeys = []
                   for (let list of value) { allKeys = allKeys.concat(list) }
                   console.log('RETURN multi _performMetricKeyValueLookup: allKeys', allKeys);
                   return allKeys
                 }).catch((err) => {
                   return self.q.when([]);
                 })
  };

  KairosDBDatasource.prototype.performTagSuggestQuery = function (metric) {
    console.log('START performTagSuggestQuery');
    var options = {
      url: this.url + '/api/v1/datapoints/query/tags',
      method: 'POST',
      withCredentials: this.withCredentials,
      requestId: 'tagSuggestQuery' + o.id,
      data: {
        metrics: [
          { name: metric }
        ],
        cache_time: 0,
        start_absolute: 0
      }
    };

    return this.backendSrv.datasourceRequest(options).then(function (response) {
      console.log('RETURN performTagSuggestQuery');
      if (!response.data) {
        console.log('performTagSuggestQuery return empty array');
        return [];
      } else {
        console.log('performTagSuggestQuery: returned data', response.data.queries[0].results[0]);
        return response.data.queries[0].results[0];
      }
    });
  };

  KairosDBDatasource.prototype.metricFindQuery = function (query) {
    console.log('==============================================');
    console.log('query', query)
    if (!query) {
      return this.q.when([]);
    }

    var interpolated;
    try {
      interpolated = this.templateSrv.replace(query);
    }
    catch (err) {
      return this.q.reject(err);
    }

    var responseTransform = function (result) {
      return _.map(result, function (value) {
        return {text: value};
      });
    };

    var metrics_regex = /metrics\((.*)\)/;
    var tag_names_regex = /tag_names\((.*)\)/;
    var tag_values_regex = /tag_values\(([^,]*),\s*([^,]*)(?:,\s*)?(\w+\s*=.*)?\)/;

    var metrics_query = interpolated.match(metrics_regex);
    if (metrics_query) {
      console.log('metrics_query', metrics_query);
      return this._performMetricSuggestQuery(metrics_query[1]).then(responseTransform);
    }

    var tag_names_query = interpolated.match(tag_names_regex);
    if (tag_names_query) {
      console.log('tag_names_query', tag_names_query);
      return this._performMetricKeyLookup(tag_names_query[1]).then(responseTransform);
    }

    var tag_values_query = interpolated.match(tag_values_regex);
    if (tag_values_query) {
      console.log('tag_values_query', tag_values_query);
      return this._performMetricKeyValueLookup(tag_values_query[1], tag_values_query[2], tag_values_query[3]).then(responseTransform);
    }

    return this.q.when([]);
  };

  /////////////////////////////////////////////////////////////////////////
  /// Formatting methods
  ////////////////////////////////////////////////////////////////////////

  /**
   * Requires a verion of KairosDB with every CORS defects fixed
   * @param results
   * @returns {*}
   */
  function handleQueryError(results) {;
    console.log('HANDLEQUERYERROR')
    if (results.data.errors && !_.isEmpty(results.data.errors)) {
      var errors = {
        message: results.data.errors[0]
      };
      return self.q.reject(errors);
    }
    else {
      return self.q.reject(results);
    }
  }

  function handleKairosDBQueryResponse(plotParams, templateSrv, results) {
    console.log('HANDLE RESPONSE START');
    // console.log('resultsList', resultsList)
    console.log('results', results)
    var output = [];
    var index = 0;
    // _.each(resultsList, function (results) {
      _.each(results.data.queries, function (series) {
        _.each(series.results, function (result) {
          var details = "";
          var target = plotParams[index].alias;
          var groupAliases = {};
          var valueGroup = 1;
          var timeGroup = 1;

          // collect values for group aliases, then use them as scopedVars for templating
          _.each(result.group_by, function(element) {
            if (element.name === "tag") {
              _.each(element.group, function(value, key) {
                groupAliases["_tag_group_" + key] = { value : value };

                // If the Alias name starts with $group_by, then use that
                // as the label
                if (target.startsWith('$group_by(')) {
                  var aliasname = target.split('$group_by(')[1].slice(0, -1);
                  if (aliasname === key) {
                    target = value;
                  }
                }
                else {
                  details += key + "=" + value + " ";
                }
              });
            }
            else if (element.name === "value") {
              groupAliases["_value_group_" + valueGroup] = { value : element.group.group_number.toString() };
              valueGroup ++;
            }
            else if (element.name === "time") {
              groupAliases["_time_group_" + timeGroup] = { value : element.group.group_number.toString() };
              timeGroup ++;
            }
          });

          // Target here refers to the alias string
          // use replaceCount to prevent unpredict infinite loop
          for (let replaceCount = 0; target.indexOf('$') != -1 && replaceCount < 10; replaceCount++){
            target = templateSrv.replace(target, groupAliases);
          }

          var datapoints = [];

          for (var i = 0; i < result.values.length; i++) {
            var t = Math.floor(result.values[i][0]);
            var v = result.values[i][1];
            datapoints[i] = [v, t];
          }
          if (plotParams[index].exouter) {
            datapoints = new PeakFilter(datapoints, 10);
          }
          output.push({ target: target, datapoints: datapoints });
        });

        index++;
      });
    // });

    console.log('HANDLE RESPONSE END');
    return { data: _.flatten(output) };
  }

  function currentTemplateValue(value, templateSrv, scopedVars) {
    console.log('CURRENTTEMPLATEVALUE')
    var replacedValue;
    // Make sure there is a variable in the value
    if (templateSrv.variableExists(value)) {
      // Check to see if the value is just a single variable
      var fullVariableRegex = /^\s*(\$(\w+)|\[\[\s*(\w+)\s*\]\])\s*$/;
      var match = fullVariableRegex.exec(value);
      if (match) {
        var variableName = match[2] || match[3];
        if (scopedVars && scopedVars[variableName]) {
          replacedValue = scopedVars[variableName].value;
        } else {
          var variable = templateSrv.variables.find(function(v) { return v.name === variableName; });
          if (variable.current.value[0] === "$__all") {
            var filteredOptions = _.filter(variable.options, function(v) { return v.value !== "$__all"; });
            replacedValue = _.map(filteredOptions, function(opt) { return opt.value; });
          } else {
            replacedValue = variable.current.value;
          }
        }
      } else {
        // The value isn't a full value match, try to use the template replace
        replacedValue = templateSrv.replace(value, scopedVars);
      }
    } else {
      // The value does not have a variable
      replacedValue = value;
    }
    return _.flatten([replacedValue]);
  }

  function convertTargetToQuery(options, target) {
    console.log('CONVERTTARGETTOQUERY');
    if (!target.metric || target.hide) {
      return null;
    }

    var metricName = currentTemplateValue(target.metric, self.templateSrv, options.scopedVars);
    var query = {
      name: metricName
    };

    query.aggregators = [];

    if (target.horizontalAggregators) {
      _.each(target.horizontalAggregators, function (chosenAggregator) {
        var returnedAggregator = {
          name: chosenAggregator.name
        };

        if (chosenAggregator.sampling_rate) {
          returnedAggregator.sampling = self.convertToKairosInterval(
              chosenAggregator.sampling_rate==="auto" ? options.interval : chosenAggregator.sampling_rate);
          returnedAggregator.align_sampling = true;
          //returnedAggregator.align_start_time = true;
        }

        if (chosenAggregator.unit) {
          returnedAggregator.unit = chosenAggregator.unit + 's';
        }

        if (chosenAggregator.factor && chosenAggregator.name === 'div') {
          returnedAggregator.divisor = chosenAggregator.factor;
        }
        else if (chosenAggregator.factor && chosenAggregator.name === 'scale') {
          returnedAggregator.factor = chosenAggregator.factor;
        }

        if (chosenAggregator.percentile) {
          returnedAggregator.percentile = chosenAggregator.percentile;
        }

        if (chosenAggregator.trim) {
          returnedAggregator.trim = chosenAggregator.trim;
        }

        query.aggregators.push(returnedAggregator);
      });
    }

    if (_.isEmpty(query.aggregators)) {
      delete query.aggregators;
    }

    if (target.tags) {
      query.tags = angular.copy(target.tags);
      _.forOwn(query.tags, function (value, key) {
        query.tags[key] = currentTemplateValue(value, self.templateSrv, options.scopedVars);
      });
    }

    if (target.groupByTags || target.nonTagGroupBys) {
      query.group_by = [];
      if (target.groupByTags) {
        query.group_by.push({
          name: "tag",
          tags: _.map(angular.copy(target.groupByTags), function (tag) {
            return self.templateSrv.replace(tag);
          })
        });
      }

      if (target.nonTagGroupBys) {
        _.each(target.nonTagGroupBys, function (rawGroupBy) {
          var formattedGroupBy = angular.copy(rawGroupBy);
          if (formattedGroupBy.name === 'time') {
            formattedGroupBy.range_size = self.convertToKairosInterval(formattedGroupBy.range_size);
          }
          query.group_by.push(formattedGroupBy);
        });
      }
    }
    return query;
  }

  KairosDBDatasource.prototype.getDefaultAlias = function(target) {
    console.log('GETDEFAULTALIAS')
    if (!target.metric) {
      return "";
    }

    var groupAlias = " ( ";
    var valueGroup = 1;
    var timeGroup = 1;

    _.forEach(target.groupByTags, function(tag) {
      groupAlias += tag + "=$_tag_group_" + tag + ", ";
    });
    _.forEach(target.nonTagGroupBys, function(group) {
      if (group.name === "value") {
        groupAlias += "value_group_" + valueGroup + "=$_value_group_" + valueGroup.toString() + ", ";
        valueGroup ++;
      } else if (group.name === "time") {
        groupAlias += "time_group_" + timeGroup + "=$_time_group_" + timeGroup.toString() + ", ";
        timeGroup ++;
      }
    });

    if (groupAlias === " ( ") {
      groupAlias = "";
    } else {
      groupAlias = groupAlias.substring(0, groupAlias.length -2) + " )";
    }

    return target.metric + groupAlias;
  };

  ///////////////////////////////////////////////////////////////////////
  /// Time conversion functions specifics to KairosDB
  //////////////////////////////////////////////////////////////////////

  KairosDBDatasource.prototype.convertToKairosInterval = function (intervalString) {
    console.log('CONVERTTOKAIROSINTERVAL');
    intervalString = self.templateSrv.replace(intervalString);

    var interval_regex = /(\d+(?:\.\d+)?)([Mwdhmsy])/;
    var interval_regex_ms = /(\d+(?:\.\d+)?)(ms)/;
    var matches = intervalString.match(interval_regex_ms);
    if (!matches) {
      matches = intervalString.match(interval_regex);
    }
    if (!matches) {
      throw new Error('Invalid interval string, expecting a number followed by one of "y M w d h m s ms"');
    }

    var value = matches[1];
    var unit = matches[2];
    if (value % 1 !== 0) {
      if (unit === 'ms') {
        throw new Error('Invalid interval value, cannot be smaller than the millisecond');
      }
      value = Math.round(kbn.intervals_in_seconds[unit] * value * 1000);
      unit = 'ms';
    }

    return {
      value: value,
      unit: convertToKairosDBTimeUnit(unit)
    };
  };

  function convertToKairosTime(date, response_obj, start_stop_name) {
    console.log('CONVERTTOKAIROSTIME')
    var name;

    if (_.isString(date)) {
      if (date === 'now') {
        return;
      }
      else if (date.indexOf('now-') >= 0 && date.indexOf('/') === -1) {
        date = date.substring(4);
        name = start_stop_name + "_relative";
        var re_date = /(\d+)\s*(\D+)/;
        var result = re_date.exec(date);

        if (result) {
          var value = result[1];
          var unit = result[2];

          response_obj[name] = {
            value: value,
            unit: convertToKairosDBTimeUnit(unit)
          };
          return;
        }
        console.log("Unparseable date", date);
        return;
      }

      date = dateMath.parse(date, start_stop_name === 'end');
    }

    name = start_stop_name + "_absolute";
    response_obj[name] = date.valueOf();
  }

  function convertToKairosDBTimeUnit(unit) {
    console.log('CONVERTTOKAIROSDBTIMEUNIT');
    switch (unit) {
      case 'ms':
        return 'milliseconds';
      case 's':
        return 'seconds';
      case 'm':
        return 'minutes';
      case 'h':
        return 'hours';
      case 'd':
        return 'days';
      case 'w':
        return 'weeks';
      case 'M':
        return 'months';
      case 'y':
        return 'years';
      default:
        console.log("Unknown unit ", unit);
        return '';
    }
  }

  function PeakFilter(dataIn, limit) {
    console.log('PEAKFILTER');
    var datapoints = dataIn;
    var arrLength = datapoints.length;
    if (arrLength <= 3) {
      return datapoints;
    }
    var LastIndx = arrLength - 1;

    // Check first point
    var prvDelta = Math.abs((datapoints[1][0] - datapoints[0][0]) / datapoints[0][0]);
    var nxtDelta = Math.abs((datapoints[1][0] - datapoints[2][0]) / datapoints[2][0]);
    if (prvDelta >= limit && nxtDelta < limit) {
      datapoints[0][0] = datapoints[1][0];
    }

    // Check last point
    prvDelta = Math.abs((datapoints[LastIndx - 1][0] - datapoints[LastIndx - 2][0]) / datapoints[LastIndx - 2][0]);
    nxtDelta = Math.abs((datapoints[LastIndx - 1][0] - datapoints[LastIndx][0]) / datapoints[LastIndx][0]);
    if (prvDelta >= limit && nxtDelta < limit) {
      datapoints[LastIndx][0] = datapoints[LastIndx - 1][0];
    }

    for (var i = 1; i < arrLength - 1; i++) {
      prvDelta = Math.abs((datapoints[i][0] - datapoints[i - 1][0]) / datapoints[i - 1][0]);
      nxtDelta = Math.abs((datapoints[i][0] - datapoints[i + 1][0]) / datapoints[i + 1][0]);
      if (prvDelta >= limit && nxtDelta >= limit) {
        datapoints[i][0] = (datapoints[i - 1][0] + datapoints[i + 1][0]) / 2;
      }
    }

    return datapoints;
  }

  function expandTargets(options) {
    console.log('EXPANDTARGETS');
    return _.flatten(_.map(
      options.targets,
      function(target) {
        return _.map(
          currentTemplateValue(target.metric, self.templateSrv, options.scopedVars),
          function(metric) {
            var copy = angular.copy(target);
            copy.metric = metric;
            return copy;
          }
        );
      }
    ));
  }

  return {
    KairosDBDatasource: KairosDBDatasource
  };
});
