package main

import (
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"golang.org/x/net/context"
)

type KairosDBDatasource struct {
	plugin.NetRPCUnsupportedPlugin
	logger hclog.Logger
}

func (ds *KairosDBDatasource) Query(ctx context.Context, request *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	ds.logger.Debug("Query", "datasource", request.Datasource.Name, "TimeRange", request.TimeRange)

	response := &datasource.DatasourceResponse{}

	return response, nil
}
