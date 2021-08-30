all: frontend backend

frontend:
	grunt

backend:
	go build -o ./dist/grafana-kairosdb-datasource_darwin_amd64 ./pkg

clean:
	rm -r ./dist/*
