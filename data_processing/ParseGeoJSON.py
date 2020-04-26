import geopandas as gpd
import geojsonio
import json

states = gpd.read_file('us-states.json')
# states = gpd.read_file('ne_10m_admin_1_states_provinces.json')
print(states.head(5))

# geojsonio.display(states)

print(type(states))
print(set(states['name']))

states.insert(2, "pop", [0 for i in range(len(set(states['name'])))])
print(states.head(5))


# print(len(set(states['admin']))) # 253 countries
# # find by: adm0_a3
# country_codes = list(set(states['adm0_a3']))
# country_codes.sort()
# print(country_codes)
# print(len(set(states['adm0_a3'])))


# selected_states = states.loc[(states['adm0_a3'] == 'USA') | (states['adm0_a3'] == 'CAN') | (states['adm0_a3'] == 'MEX') | (states['adm0_a3'] == 'ARG') | (states['adm0_a3'] == 'BOL') | (states['adm0_a3'] == 'BRA') | (states['adm0_a3'] == 'CHL') | (states['adm0_a3'] == 'COL') | (states['adm0_a3'] == 'ECU') | (states['adm0_a3'] == 'GUY') | (states['adm0_a3'] == 'PRY') | (states['adm0_a3'] == 'URY') | (states['adm0_a3'] == 'PER') | (states['adm0_a3'] == 'VEN') | (states['adm0_a3'] == 'SUR') | (states['adm0_a3'] == 'BVT') | (states['adm0_a3'] == 'FLK') | (states['adm0_a3'] == 'SGS') | (states['adm0_a3'] == 'GTM') | (states['adm0_a3'] == 'BLZ') | (states['adm0_a3'] == 'HND') | (states['adm0_a3'] == 'SLV') | (states['adm0_a3'] == 'NIC') | (states['adm0_a3'] == 'CRI') | (states['adm0_a3'] == 'PAN') | (states['adm0_a3'] == 'CUB') | (states['adm0_a3'] == 'DOM') | (states['adm0_a3'] == 'HTI') | (states['adm0_a3'] == 'JAM') | (states['adm0_a3'] == 'PRI') | (states['adm0_a3'] == 'BHS')]
# print(selected_states.to_json())
# selected_states.to_file("americas.json", driver="GeoJSON")
