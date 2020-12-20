Svend's Corona Dashboard (Work-in-Progress)
===========================================
[![Build Status](https://ci.svendcs.com/api/badges/svendcs/corona.svendcs.com/status.svg)](https://ci.svendcs.com/svendcs/corona.svendcs.com)

Svend's Corona Dashboard shows the latest Covid-19 numbers in Denmark. All data
is automatically pulled from the official sources at [ssi.dk](https://ssi.dk).
This repository contains the source code and infrastructure-as-code for the dashboard.

The dashboard is still very much a word-in-progress.

Development Setup
-----------------
The dashboard itself is a static webpage that fetches json files. In order to
run locally, you should run it on a small http server like so:
```
yarn install
yarn dev
```

