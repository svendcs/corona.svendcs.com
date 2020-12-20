import csv
import json
import os

def map_int(s):
    return int(s.replace('.', ''))

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
        data['municipalities'][municipality] = {}
        data['municipalities'][municipality]['cases'] = []
        data['municipalities'][municipality]['testedPersons'] = []

    for row in reader:
        data['dates'].append(row[0])

        for index, cases in enumerate(row[1:]):
            municipality = header_row[index]

            data['municipalities'][municipality]['cases'].append(cases)

# Read tested persons file
with open("data/ssi/{}/Municipality_tested_persons_time_series.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    header_row = next(reader)[1:]

    for row in reader:
        for index, tested_persons in enumerate(row[1:]):
            municipality = header_row[index]

            if not municipality in data['municipalities']:
                continue

            data['municipalities'][municipality]['testedPersons'].append(tested_persons)

# Write json file
with open("json/municipalities.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

