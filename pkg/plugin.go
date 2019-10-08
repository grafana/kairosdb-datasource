package main

import (
	grafana "github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"net/http"
	"os"
	"time"
)

func main() {
	logger := hclog.New(&hclog.LoggerOptions{
		Level:      hclog.Info,
		Output:     os.Stderr,
		JSONFormat: true,
	})

	logger.Info("Running KairosDB backend datasource")

	// TODO support configuration of http client
	kairosClient := remote.KairosDBClientImpl{
		HttpClient: http.Client{
			Timeout: time.Duration(time.Second * 30),
		},
		Logger: logger,
	}

	plugin.Serve(&plugin.ServeConfig{

		HandshakeConfig: plugin.HandshakeConfig{
			ProtocolVersion:  1,
			MagicCookieKey:   "grafana_plugin_type",
			MagicCookieValue: "datasource",
		},
		Plugins: map[string]plugin.Plugin{
			"grafana-kairosdb-datasource": &grafana.DatasourcePluginImpl{Plugin: &datasource.Datasource{
				KairosDBClient: kairosClient,
				Logger:         logger,
			}},
		},

		// A non-nil value here enables gRPC serving for this plugin...
		GRPCServer: plugin.DefaultGRPCServer,
	})
}
