var dataset;

//Define bar chart function
	function barChart(dataset){

		//Set width and height as fixed variables
		var w = 900;
		var h = 1000;
		var padding = 1;

		//Scale function for axes and radius
		var state = d3.selectAll("option");
		var yScale = d3.scale.linear()
						.domain(d3.extent(dataset, function(d){
							if(state[0][0].selected){
								console.log(state[0][0])
							   	return d.dr_change;
							   }
							   else if(state[0][1].selected){
							   	return d.bus_change;
							   }
							   else if(state[0][2].selected){
							   	return d.names_tall;
							   }}))
						.range([w+padding,padding]);

		var xScale = d3.scale.ordinal()
						.domain(dataset.map(function(d){ return d.name;}))
						.rangeRoundBands([padding+10,h+padding+10],.1);

		//To format axis as a percent
		var formatPercent = d3.format("%1");

		//Create y axis
		var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(20).tickFormat(Math.abs);

		//Define key function
		var key = function(d){return d.name};

		//Define tooltip for hover-over info windows
		var div = d3.select("body").append("div")
  							.attr("class", "tooltip")
  							.style("opacity", 0);

		//Create svg element
		var svg = d3.select("#chart-container").append("svg")
				.attr("width", w).attr("height", h)
				.attr("id", "chart")
				.attr("viewBox", "0 0 "+w+ " "+h)
				.attr("preserveAspectRatio", "xMinYMin");

		//Resizing function to maintain aspect ratio (uses jquery)
		var aspect = w / h;
		var chart = $("#chart");
			$(window).on("resize", function() {
			    var targetWidth = $("body").width();

	    		if(targetWidth<w){
	    			chart.attr("width", targetWidth);
	    			chart.attr("height", targetWidth / aspect);
	    		}
	    		else{
	    			chart.attr("width", w);
	    			chart.attr("height", w / aspect);
	    		}

			});


		//Initialize state of chart according to drop down menu



		//Create barchart
		var bar = svg.selectAll("g")

			.data(dataset, key)
			.enter()
			.append('g');

		  	bar.append("rect")
		    .attr("class", function(d){
		    	if (state[0][0].selected){
		    	return d.dr_change < 0 ? "negative" : "positive";}
		    	else if (state[0][1].selected){
		    	return d.bus_change < 0 ? "negative" : "positive";}
		    	else if (state[0][2].selected){
		    			return d.names_tall < 0 ? "negative" : "positive";
		    	}})
		    .attr({
		    	x: function(d){
		    		return d.points;
		    	},
		    	y: function(d){
		    		if (state[0][0].selected){
		    	return yScale(Math.max(0, d.dr_change)); }
		    	else if (state[0][1].selected){
		    	return yScale(Math.max(0, d.bus_change)); }
		    	else if (state[0][2].selected){
		    	return yScale(Math.max(0, d.names_tall)); }

		    	},
		    	width: xScale.rangeBand(),
		    	height: function(d){
		    		if (state[0][0].selected){
		    		return Math.abs(yScale(d.dr_change) - yScale(0)); }
		    		else if (state[0][1].selected){
		    			return Math.abs(yScale(d.bus_change) - yScale(0)); }
		    			else if (state[0][2].selected){
		    			return Math.abs(yScale(d.names_tall) - yScale(0)); }
		    	}
		    });
		   // bar.append("text")
   /* .attr("x", function(d){
    	console.log("djhs")
		    		return d.points;})
    .attr("y", function(d){
		    		if (state[0][0].selected){
		    	return yScale(Math.max(0, d.dr_change)); }
		    	else if (state[0][1].selected){
		    	return yScale(Math.max(0, d.bus_change)); }
		    	else if (state[0][2].selected){
		    	return yScale(Math.max(0, d.names_tall)); }

		    	})
    .attr("dy", ".35em")*/
    //.text(function(d) { return d.name_tall; });
		    bar.on('mouseover', function(d){
							d3.select(this)
							    .style("opacity", 0.2)
							    .style("stroke", "black")

					var info = div
							    .style("opacity", 1)
							    .style("left", (d3.event.pageX+10) + "px")
							    .style("top", (d3.event.pageY-30) + "px")
							   .text(function(){
							   	if(state[0][0].selected){

							   	return "Species Name:"+'\n'+d.name_short;
							   }
							   else if(state[0][1].selected){
							   	return "Species Name:"+'\n'+ d.names_creepy;
							   }
							   else if(state[0][2].selected){
							   	return "Species Name:"+'\n'+d.name_tall;
							   }
							   })



					if(state[0][0].selected){
						if (d.dr_change<0){
							info.append("p")



							    .text("Lower Extrimite"+"-"+Math.abs(d.dr_change)+" Celsius");
							}
							else if (d.dr_change>0){
								info.append("p")
								 .text("Higher Extrimite"+"-"+Math.abs(d.dr_change)+" Celsius");
							}

					}
					else if(state[0][1].selected){

						if (d.bus_change<0){


						info.append("p")


							    .text("Lower Extrimite"+"-"+Math.abs(d.bus_change)+" Celsius");
							}
							else if (d.dr_change>0){
								info.append("p")
								 .text("Higher Extrimite"+"-"+Math.abs(d.bus_change)+" Celsius");
							}
					}
					else if(state[0][2].selected){
							if (d.names_tall<0){

						info.append("p")
						//console.log(state[0][2])


							    .text("Lower Extrimite"+"-"+Math.abs(d.names_tall)+" Celsius");}
							else if (d.names_tall>0){

						info.append("p")
						//console.log(state[0][2])


							    .text("Higher Extrimite"+"-"+Math.abs(d.names_tall)+" Celsius");}
					}



						})
        				.on('mouseout', function(d){
        					d3.select(this)
							.style({'stroke-opacity':0.5,'stroke':'#a8a8a8'})
							.style("opacity",1);

							div
	    						.style("opacity", 0);
        				});


		//Add y-axis
		svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(30,0)")
				.call(yAxis);

		//Sort data when sort is checked

		//Function to sort data when sort box is checked


		//Change data to correct values on input change
			d3.selectAll("select").
			on("change", function() {

				var value= this.value;

				if(value=="bus"){
					var x_value = function(d){return d.bus_change;};
					var color = function(d){return d.bus_change < 0 ? "negative" : "positive";};
					var y_value = function(d){
			    		return yScale(Math.max(0, d.bus_change));
			    	};
			    	var height_value = function(d){
			    		return Math.abs(yScale(d.bus_change) - yScale(0));
			    	};
				}
				else if(value=="demand"){
					var x_value = function(d){return d.dr_change;};
					var color = function(d){return d.dr_change < 0 ? "negative" : "positive";};
					var y_value = function(d){
			    		return yScale(Math.max(0, d.dr_change));
			    	};
			    	var height_value = function(d){
			    		return Math.abs(yScale(d.dr_change) - yScale(0));
			    	};
				}
				else if(value=="dus"){
					var x_value = function(d){return d.names_tall;};
					var color = function(d){return d.names_tall < 0 ? "negative" : "positive";};
					var y_value = function(d){
			    		return yScale(Math.max(0, d.names_tall));
			    	};
			    	var height_value = function(d){
			    		return Math.abs(yScale(d.names_tall) - yScale(0));
			    	};
				}

				//Update y scale
				yScale.domain(d3.extent(dataset, x_value));

				//Update with correct data
				var rect = svg.selectAll("rect").data(dataset, key);
				rect.exit().remove();

				//Transition chart to new data
				rect
				.transition()
				.duration(2000)
				.ease("linear")
				.each("start", function(){
					d3.select(this)
					.attr("width", "0.2")
					.attr("class", color)
				})
				.attr({
			    	x: function(d){
			    		return d.points;
			    	},
			    	y: y_value,
			    	width: xScale.rangeBand(),
			    	height: height_value

				});

				//Update y-axis
				svg.select(".y.axis")
					.transition()
					.duration(1000)
					.ease("linear")
					.call(yAxis);
			});

	};

	//Load data and call bar chart function
		d3.csv("/res/temp_data.csv", function(error,data){
				if(error){
					console.log(error);
				}
				else{
					data.forEach(function(d) {
						d.dr_change = parseFloat(d.dr_change);
						d.bus_change = parseFloat(d.bus_change);
						d.names_tall = parseFloat(d.names_tall);
					});
					dataset=data;
					barChart(dataset);
				}
			});
