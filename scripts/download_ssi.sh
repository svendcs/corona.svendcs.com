#!/bin/bash

# Download and parse webpage
page_url="https://covid19.ssi.dk/overvagningsdata/download-fil-med-overvaagningdata"
zip_url=$(curl -s $page_url | grep "Download her" | cut -d '"' -f2)
datestring=$(echo $zip_url | cut -d '-' -f4)
date=${datestring:0:2}
month=${datestring:2:2}
year=${datestring:4:4}

# Download and extract zip
mkdir -p data/ssi
archive_path="/tmp/covid-archive.zip"
curl $zip_url --output $archive_path
unzip -u -d "data/ssi/$year-$month-$date" $archive_path

