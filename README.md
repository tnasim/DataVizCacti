
                                <div class="card-header">
                                    <h2>Overview of Features</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Classification based on flower reproducibility( Location wise) (<a href="index.html">Classification</a>)</li>
                                        <li class="list-group-item">Loc-wise heat map(Chloropleth) - (<a href="choropleth.html">Heat Map</a>)</li>
                                        <li class="list-group-item">Living Temperature (<a href="temperature.html">here</a>)</li>
                                        <li class="list-group-item">Family Packing of Species (<a href="zoompack.html">Zoomable packing</a>)</li>
                                        <li class="list-group-item">Word cloud based on Reproducibility and Occurrence (<a href="wordcloud-flower.html">Flowering</a>, <a href="wordcloud-no-flower.html">Non Flowering</a>)</li>
                                    </ul>

                                </div>

                                <div class="card-header">
                                    <h2>Data Collection and Processing</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">SEINet webpage was scraped using python code to get images and description</li>
                                        <li class="list-group-item">We also collected locations (lattitude, longitude) for each species. Location for some species are missing (collected using Google Maps)</li>
                                        <li class="list-group-item">For the Living Temperatures of the cacti, there were almost no data in the SEINet website. We needed to collect data missing using location (if a cactus grows in AZ, we took the
                                            temperature range for AZ)
                                        </li>
                                        <li class="list-group-item">We used image classification-filter and rotation and flipping to enhance the data</li>
                                        <li class="list-group-item">We calculated the population based on lat and long as the data is not available with state data</li>
                                    </ul>
                                    <!-- </blockquote> -->
                                </div>

                                <div class="card-header">
                                    <h2>Classification based on flower reproducibility( Location wise)</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Two distinct classes (1) Flower Reproducibility and (2) without Flower Reproducibility</li>
                                        <li class="list-group-item">Images are classified by a DNN</li>
                                        <li class="list-group-item">Classification Result displayed by clicking on the point</li>
                                        <li class="list-group-item">Location Points based on the Latitude and Longitude, Description and Image on hovering the points</li>
                                        <li class="list-group-item">Search by Auto complete</li>
                                    </ul>


                                </div>

                                <div class="card-header">
                                    <h2>Choropleth</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Sequential color used to indicate the cacti population in various states of the countries</li>
                                        <li class="list-group-item">Sequential is used because it is easier to identify the strength of the population</li>
                                        <li class="list-group-item">Our state has the highest population</li>
                                        <li class="list-group-item">Surprisingly East coast states like NY have some cacti too</li>
                                    </ul>

                                </div>

                                <div class="card-header">
                                    <h2>Living Temperature</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">We have divided the cacti into three types
                                            <ol>
                                                <li class="list-group-item">The pot-able cacti i.e which can be grown in the pots</li>
                                                <li class="list-group-item">The creeper cacti, which really grows on groups</li>
                                                <li class="list-group-item">The tall ones which are above 5ft
                                                <li class="list-group-item">
                                            </ol>
                                        </li>
                                        <li class="list-group-item">The classification is done manually by studying the species</li>
                                        <li class="list-group-item">The upper region is the high extreme temp the cacti can survive</li>
                                        <li class="list-group-item">And the lowers are low extremities</li>
                                    </ul>


                                </div>

                                <div class="card-header">
                                    <h2>Family Packing</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Each cacti belongs to family and each family has many cacti in it</li>
                                        <li class="list-group-item">To represent the family of the cacti we used zoomable circle packing</li>
                                        <li class="list-group-item">This helps us to know the cacti and their 'brothers' and 'sisters' better</li>
                                    </ul>

                                </div>

                                <div class="card-header">
                                    <h2>Word Cloud</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Two fun and interactive word clouds, one for each class (flower producing and non producing)</li>
                                        <li class="list-group-item">The size of text is based on the population of the family</li>
                                    </ul>


                                </div>

                                <div class="card-header">
                                    <h2>Source Code on Github</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <a href="https://github.com/tnasim/cse578_data_viz_cactus">https://github.com/tnasim/cse578_data_viz_cactus</a>
                                        </li>
                                    </ul>

                                </div>

                                <div class="card-header">
                                    <h2>Instruction for Deploying the Website</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">Prerequisite: need python installed in your machine.</li>
                                        <li class="list-group-item">Clone or download the above mentioned github project.</li>
                                        <li class="list-group-item">From the root folder of the project, run the following command:</li>
                                        <li class="list-group-item">
                                            <code>
        python -m http.server 8000 --bind 127.0.0.1
    </code>
                                        </li>
                                        <li class="list-group-item">You can access it from theweb browser at: <a href="localhost:8000">localhost:8000</a></li>
                                    </ul>


                                </div>

                                <div class="card-header">
                                    <h2>References</h2>
                                </div>
                                <div class="card-body pt-4">
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <b><a href="http://swbiodiversity.org/seinet/imagelib/index.php?taxon=Cactaceae">SEINet Website</a>:</b> We have collected all our cactus related data from this website. In order to collect specific details
                                            of each of the cactus, we scraped this website using python other programming techniques.
                                        </li>
                                        <li class="list-group-item">
                                            <b><a href="https://www.naturalearthdata.com/">Natural Earth - Datasets (for Geo Data)</a>:</b> We downloaded the "Admin 1 States and Provinces" dataset in 'Shape' format and converted that into 'GeoJSON'
                                            format using QGIS software. Then we pruned that dataset to get the dataset which finally contains only information for the countries in North/Central/South - America.
                                        </li>
                                        <li class="list-group-item">
                                            <b><a href="https://d3js.org/">D3</a></b> was used for different types of interactive visualization in this project.
                                        </li>
                                        <li class="list-group-item">
                                            <b><a href="https://leafletjs.com/">Leaflet JS</a></b> Was used to draw the choropleth map.
                                        </li>
                                    </ul>


                                </div>


            <div class="copyright bg-white">
                <p>Project done for Dr. Sharon Hsiao's Class (CSE 578), Arizona State University
                </p>
            </div>
