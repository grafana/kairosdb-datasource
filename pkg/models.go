package main

import "net/http"

type TargetResponseDTO struct {
	Target     string           `json:"target,omitempty"`
	DataPoints TimeSeriesPoints `json:"datapoints,omitempty"`
}

type TimePoint [2]float64
type TimeSeriesPoints []TimePoint

type RemoteDatasourceRequest struct {
	req     *http.Request
	queries []interface{}
}
