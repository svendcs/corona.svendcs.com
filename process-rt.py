import csv
import json
import os
import glob

def parse_float(s):
    return float(s.replace(',', '.'))

folder_names = sorted(os.listdir('data/ssi'))
date = folder_names[-1]
path = glob.glob("data/ssi/{}/Rt_cases_*.csv".format(date))[0]

data = {}
data['dates'] = []
data['estimate'] = []
data['lower'] = []
data['upper'] = []

# Read Rt cases
with open(path, 'r') as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)

    for row in reader:
        data['dates'].append(row[0])
        data['estimate'].append(parse_float(row[1]))
        data['lower'].append(parse_float(row[2]))
        data['upper'].append(parse_float(row[3]))

# Write json file
with open("json/rt.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

