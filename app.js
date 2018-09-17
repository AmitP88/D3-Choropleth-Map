const getData = () => {
    d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json", (error, dataset) => {
        if(error) console.log(error);
        console.log(dataset);
    });
};