package logging

import "github.com/hashicorp/go-hclog"

// Get returns a new hclog.Logger with the specified name.
// All logs will be sent to the Grafana server process.
func Get(name string) hclog.Logger {
	return hclog.New(&hclog.LoggerOptions{
		Name:       name,
		Level:      hclog.Trace, // Grafana server will filter logs
		JSONFormat: true,
	})
}
