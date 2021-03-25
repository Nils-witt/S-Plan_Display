# S-Plan Display

## Docker
Herunterladen der `docker-compose.yaml` und starten

``````
docker run -dp 80:80 ghcr.io/nils-witt/s-plan_display:latest
``````

## Manuell
NodeJs installien: https://nodejs.org/en/download/


Repository clonen
```
git clone https://github.com/Nils-witt/S-Plan_Display
```
Abhängigkeiten installieren
````
npm i
````

Anwendung compilieren mit `npx tsc` und die Ausgabe auf einem Webserver ablegen.