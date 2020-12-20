Svend's Corona Dashboard
========================
Svend's Corona Dashboard shows the latest Covid-19 numbers in Denmark. All data
is automatically pulled from the official sources at [ssi.dk](https://ssi.dk)
and [sst.dk](https://sst.dk).
This repository contains the source code and infrastructure-as-code for the dashboard.

Development Setup
-----------------
The dashboard itself is a static webpage that fetches json files. In order to
run locally, you should run it on a small http server like so:
```
yarn install
yarn dev
```

