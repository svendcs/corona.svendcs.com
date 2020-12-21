import csv
import json
import os

def map_int(s):
    return int(s.replace('.', ''))

def map_municipality(municipality):
    if municipality == 'Copenhagen':
        return 'København'
    return municipality

folder_names = sorted(os.listdir('data/ssi'))
date = folder_names[-1]

data = {}
data['dates'] = []
data['municipalities'] = {}

# Read cases file
with open("data/ssi/{}/Municipality_cases_time_series.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    header_row = next(reader)[1:]

    for municipality in header_row:
        if municipality == "NA":
            continue

        data['municipalities'][map_municipality(municipality)] = {}
        data['municipalities'][map_municipality(municipality)]['cases'] = []
        data['municipalities'][map_municipality(municipality)]['testedPersons'] = []

    for row in reader:
        data['dates'].append(row[0])

        for index, cases in enumerate(row[1:]):
            municipality = map_municipality(header_row[index])

            if not municipality in data['municipalities']:
                continue

            data['municipalities'][municipality]['cases'].append(map_int(cases))

# Read tested persons file
with open("data/ssi/{}/Municipality_tested_persons_time_series.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    header_row = next(reader)[1:]

    for row in reader:
        for index, tested_persons in enumerate(row[1:]):
            municipality = map_municipality(header_row[index])

            if not municipality in data['municipalities']:
                continue

            data['municipalities'][municipality]['testedPersons'].append(map_int(tested_persons))

# Read population statistics
with open("data/ssi/{}/Municipality_test_pos.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    next(reader) # Skip header row

    for row in reader:
        municipality = map_municipality(row[1])

        if not municipality in data['municipalities']:
            continue

        data['municipalities'][municipality]['population'] = map_int(row[4])

# Write source information
data['last_updated'] = "{} 14:00:00".format(data['dates'][-1])
data['source'] = 'Statens Serum Institut'
data['source_url'] = 'https://covid19.ssi.dk/overvagningsdata/download-fil-med-overvaagningdata'

# Write json file
with open("json/municipalities_time_series.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

