#!/bin/bash

mkdir -p "data/dst"
body="{ \"lang\": \"en\", \"table\": \"smit1\", \"format\": \"DSTML\", \"variables\": [ { \"code\": \"aktp\", \"values\": [ \"35\", \"40\", \"45\" ] }, { \"code\": \"tid\", \"values\": [ \"*\" ] } ] }"

curl --header "Content-Type: application/json" --request POST --data "$body" https://api.statbank.dk/v1/data > "data/dst/data.xml"

