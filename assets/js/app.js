// @TODO: YOUR CODE HERE!
// SVG wrapper dimensions are determined by the current width and height of the browser window.
var svgWidth = 960;
var svgHeight = 500;

// Set svg margins
var margin = {
    top: 40, 
    right: 40, 
    bottom: 80, 
    left: 90
};

// Create height and width based svg margins and parameters to fit chart group within the chart area
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create svg container, append svg and group
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Create chartGroup that contain the data, shift chart by margins using transform/translate
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(censusdata){ 
    console.log("init reading csv file");
    // Log an error if one exists
    // if (error) return console.warn(error);

    // Print censusdata
    console.log(censusdata);

    // // Loop through the data
    // for (var i = 0; i < censusdata.length; i++){
    //     console.log(i, censusdata[i].state, censusdata[i].poverty, censusdata[i].healthcare);
    //     console.log(i, censusdata[i].obesity,censusdata[i].income);
    // }

    // Loop through data and pass argument data/transform data to numbers
    censusdata.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    console.log()

    // Create scalars 
    // Linear scale to display min in axis, and max in data
    
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusdata, d => d.poverty) * 0.8, 
    d3.max(censusdata, d => d.poverty) * 1.2])
    .range([0,width]);   

    // console.log(xLinearScale) 
        
    var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(censusdata, d => d.healthcare) * 1])
    .range([height, 0])
    // console.log(yLinearScale)

    // // Create scale functions. scale y to chart height.
    // var yLinearScale = d3.scaleLinear().range([height, 0]);
    // // scale x to chart width.
    // var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axes
    var xAxis = d3.axisBottom(xLinearScale)
    // Tick marks on the x-axis
    .ticks(7);
    var yAxis = d3.axisLeft(yLinearScale);

    // Append axes to chartGroup
    // x-axis moves with height
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
    .call(yAxis);

    // Create and append circles for scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusdata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "13")
      .attr("fill", "#788dc2")
      .attr("opacity", "0.75");
    
    // Append text to circles in plot
    // var circlesGroup = chartGroup.selectAll("circle")
    //     .data(censusdata)
    //     .enter()
    //     .append("text")
    //     .attr("x", d => xLinearScale(d.poverty))
    //     .attr("y", d => yLinearScale(d.healthcare))
    //     .style("font-size","12px")
    //     .style("text-anchor","middle")
    //     .style("fill", "white")
    //     // .text(d => (d.abbr));

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    //Add text inside circle
    chartGroup.selectAll(".dot")
      .data(censusdata)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.poverty);
      })
      .attr('y', function(data) {
        return yLinearScale(data.healthcare);
        })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
      
      
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    
// .catch(function(error){
//   console.log(error);
//   )
// } 


//end bracket for reading data   
});