# Archived - KairosDB data source plugin no longer supported

There is no community maintainer for this plugin and Grafana Labs is not maintaining it either. If you want to take over as maintainer, then please contact us by [opening an issue on the main Grafana repositiory](https://github.com/grafana/grafana/issues/new) or via [GitHub discussions](https://github.com/grafana/grafana/discussions).

Starting in Grafana 3.x the KairosDB data source is no longer included out of the box.

## Installation
Either clone this repo into your grafana plugins directory (default /var/lib/grafana/plugins if your installing grafana with package). Then run grunt to compile typescript.
Restart grafana-server and the plugin should be automatically detected and used.

```
git clone https://github.com/grafana/kairosdb-datasource
npm install
grunt
sudo service grafana-server restart
```

## Clone into a directory of your choice

Then edit your grafana.ini config file (Default location is at /etc/grafana/grafana.ini) and add this:

```ini
[plugin.kairosdb]
path = /home/your/clone/dir/datasource-plugin-kairosdb
```

Note that if you clone it into the grafana plugins directory you do not need to add the above config option. That is only
if you want to place the plugin in a directory outside the standard plugins directory. Be aware that grafana-server
needs read access to the directory.
