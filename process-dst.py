import xml.etree.ElementTree as ElementTree
import json

tree = ElementTree.parse('data/dst/data.xml')
root = tree.getroot()

dates = []
hospitalized = dict()
intensive_care = dict()
respirator = dict()

for item in root.findall('./Data/No'):
    if item.text == '..':
        continue

    value = int(item.text)
    code = int(item.attrib['V1'])
    datestr = item.attrib['V2']
    date = "2020-{}-{}".format(datestr[1:3], datestr[4:])

    dates.append(date)
    if code == 35:
        hospitalized[date] = value
    elif code == 40:
        intensive_care[date] = value
    else:
        respirator[date] = value


data = {}
data['dates'] = []
data['intensive_care'] = []
data['hospitalized'] = []
data['respirator'] = []

for date in sorted(dates):
    data['dates'].append(date)
    data['hospitalized'].append(hospitalized[date])
    data['intensive_care'].append(intensive_care[date])
    data['respirator'].append(respirator[date])

# Write json file
with open("json/hospitalized.json", 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)

