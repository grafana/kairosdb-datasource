package main

import (
	"net/http"
)

type KairosResponse struct {
	Queries []QueryResponse `json:"queries"`
}

type QueryResponse struct {
	Results []QueryResult `json:"results"`
}

type QueryResult struct {
	Name string `json:"name"`
	//GroupBy []interface{}     `json:"group_by,omitempty"`
	//Tags    map[string]string `json:"tags,omitempty"`
	Values []DataPoint `json:"values"`
}

type DataPoint [2]float64

type DatasourceRequest struct {
	Query DatasourceQuery `json:"query"`
}

type DatasourceQuery struct {
	MetricName  string       `json:"metricName"`
	RefId       string       `json:"refId"`
	Aggregators []Aggregator `json:"aggregators"`
	//GroupBy
	//Tags
}

type Aggregator struct {
	Name       string                `json:"name"`
	Parameters []AggregatorParameter `json:"parameters"`
}

type AggregatorParameter struct {
	Name  string `json:"name"`
	Text  string `json:"text"`
	Type  string `json:"type"`
	Value string `json:"value"`
}

type RemoteDatasourceRequest struct {
	req     *http.Request
	queries []interface{}
}
