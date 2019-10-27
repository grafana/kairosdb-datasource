package datasource

type MetricRequest struct {
	Query *MetricQuery `json:"query"`
	RefID string       `json:"refId"`
}

type MetricQuery struct {
	Name        string              `json:"metricName"`
	Aggregators []*Aggregator       `json:"aggregators"`
	GroupBy     *GroupBy            `json:"groupBy"`
	Tags        map[string][]string `json:"tags"`
}

type GroupBy struct {
	Tags []string `json:"tags"`
}

type Aggregator struct {
	Name       string                 `json:"name"`
	Parameters []*AggregatorParameter `json:"parameters"`
}

type AggregatorParameter struct {
	Name  string `json:"name"`
	Text  string `json:"text"`
	Type  string `json:"type"`
	Value string `json:"value"`
}
