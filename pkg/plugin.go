package main

import (
	grafana "github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/logging"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"net/http"
	"time"
)

func main() {
	logger := logging.Get("main")

	logger.Info("Running KairosDB backend datasource")

	// TODO support configuration of http client
	kairosClient := remote.NewKairosDBClient(&http.Client{
		Timeout: time.Duration(time.Second * 30),
	})

	aggregatorConverter := datasource.NewAggregatorConverterImpl(
		map[string]datasource.ParameterConverter{
			"alignment": &datasource.AlignmentParameterConverter{},
			"sampling":  &datasource.SamplingParameterConverter{},
			"enum":      &datasource.StringParameterConverter{},
			"any":       &datasource.AnyParameterConverter{},
		})
	metricQueryConverter := datasource.NewMetricQueryConverterImpl(aggregatorConverter, &datasource.GroupByConverterImpl{})

	plugin.Serve(&plugin.ServeConfig{

		HandshakeConfig: plugin.HandshakeConfig{
			ProtocolVersion:  1,
			MagicCookieKey:   "grafana_plugin_type",
			MagicCookieValue: "datasource",
		},
		Plugins: map[string]plugin.Plugin{
			"grafana-kairosdb-datasource": &grafana.DatasourcePluginImpl{
				Plugin: datasource.NewKairosDBDatasource(kairosClient, metricQueryConverter),
			},
		},
		Logger: logger,
		// A non-nil value here enables gRPC serving for this plugin...
		GRPCServer: plugin.DefaultGRPCServer,
	})
}
