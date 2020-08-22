import csv
import json
import os

def map_int(s):
    if s == "<10":
        return 10
    return int(s.replace('.', ''))

with open('config.json', 'r') as config_file:
    config = json.loads(config_file.read())

    municipalities = {}

    # Create map of municipalities
    for municipality_config in config['municipalities']:
        ident = municipality_config['id']
        municipalities[ident] = {}
        municipalities[ident]['tested'] = []
        municipalities[ident]['cases'] = []
        municipalities[ident]['population'] = []

    # Parse CSV files
    for date in config['dates']:
        with open('data/ssi/{}/Municipality_test_pos.csv'.format(date)) as csvfile:
            reader = csv.reader(csvfile, delimiter=';')
            next(reader)

            for row in reader:
                ident = int(row[0])

                municipalities[ident]['tested'].append(map_int(row[3]))
                municipalities[ident]['cases'].append(map_int(row[4]))
                municipalities[ident]['population'].append(map_int(row[5]))

    # Write json files
    for municipality_config in config['municipalities']:
        ident = municipality_config['id']
        filename = "json/municipalities/{}.json".format(municipality_config['filename'])
        municipality = municipalities[ident]

        with open(filename, 'w') as json_file:
            json.dump(municipality, json_file)

