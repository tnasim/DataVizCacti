import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

CONNECTION_TIME_LIMIT = 5
DATA_PATH = "dataset.csv"
GEOJSON_US_STATES_DATA_PATH = 'us-states.json'
GEOJSON_AMERICAS_DATA_PATH = 'americas.json'

# states = gpd.read_file(GEOJSON_US_STATES_DATA_PATH)
states = gpd.read_file(GEOJSON_AMERICAS_DATA_PATH)

# print(states['geometry'].x)
count = 0
cactus_data = pd.read_csv('dataset.csv', usecols=['Species','lat','lon'])
cactus_points = []
for _, cactus in cactus_data.iterrows():
    # print( 'Point({:14.9f}, {:14.9f})'.format(cactus['lat'], cactus['lon']) )
    cactus_points.append( Point(cactus['lon'], cactus['lat']) )

population = []
s = set()
for _, row in states.iterrows():
    count_cactus = 0
    for p in cactus_points:
        if row.geometry.contains(p):
            count_cactus = count_cactus + 1
        # else:
        #     print(p, 'not in', row.geometry)

    s.add(row.geometry.type)
    if count_cactus > 0:
        print("{:40s} {:40s} --> {:3d}".format(row['name'], row['admin'], count_cactus))

    population.append(count_cactus)

    # count = count + 1
    # if count>1000:
    #     break

print(population)
print(len(population))
print(s)

updated_states = states.assign(cactus_occurance = population)
print(updated_states.head(15))

updated_states.to_file("americas_updated.json", driver="GeoJSON")
# population_list = get_cactus_population(states)

# get_statewise_cactus_population(DATA_PATH)




###########################################################################################
# THIS WAS NOT USED, INSTEAD, I USED THE BUILD-IN METHOD 'contains()' ABOVE
###########################################################################################
def pointInPolygon(polyCorners, polyX, polyY, x, y):

    j = polyCorners - 1;
    oddNodes = True;

    for i in range(polyCorners):
        if (polyY[i] < y and polyY[j] >= y) or (polyY[j] < y and polyY[i] >= y):
            if polyX[i] + (y - polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j] - polyX[i]) < x:
                oddNodes = (not oddNodes)
        j = i

    return oddNodes;

def get_statewise_cactus_population(data_path):
    limit = 5
    i = 0
    df = pd.read_csv(data_path, usecols=['Species', 'years', 'place', 'lat', 'lon', 'Description', 'imag', 'TRUE'])
    for _, row in df.iterrows():
        print(row['Species'], row['place'], row["lat"], row["lon"])
        i = i + 1
        if i > limit:
            break

def get_cactus_population(states):
    population = []



def test_point_inclusion():
    polyX = [-66.448338, -66.771478, -66.924832, -66.985078, -67.209633, -67.154863, -67.269879, -67.094617, -66.957694,
             -66.409999, -65.840398, -65.632274, -65.626797, -65.730859, -65.834921, -66.234737, -66.448338]

    polyY = [17.984326, 18.006234, 17.929556, 17.973372, 17.956941, 18.19245, 18.362235, 18.515589, 18.488204,
             18.488204, 18.433435, 18.367712, 18.203403, 18.186973, 18.017187, 17.929556, 17.984326]
    if pointInPolygon(17, polyX, polyY, 18.3728286, -65.7296007):
        print("INSIDE\n")
    else:
        print("OUTSIDE\n")

# test_point_inclusion()

# capitals = gpd.read_file(gpd.datasets.get_path("naturalearth_cities"))
# print(capitals)
