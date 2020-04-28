
## Overview of Features

*   Classification based on flower reproducibility( Location wise) ([Classification](index.html))
*   Loc-wise heat map(Chloropleth) - ([Heat Map](choropleth.html))
*   Living Temperature ([here](temperature.html))
*   Family Packing of Species ([Zoomable packing](zoompack.html))
*   Word cloud based on Reproducibility and Occurrence ([Flowering](wordcloud-flower.html), [Non Flowering](wordcloud-no-flower.html))


## Data Collection and Processing
*   SEINet webpage was scraped using python code to get images and description
*   We also collected locations (lattitude, longitude) for each species. Location for some species are missing (collected using Google Maps)
*   For the Living Temperatures of the cacti, there were almost no data in the SEINet website. We needed to collect data missing using location (if a cactus grows in AZ, we took the temperature range for AZ)
*   We used image classification-filter and rotation and flipping to enhance the data
*   We calculated the population based on lat and long as the data is not available with state data

## Classification based on flower reproducibility( Location wise)
*   Two distinct classes (1) Flower Reproducibility and (2) without Flower Reproducibility
*   Images are classified by a DNN
*   Classification Result displayed by clicking on the point
*   Location Points based on the Latitude and Longitude, Description and Image on hovering the points
*   Search by Auto complete

## Choropleth
*   Sequential color used to indicate the cacti population in various states of the countries
*   Sequential is used because it is easier to identify the strength of the population
*   Our state has the highest population
*   Surprisingly East coast states like NY have some cacti too

## Living Temperature
*   We have divided the cacti into three types
    1.  The pot-able cacti i.e which can be grown in the pots
    2.  The creeper cacti, which really grows on groups
    3.  The tall ones which are above 5ft

*   The classification is done manually by studying the species
*   The upper region is the high extreme temp the cacti can survive
*   And the lowers are low extremities

## Family Packing
*   Each cacti belongs to family and each family has many cacti in it
*   To represent the family of the cacti we used zoomable circle packing
*   This helps us to know the cacti and their 'brothers' and 'sisters' better


## Word Cloud
*   Two fun and interactive word clouds, one for each class (flower producing and non producing)
*   The size of text is based on the population of the family

## Source Code on Github
*   [https://github.com/tnasim/cse578_data_viz_cactus](https://github.com/tnasim/cse578_data_viz_cactus)

## Instruction for Deploying the Website
*   Prerequisite: need python installed in your machine.
*   Clone or download the above mentioned github project.
*   From the root folder of the project, run the following command:
*   `python -m http.server 8000 --bind 127.0.0.1`
*   You can access it from theweb browser at: [localhost:8000](localhost:8000)

## References
*   **[SEINet Website](http://swbiodiversity.org/seinet/imagelib/index.php?taxon=Cactaceae):** We have collected all our cactus related data from this website. In order to collect specific details of each of the cactus, we scraped this website using python other programming techniques.
*   **[Natural Earth - Datasets (for Geo Data)](https://www.naturalearthdata.com/):** We downloaded the "Admin 1 States and Provinces" dataset in 'Shape' format and converted that into 'GeoJSON' format using QGIS software. Then we pruned that dataset to get the dataset which finally contains only information for the countries in North/Central/South - America.
*   **[D3](https://d3js.org/)** was used for different types of interactive visualization in this project.
*   **[Leaflet JS](https://leafletjs.com/)** Was used to draw the choropleth map.


### _Project done for Dr. Sharon Hsiao's Class (CSE 578), Arizona State University_
