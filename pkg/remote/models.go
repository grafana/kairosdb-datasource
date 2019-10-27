package remote

type MetricQueryRequest struct {
	StartAbsolute int64          `json:"start_absolute"`
	EndAbsolute   int64          `json:"end_absolute"`
	Metrics       []*MetricQuery `json:"metrics"`
}

type MetricQuery struct {
	Name        string                   `json:"name"`
	Aggregators []map[string]interface{} `json:"aggregators,omitempty"`
	GroupBy     []*Grouper               `json:"group_by,omitempty"`
	Tags        map[string][]string      `json:"tags,omitempty"`
}

type Sampling struct {
	Value int64  `json:"value"`
	Unit  string `json:"unit"`
}

//TODO support group by time and value
type Grouper struct {
	Name string   `json:"name"`
	Tags []string `json:"tags"`
}

type MetricQueryResponse struct {
	Queries []*MetricQueryResults `json:"queries,omitempty"`
	Errors  []string              `json:"errors,omitempty"`
}

type MetricQueryResults struct {
	Results []*MetricQueryResult `json:"results"`
}

type MetricQueryResult struct {
	Name      string              `json:"name"`
	GroupInfo []*GroupInfo        `json:"group_by,omitempty"`
	Tags      map[string][]string `json:"tags,omitempty"`
	Values    []*DataPoint        `json:"values"`
}

func (r *MetricQueryResult) GetTaggedGroup() map[string]string {
	if r.GroupInfo != nil {
		for _, groupInfo := range r.GroupInfo {
			if groupInfo.Name == "tag" {
				return groupInfo.Group
			}
		}
	}

	return map[string]string{}
}

type GroupInfo struct {
	Name  string            `json:"name"`
	Tags  []string          `json:"tags,omitempty"`
	Group map[string]string `json:"group,omitempty"`
}

type DataPoint [2]float64
