const getData = () => {
    // Store county geoJSON data in countiesUrl variable
    const countiesUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

    // Define width and height dimensions for SVG element
    const width = 1000;
    const height = 650;
    
    // Create SVG element and append to container element. Pass in width and height variables as attributes
    const svg = d3.select(".container")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
    
    // Creates a new geographic path generator with the default settings: the albersUsa projection and a point radius of 4.5 pixels.
    const path = d3.geoPath();
    

    
    // function that is called once the json data from countiesUrl is retrieved in the queue
    const ready = (error, counties, education) => {
      if (error) console.log(error);

      // creates and appends g element within svg element. Draws the map using path and datapoints ("d") from json data 
      svg.append("g")
         .selectAll("path")
         .data(topojson.feature(counties, counties.objects.counties).features)
         .enter()
         .append("path")
         .attr("d", path)
    }

    // d3-queue, a tiny library for running asynchronous tasks with configurable concurrency. Here external JSON files are loaded concurrently using d3-request, and then a ready function renders the sum of their contents:
    d3.queue()
    .defer(d3.json, countiesUrl)
    .await(ready);

};