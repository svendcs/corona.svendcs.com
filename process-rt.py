import csv
import json
import os
import glob

def parse_float(s):
    return float(s.replace(',', '.'))

folder_names = sorted(os.listdir('data/ssi'))
date = folder_names[-1]
case_path = glob.glob("data/ssi/{}/Rt_cases_*.csv".format(date))[0]
hospitalized_path = glob.glob("data/ssi/{}/Rt_cases_*.csv".format(date))[0]

data = {}
data['cases'] = {}
data['cases']['dates'] = []
data['cases']['estimate'] = []
data['cases']['lower'] = []
data['cases']['upper'] = []

data['hospitalized'] = {}
data['hospitalized']['dates'] = []
data['hospitalized']['estimate'] = []
data['hospitalized']['lower'] = []
data['hospitalized']['upper'] = []

# Read Rt cases
with open(case_path) as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)

    for row in reader:
        data['cases']['dates'].append(row[0])
        data['cases']['estimate'].append(parse_float(row[1]))
        data['cases']['lower'].append(parse_float(row[2]))
        data['cases']['upper'].append(parse_float(row[3]))

# Read Rt hospitalized
with open(hospitalized_path) as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)

    for row in reader:
        data['hospitalized']['dates'].append(row[0])
        data['hospitalized']['estimate'].append(parse_float(row[1]))
        data['hospitalized']['lower'].append(parse_float(row[2]))
        data['hospitalized']['upper'].append(parse_float(row[3]))

# Write json file
with open("json/rt.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

