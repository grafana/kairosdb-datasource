define([
  'angular',
  'lodash',
  'app/plugins/sdk',
  'app/core/utils/datemath',
  'app/core/utils/kbn',
  './query_ctrl'
],
(angular, _, sdk, dateMath, kbn) => {
  'use strict'

  let self

  /** @ngInject */
  function KairosDBDatasource(instanceSettings, $q, backendSrv, templateSrv, datasourceSrv) {
    this.type = instanceSettings.type
    this.url = instanceSettings.url.replace(/\/+$/, '')
    this.name = instanceSettings.name
    this.withCredentials = instanceSettings.withCredentials
    this.supportMetrics = true
    this.q = $q
    this.backendSrv = backendSrv
    this.templateSrv = templateSrv
    this.datasourceSrv = datasourceSrv
    this.multi = instanceSettings.jsonData.multi
    if (this.multi) this.selectedDS = this.getLatestSelectedDS(instanceSettings.jsonData.selectedDataSources)
    else this.selectedDS = [instanceSettings]

    self = this
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
    const successText = this.multi ? 'All Data sources are working' : 'Data source is working'
    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
        this.backendSrv.datasourceRequest({ url: o.url + '/api/v1/health/check', method: 'GET' })
            .then(res => {
              if (res.status === 204) resolve()
              else reject(o + 'fails')
            }).catch(err => {
              reject('Datasource:' + o.name + ' fails')
            })
      })
    })
    return this.q.all(promises)
               .then(value => { return { status: 'success', message: successText, title: 'Success' } })
               .catch(err => { return { status: 'error', message: err, title: 'Error' } })
  }

  // Called once per panel (graph)
  KairosDBDatasource.prototype.query = function (options) {
    this.panelId = options.panelId
    const start = options.rangeRaw.from
    const end = options.rangeRaw.to

    const targets = expandTargets(options)
    const queries = _.compact(_.map(targets, _.partial(convertTargetToQuery, options)))
    const plotParams = _.compact(_.map(targets, target => {
      const alias = target.alias || this.getDefaultAlias(target)

      if (!target.hide) return { alias: alias, exouter: target.exOuter }
      else return null
    }))

    const handleKairosDBQueryResponseAlias = _.partial(handleKairosDBQueryResponse, plotParams, this.templateSrv)

    // No valid targets, return the empty result to save a round trip.
    if (_.isEmpty(queries)) {
      let d = this.q.defer()
      d.resolve({ data: [] })
      return d.promise
    }

    return this.performTimeSeriesQuery(queries, start, end)
      .then(handleKairosDBQueryResponseAlias, handleQueryError)
  }

  KairosDBDatasource.prototype.performTimeSeriesQuery = function (queries, start, end) {
    let reqBody = {
      metrics: queries,
      cache_time: 0
    }

    convertToKairosTime(start, reqBody, 'start')
    convertToKairosTime(end, reqBody, 'end')

    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/datapoints/query',
              method: 'POST',
              withCredentials: o.withCredentials,
              data: reqBody
            })
            .then(res => resolve(res))
            .catch(err => reject(err))
      })
    })
    return this.q.all(promises)
  }

  /**
   * Gets the list of metrics
   * @returns {*|Promise}
   */
  KairosDBDatasource.prototype._performMetricSuggestQuery = function (metric) {
    //Requires a KairosDB version supporting server-side metric names filtering
    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/metricnames?containing=' + metric,
              method: 'GET',
              withCredentials: o.withCredentials,
              requestId: this.panelId + '.metricnames' +  + o.id
            })
            .then(result => {
              if (!result.data) resolve([])
              let metrics = []
              _.each(result.data.results, r => {
                if (r.indexOf(metric) >= 0) metrics.push(r)
              })
              resolve(metrics)
            }).catch(err => resolve([])) // show partials success even if one of more fails
      })
    })
    return this.q.all(promises)
               .then(value => {
                 let allMetrics = []
                 for (let list of value) { allMetrics = allMetrics.concat(list) }
                 return allMetrics
               }).catch(err => this.q.when([]))
  }

  KairosDBDatasource.prototype._performMetricKeyLookup = function (metric) {
    if (!metric) return this.q.when([])
    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
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
            }).then(result => {
              if (!result.data) resolve([])
              let tagks = []
              _.each(result.data.queries[0].results[0].tags, (tagv, tagk) => {
                if (tagks.indexOf(tagk) === -1) tagks.push(tagk)
              })
              resolve(tagks)
            }).catch(err => resolve([])) // show partials success even if one of more fails
      })
    })
    return this.q.all(promises)
               .then(value => {
                 let allTagks = []
                 for (let list of value) { allTagks = allTagks.concat(list) }
                 return allTagks
               }).catch(err => this.q.when([]))
  }

  KairosDBDatasource.prototype._performMetricKeyValueLookup = function(metric, key, otherTags) {
    metric = metric.trim()
    key = key.trim()
    if (!metric || !key) return this.q.when([])

    let metricsOptions = { name: metric }
    if (otherTags) {
      let tags = {}
      const kvps = otherTags.match(/\w+\s*=\s*(?:[^,{}]+|\{[^,{}]+(?:,\s*[^,{}]+)*\})/g)
      kvps.forEach(pair => {
        const kv = pair.split('=')
        const k = kv[0] ? kv[0].trim() : ''
        let value = kv[1] ? kv[1].trim() : ''
        // multi-value, probably from a template var. e.g., '{dog,cat,bird}'
        if (value.search(/^\{.*\}$/) !== -1) value = value.slice(1,-1).split(/\s*,\s*/)
        if (k && value) tags[k] = value
      })
      metricsOptions['tags'] = tags
    }

    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/datapoints/query/tags',
              method: 'POST',
              withCredentials: o.withCredentials,
              requestId: this.panelId + '.' + metric + '.' + key + '.' + 'metricKeyValueLookup' + o.id,
              data: {
                metrics: [metricsOptions],
                cache_time: 0,
                start_absolute: 0
              }
            })
            .then(result => {
              if (!result.data) resolve([])
              resolve(result.data.queries[0].results[0].tags[key])
            }).catch(err => resolve([])) // show partials success even if one of more fails
        })
      })
      return this.q.all(promises)
                 .then(value => {
                   let allKeys = []
                   for (let list of value) { allKeys = allKeys.concat(list) }
                   return allKeys
                 }).catch(err => this.q.when([]))
  }

  KairosDBDatasource.prototype.performTagSuggestQuery = function (metric) {
    let promises = this.selectedDS.map(o => {
      return new Promise((resolve, reject) => {
        this.backendSrv.datasourceRequest({
              url: o.url + '/api/v1/datapoints/query/tags',
              method: 'POST',
              withCredentials: o.withCredentials,
              requestId: 'tagSuggestQuery' + o.id,
              data: {
                metrics: [ { name: metric } ],
                cache_time: 0,
                start_absolute: 0
              }
            }).then(result => {
              if (!result.data) resolve([])
              resolve(result.data.queries[0].results[0])
            }).catch(err => resolve([])) // show partials success even if one of more fails
        })
      })
      return this.q.all(promises)
                 .then(value => {
                   let allKeys = []
                   for (let list of value) { allKeys = allKeys.concat(list) }
                   return allKeys
                 }).catch(err => this.q.when([]))
  }

  KairosDBDatasource.prototype.metricFindQuery = function (query) {
    if (!query) return this.q.when([])

    let interpolated
    try { interpolated = this.templateSrv.replace(query) }
    catch (err) { return this.q.reject(err) }

    const responseTransform = result => _.map(result, (value) => { return {text: value} })

    const metrics_regex = /metrics\((.*)\)/
    const tag_names_regex = /tag_names\((.*)\)/
    const tag_values_regex = /tag_values\(([^,]*),\s*([^,]*)(?:,\s*)?(\w+\s*=.*)?\)/

    const metrics_query = interpolated.match(metrics_regex)
    if (metrics_query)
      return this._performMetricSuggestQuery(metrics_query[1]).then(responseTransform)

    const tag_names_query = interpolated.match(tag_names_regex)
    if (tag_names_query)
      return this._performMetricKeyLookup(tag_names_query[1]).then(responseTransform)

    const tag_values_query = interpolated.match(tag_values_regex)
    if (tag_values_query)
      return this._performMetricKeyValueLookup(tag_values_query[1], tag_values_query[2], tag_values_query[3]).then(responseTransform)

    return this.q.when([])
  }

  /////////////////////////////////////////////////////////////////////////
  /// Formatting methods
  ////////////////////////////////////////////////////////////////////////

  /**
   * Requires a verion of KairosDB with every CORS defects fixed
   * @param results
   * @returns {*}
   */
  function handleQueryError(results) {
    if (results.data.errors && !_.isEmpty(results.data.errors))
      return self.q.reject({ message: results.data.errors[0] })
    else
      return self.q.reject(results)
  }

  function handleKairosDBQueryResponse(plotParams, templateSrv, allResults) {
    let outputList = []
    for (let results of allResults) {
      let output = []
      let index = 0
      _.each(results.data.queries, series => {
        _.each(series.results, result => {
          let details = ''
          let target = plotParams[index].alias
          let groupAliases = {}
          let valueGroup = 1
          let timeGroup = 1

          // collect values for group aliases, then use them as scopedVars for templating
          _.each(result.group_by, element => {
            if (element.name === 'tag') {
              _.each(element.group, (value, key) => {
                groupAliases['_tag_group_' + key] = { value : value }

                // If the Alias name starts with $group_by, then use that as the label
                if (target.startsWith('$group_by(')) {
                  let aliasname = target.split('$group_by(')[1].slice(0, -1)
                  if (aliasname === key) target = value
                } else details += key + '=' + value + ' '
              })
            } else if (element.name === 'value') {
              groupAliases['_value_group_' + valueGroup] = { value : element.group.group_number.toString() }
              valueGroup ++
            } else if (element.name === 'time') {
              groupAliases['_time_group_' + timeGroup] = { value : element.group.group_number.toString() }
              timeGroup ++
            }
          })

          // Target here refers to the alias string
          // use replaceCount to prevent unpredict infinite loop
          for (let replaceCount = 0; target.indexOf('$') != -1 && replaceCount < 10; replaceCount++) {
            target = templateSrv.replace(target, groupAliases)
          }

          let datapoints = []

          for (let i = 0; i < result.values.length; i++) {
            const t = Math.floor(result.values[i][0])
            const v = result.values[i][1]
            datapoints[i] = [v, t]
          }

          if (plotParams[index].exouter)
            datapoints = new PeakFilter(datapoints, 10)

          output.push({ target: target, datapoints: datapoints })
        })

        index++
      })
      outputList = outputList.concat(_.flatten(output))
    }

    return { data: outputList }
  }

  function currentTemplateValue(value, templateSrv, scopedVars) {
    let replacedValue
    // Make sure there is a variable in the value
    if (templateSrv.variableExists(value)) {
      // Check to see if the value is just a single variable
      const fullVariableRegex = /^\s*(\$(\w+)|\[\[\s*(\w+)\s*\]\])\s*$/
      const match = fullVariableRegex.exec(value)
      if (match) {
        const variableName = match[2] || match[3]
        if (scopedVars && scopedVars[variableName]) {
          replacedValue = scopedVars[variableName].value
        } else {
          const variable = templateSrv.variables.find(v => v.name === variableName)
          if (variable.current.value[0] === "$__all") {
            const filteredOptions = _.filter(variable.options, v => v.value !== '$__all')
            replacedValue = _.map(filteredOptions, opt => opt.value)
          } else {
            replacedValue = variable.current.value
          }
        }
      } else {
        // The value isn't a full value match, try to use the template replace
        replacedValue = templateSrv.replace(value, scopedVars)
      }
    } else {
      // The value does not have a variable
      replacedValue = value
    }
    return _.flatten([replacedValue])
  }

  const convertTargetToQuery = (options, target) => {
    if (!target.metric || target.hide) return null

    const metricName = currentTemplateValue(target.metric, self.templateSrv, options.scopedVars)
    let query = { name: metricName }

    query.aggregators = []

    if (target.horizontalAggregators) {
      _.each(target.horizontalAggregators, function (chosenAggregator) {
        let returnedAggregator = { name: chosenAggregator.name }

        if (chosenAggregator.sampling_rate) {
          returnedAggregator.sampling = self.convertToKairosInterval(
              chosenAggregator.sampling_rate==='auto' ? options.interval : chosenAggregator.sampling_rate)
          returnedAggregator.align_sampling = true
          //returnedAggregator.align_start_time = true
        }

        if (chosenAggregator.unit)
          returnedAggregator.unit = chosenAggregator.unit + 's'

        if (chosenAggregator.factor && chosenAggregator.name === 'div')
          returnedAggregator.divisor = chosenAggregator.factor
        else if (chosenAggregator.factor && chosenAggregator.name === 'scale')
          returnedAggregator.factor = chosenAggregator.factor

        if (chosenAggregator.percentile)
          returnedAggregator.percentile = chosenAggregator.percentile

        if (chosenAggregator.trim)
          returnedAggregator.trim = chosenAggregator.trim

        query.aggregators.push(returnedAggregator)
      })
    }

    if (_.isEmpty(query.aggregators))
      delete query.aggregators

    if (target.tags) {
      query.tags = angular.copy(target.tags)
      _.forOwn(query.tags, (value, key) => {
        query.tags[key] = currentTemplateValue(value, self.templateSrv, options.scopedVars)
      })
    }

    if (target.groupByTags || target.nonTagGroupBys) {
      query.group_by = []
      if (target.groupByTags) {
        query.group_by.push({
          name: 'tag',
          tags: _.map(angular.copy(target.groupByTags), tag => self.templateSrv.replace(tag))
        })
      }

      if (target.nonTagGroupBys) {
        _.each(target.nonTagGroupBys, rawGroupBy => {
          let formattedGroupBy = angular.copy(rawGroupBy)
          if (formattedGroupBy.name === 'time')
            formattedGroupBy.range_size = self.convertToKairosInterval(formattedGroupBy.range_size)
          query.group_by.push(formattedGroupBy)
        })
      }
    }
    return query
  }

  KairosDBDatasource.prototype.getDefaultAlias = function(target) {
    if (!target.metric)
      return ''

    let groupAlias = ' ( '
    let valueGroup = 1
    let timeGroup = 1

    _.forEach(target.groupByTags, tag => {
      groupAlias += tag + '=$_tag_group_' + tag + ', '
    })
    _.forEach(target.nonTagGroupBys, group => {
      if (group.name === 'value') {
        groupAlias += 'value_group_' + valueGroup + '=$_value_group_' + valueGroup.toString() + ', '
        valueGroup ++
      } else if (group.name === 'time') {
        groupAlias += 'time_group_' + timeGroup + '=$_time_group_' + timeGroup.toString() + ', '
        timeGroup ++
      }
    })

    if (groupAlias === ' ( ')
      groupAlias = ''
    else
      groupAlias = groupAlias.substring(0, groupAlias.length -2) + ' )'

    return target.metric + groupAlias
  }

  ///////////////////////////////////////////////////////////////////////
  /// Time conversion functions specifics to KairosDB
  //////////////////////////////////////////////////////////////////////

  KairosDBDatasource.prototype.convertToKairosInterval = function (intervalString) {
    intervalString = this.templateSrv.replace(intervalString)

    const interval_regex = /(\d+(?:\.\d+)?)([Mwdhmsy])/
    const interval_regex_ms = /(\d+(?:\.\d+)?)(ms)/
    let matches = intervalString.match(interval_regex_ms)
    if (!matches)
      matches = intervalString.match(interval_regex)

    if (!matches)
      throw new Error('Invalid interval string, expecting a number followed by one of "y M w d h m s ms"')

    let value = matches[1]
    let unit = matches[2]
    if (value % 1 !== 0) {
      if (unit === 'ms') throw new Error('Invalid interval value, cannot be smaller than the millisecond')
      value = Math.round(kbn.intervals_in_seconds[unit] * value * 1000)
      unit = 'ms'
    }

    return {
      value: value,
      unit: convertToKairosDBTimeUnit(unit)
    }
  }

  function convertToKairosTime(date, response_obj, start_stop_name) {
    let name

    if (_.isString(date)) {
      if (date === 'now') return
      else if (date.indexOf('now-') >= 0 && date.indexOf('/') === -1) {
        date = date.substring(4)
        name = start_stop_name + '_relative'
        const re_date = /(\d+)\s*(\D+)/
        const result = re_date.exec(date)

        if (result) {
          const value = result[1]
          const unit = result[2]

          response_obj[name] = {
            value: value,
            unit: convertToKairosDBTimeUnit(unit)
          }
          return
        }
        return
      }

      date = dateMath.parse(date, start_stop_name === 'end')
    }

    name = start_stop_name + '_absolute'
    response_obj[name] = date.valueOf()
  }

  function convertToKairosDBTimeUnit(unit) {
    switch (unit) {
      case 'ms':
        return 'milliseconds'
      case 's':
        return 'seconds'
      case 'm':
        return 'minutes'
      case 'h':
        return 'hours'
      case 'd':
        return 'days'
      case 'w':
        return 'weeks'
      case 'M':
        return 'months'
      case 'y':
        return 'years'
      default:
        console.log('Unknown unit ', unit)
        return ''
    }
  }

  function PeakFilter(dataIn, limit) {
    let datapoints = dataIn
    const arrLength = datapoints.length
    if (arrLength <= 3)
      return datapoints

    const LastIndx = arrLength - 1

    // Check first point
    let prvDelta = Math.abs((datapoints[1][0] - datapoints[0][0]) / datapoints[0][0])
    let nxtDelta = Math.abs((datapoints[1][0] - datapoints[2][0]) / datapoints[2][0])
    if (prvDelta >= limit && nxtDelta < limit)
      datapoints[0][0] = datapoints[1][0]

    // Check last point
    prvDelta = Math.abs((datapoints[LastIndx - 1][0] - datapoints[LastIndx - 2][0]) / datapoints[LastIndx - 2][0])
    nxtDelta = Math.abs((datapoints[LastIndx - 1][0] - datapoints[LastIndx][0]) / datapoints[LastIndx][0])
    if (prvDelta >= limit && nxtDelta < limit)
      datapoints[LastIndx][0] = datapoints[LastIndx - 1][0]

    for (let i = 1; i < arrLength - 1; i++) {
      prvDelta = Math.abs((datapoints[i][0] - datapoints[i - 1][0]) / datapoints[i - 1][0])
      nxtDelta = Math.abs((datapoints[i][0] - datapoints[i + 1][0]) / datapoints[i + 1][0])
      if (prvDelta >= limit && nxtDelta >= limit)
        datapoints[i][0] = (datapoints[i - 1][0] + datapoints[i + 1][0]) / 2
    }

    return datapoints
  }

  function expandTargets(options) {
    return _.flatten(_.map(
      options.targets,
      target => _.map(currentTemplateValue(target.metric, self.templateSrv, options.scopedVars),
                      metric => {
                        let copy = angular.copy(target)
                        copy.metric = metric
                        return copy
                      }
        )
    ))
  }

  return { KairosDBDatasource }
})
