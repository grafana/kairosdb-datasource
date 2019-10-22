Starting in Grafana 3.x the KairosDB data source is no longer included out of the box.

But it is easy to install this plugin!

## Overview
This plugin consists of two components: a frontend and a backend

The backend plugin provides support for [alerts](https://grafana.com/docs/alerting/rules), but is not required to use the frontend portion.

## Installation
### Install to plugins directory

If you only need the frontend component you may clone the project directly into your Grafana plugin directory 
(defaults to /var/lib/grafana/plugins if you're installing grafana with package). 

Then simply compile the code and restart Grafana:
```
git clone https://github.com/grafana/kairosdb-datasource
cd kairosdb-datasource
npm install
make frontend
sudo service grafana-server restart
```

### Install with Alerts
If you wish to build the backend plugin, as well, your project must be setup within a [Go workspace](https://golang.org/doc/code.html#Workspaces).

Ensure your GOPATH environment variable points to your workspace:
```
export GOPATH=$HOME/go
cd $GOPATH/src/github.com/grafana
git clone https://github.com/grafana/kairosdb-datasource
```


Edit your grafana.ini config file (Default location is at /etc/grafana/grafana.ini) to include the path to your clone. 
Be aware that grafana-server needs read access to the project directory.

```ini
[plugin.kairosdb]
path = $GOPATH/src/github.com/grafana/kairosdb-datasource
```

Then compile the code and restart Grafana:
```
npm install
make
sudo service grafana-server restart
```
