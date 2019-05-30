package main

import (
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"plugin"
)

var pluginLogger = hclog.New(&hclog.LoggerOptions{
	Name:  "kairosdb-datasource",
	Level: hclog.LevelFromString("DEBUG"),
})

func main() {
	pluginLogger.Debug("Running KairosDB backend datasource")

	plugin.Serve(&plugin.ServeConfig{

		HandshakeConfig: plugin.HandshakeConfig{
			ProtocolVersion:  1,
			MagicCookieKey:   "grafana_plugin_type",
			MagicCookieValue: "datasource",
		},
		Plugins: map[string]plugin.Plugin{
			"kairosdb-datasource": &datasource.DatasourcePluginImpl{Plugin: &KairosDBDatasource{
				logger: pluginLogger,
			}},
		},

		// A non-nil value here enables gRPC serving for this plugin...
		GRPCServer: plugin.DefaultGRPCServer,
	})
}
