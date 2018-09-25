const getData = () => {
    // Store county and education json datasets in their own respective variables
    const countiesData = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
    const educationData = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

    /* Color codes for different education levels - colors from http://www.december.com/html/spec/colorcodes.html */
    const sign_blue = "#003F87";
    const denim = "#4372AA";
    const blue_sponge = "#5D92B1";
    const light_blue = "#ADD8E6";
    const lightcyan = "#E0FFFF";
    const light_skyblue = "#99FBFF";
    const skyblue = "#4DF8FF";
    const dark_skyblue = "#00E5EE";

    // Define width and height dimensions for SVG element
    const width = 1000;
    const height = 600;
    
    // Create SVG element and append to container element. Pass in width and height variables as attributes
    const svg = d3.select(".container")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
    
    // Creates a new geographic path generator with the default settings: the albersUsa projection and a point radius of 4.5 pixels.
    const path = d3.geoPath();

    // Create tooltip
    const tooltip = d3.select(".container")
                  .append("div")
                  .attr("id", "tooltip");
        
    // function that is called once the json data from countiesData is retrieved in the queue
    const ready = (error, topo, education) => {
      states = topojson.feature(topo, topo.objects.states).features;
      counties = topojson.feature(topo, topo.objects.counties).features;
      console.log(states);

      if (error) {
        console.log(error);
      }

      // add counties from topojson
      svg.append("g")
         .selectAll("path")
         .data(counties)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("class", "county")
         .style('shape-rendering','geometricPrecision')
         .style("stroke", "#708090")
         .attr("data-fips", (d) => d.id)
         .attr("data-education", (d) => {
           // function that compares county id's with education county fip properties and filters any data that does not have matching pairs
           const county = education.filter(f => {
             if (f.fips === d.id) return f.bachelorsOrHigher;
           })
           return county[0].bachelorsOrHigher;
         })
         .style("fill", (d) => {
           const edu = education.filter(f => {
             if (f.fips === d.id) {
               return f.bachelorsOrHigher;
             }
           })
           // colors each county area based on what value bach is
           const bach = edu[0].bachelorsOrHigher;
           if (bach <= 3) {
             return sign_blue;
           } else if (bach >= 4 && bach <= 12) {
             return denim;
           } else if (bach >= 13 && bach <= 21) {
             return blue_sponge;
           } else if (bach >= 22 && bach <= 30) {
             return light_blue;
           } else if (bach >= 31 && bach <= 39) {
             return lightcyan;
           } else if (bach >= 40 && bach <= 48) {
             return light_skyblue;
           } else if (bach >= 49 && bach <= 57) {
             return skyblue;
           } else {
             return dark_skyblue;
           }
         })
         // Shows tooltip when user hovers over a county
         .on("mouseover", (d) => {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html( () => {
                   const county = education.filter(f => {
                     if (f.fips === d.id) return f;
                   })
                   return "<span class='tooltipSpan'>County: " + county[0].area_name + "</span>" + "<br>" +
                          "<span class='tooltipSpan'>State: " + county[0].state + "</span>" + "<br>" +
                          "<span class='tooltipSpan'>Bachelor or higher: " + county[0].bachelorsOrHigher + "%" + "</span>";
                 })
                 .attr("data-education", () => {
                   const county = education.filter(f => {
                     if (f.fips === d.id) return f.bachelorsOrHigher;
                   })
                   return county[0].bachelorsOrHigher;
                 })
                 .style("left", d3.event.pageX + "px")
                 .style("top", (d3.event.pageY - 65) + "px")
                 .attr("id", "tooltip")
          })
          .on("mouseout", (e) => {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });

      // put boarder around states 
      svg.append("path")
        .datum(topojson.mesh(topo, topo.objects.states, (a, b) => a !== b))
        .attr("class", "mesh")
        .attr("d", path)
        .attr("fill", "none")
        .style("stroke", "darkred");

        /* =============== LEGEND =============== */


        
        /* background bar */
        const legend = svg.append("g")
           .attr("x", 500)
           .attr("y", 100)
           .attr("height", 10 + "px")
           .attr("width", 440 + "px")
           .attr("fill", "green")
           .attr("id", "legend");

        /* 0 - 3% blue bar */
        legend.append("rect")
           .attr("x", 500)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", sign_blue)
           .attr("class", "border");
        
        /* 3% - 12% blue bar */
        legend.append("rect")
           .attr("x", 540)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", denim)
           .attr("class", "border");    

        /* 12% - 21% blue bar */
        legend.append("rect")
           .attr("x", 580)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", blue_sponge)
           .attr("class", "border");  

        /* 21% - 30% blue bar */
        legend.append("rect")
           .attr("x", 620)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", light_blue)
           .attr("class", "border");

        /* 30% - 39% blue bar */
        legend.append("rect")
           .attr("x", 660)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", lightcyan)
           .attr("class", "border");

        /* 39% - 48% blue bar */
        legend.append("rect")
           .attr("x", 700)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", light_skyblue)
           .attr("class", "border"); 

        /* 48% - 57% blue bar */
        legend.append("rect")
           .attr("x", 740)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", skyblue)
           .attr("class", "border"); 

        /* 57% - 66% blue bar */
        legend.append("rect")
           .attr("x", 780)
           .attr("y", 10)
           .attr("height", 10 + "px")
           .attr("width", 40 + "px")
           .attr("fill", dark_skyblue)
           .attr("class", "border");



        const legend_points = [3, 12, 21, 30, 39, 48, 57, 66];

        /* Scale for legend */
        let legend_min = d3.min(legend_points, (p) => p);
        let legend_max = d3.max(legend_points, (p) => p);
        console.log(legend_min, legend_max);
        const legendScale = d3.scaleLinear()
                            .domain([legend_min, legend_max])
                            .range([1, 502]);

        /* Axis for legend */
        const legendAxis = d3.axisBottom(legendScale).tickSizeOuter([0]);
        legend.append("g")
           .attr("transform", "translate(523, 20)")
           .call(legendAxis);

        
    }

    // d3-queue, a tiny library for running asynchronous tasks with configurable concurrency. Here external JSON files are loaded concurrently using d3-request, and then a ready function renders the sum of their contents:
    d3.queue()
    .defer(d3.json, countiesData)
    .defer(d3.json, educationData)
    .await(ready);











};