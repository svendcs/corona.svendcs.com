Svend's Corona Dashboard (Work-in-Progress)
===========================================
[![Build Status](https://ci.svendcs.com/api/badges/svendcs/corona.svendcs.com/status.svg)](https://ci.svendcs.com/svendcs/corona.svendcs.com)

Svend's Corona Dashboard shows the latest Covid-19 numbers in Denmark. All data
is automatically pulled from the official sources at [ssi.dk](https://ssi.dk).

The dashboard is still very much a word-in-progress and the code is a mess.
This repository contains the source code and continuous integration scripts for
the dashboard.

Development Setup
-----------------
The dashboard itself is a static webpage that fetches json files. In order to
run locally, you should first run the various scripts to fetch data. Afterwards
you should run a http server like so:
```
yarn install
yarn dev
```

