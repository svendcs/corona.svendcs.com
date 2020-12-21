import csv
import json
import os

def map_int(s):
    return int(s.strip().replace('.', ''))

folder_names = sorted(os.listdir('data/ssi'))
date = folder_names[-1]

data = {}
data['dates'] = []
data['cases'] = []
data['testedPersons'] = []
data['deaths'] = []
data['population'] = 5837213

# Read test positive over time
with open("data/ssi/{}/Test_pos_over_time.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)

    rows = list(reader)
    for row in rows[0:-2]:
        data['dates'].append(row[0])
        data['cases'].append(map_int(row[1]))
        data['testedPersons'].append(map_int(row[5]))

# Read deaths over time
with open("data/ssi/{}/Deaths_over_time.csv".format(date), 'r') as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)

    rows = list(reader)

    # Prepend zeroes
    for _ in range(len(data['dates']) - len(rows[:-1])):
        data['deaths'].append(0)

    # Read rows
    for row in rows[:-1]:
        data['deaths'].append(map_int(row[1]))

data['last_updated'] = "{} 14:00:00".format(date)
data['source'] = 'Statens Serum Institut'
data['source_url'] = 'https://covid19.ssi.dk/overvagningsdata/download-fil-med-overvaagningdata'

# Write json file
with open("json/national_time_series.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

