package panel

type MetricRequest struct {
	Query *MetricQuery `json:"query"`
	RefID string       `json:"refId"`
}

type MetricQuery struct {
	Name        string        `json:"metricName"`
	RefId       string        `json:"refId"`
	Aggregators []*Aggregator `json:"aggregators"`
	//GroupBy
	//Tags
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
