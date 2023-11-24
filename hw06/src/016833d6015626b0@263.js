function _1(md){return(
md`#  作業六`
)}

function _artistver(__query,FileAttachment,invalidation){return(
__query(FileAttachment("artistVer (1) - artistVer (1).csv"),{from:{table:"artistVer (1) - artistVer (1)"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _artistpublic(__query,FileAttachment,invalidation){return(
__query(FileAttachment("artistPublic (1) - artistPublic (1).csv"),{from:{table:"artistPublic (1) - artistPublic (1)"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _artist_columnKey(artistver){return(
Object.keys(artistver[0])[3]
)}

function _artist_Column(artistver,artist_columnKey){return(
artistver.map(row => row[artist_columnKey])
)}

function _artistver_uniqueValues(artist_Column){return(
[...new Set(artist_Column)].sort()
)}

function _artist_counts(artistver_uniqueValues,artist_Column){return(
artistver_uniqueValues.map(val => ({
  value: val,
  count: artist_Column.filter(v => v === val).length
}))
)}

function _artistpublic_columnKey(artistpublic){return(
Object.keys(artistpublic[0])[4]
)}

function _artistpublic_Column(artistpublic,artistpublic_columnKey){return(
artistpublic.map(row => String(row[artistpublic_columnKey]))
)}

function _artistpublic_uniqueValues(artistpublic_Column){return(
[...new Set(artistpublic_Column)].sort()
)}

function _artistpublic_counts(artistpublic_uniqueValues,artistpublic_Column){return(
artistpublic_uniqueValues.map(val => ({
  value: val,
  count: artistpublic_Column.filter(v => v === String(val)).length
}))
)}

function _data(artist_counts,artistpublic_counts){return(
artist_counts.flatMap((item, index) => ([
  {
    value: item.value,
    count: item.count,
    series: 'artist'
  },
  {
    value: item.value,
    count: artistpublic_counts[index].count,
    series: 'artistpublic'
  }
]))
)}

function _selectedSeries(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _14(Plot,artist_columnKey,data,selectedSeries){return(
Plot.plot({
  height: 600,
  title: artist_columnKey,
  x: {
    label: 'Value',
    domain: data.map(d => d.value),
    padding: 0.1
  },
  y: {
    label: 'Count',
    grid: true
  },
  color: {
    domain: ['artist', 'artistpublic'],
    range: ['#66BAB7', '#FAD689'],
    legend: true
  },
  marks: [
    Plot.barY(data.filter(d => selectedSeries.includes(d.series)), Plot.stackY({ 
      x: "value",
      y: "count",
      fill: "series",
      title: d => `${d.series}\nvalue: ${d.value}\ncount: ${d.count}`
    }))
  ]
})
)}

function _selectedSeries1(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _chart(data,selectedSeries1,d3)
{
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const keys = Array.from(new Set(data.map(d => d.series)));
  
  const filteredData = data.filter(d => selectedSeries1.includes(d.series));

  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // Define scale X 
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // Define scale Y
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // Define scale color
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#66BAB7', '#FAD689']);

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)

          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]));
  });

  // Draw X
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Draw Y
  g.append("g")
    .call(d3.axisLeft(yScale));

  return svg.node();
}


function _chart1(data,selectedSeries1,d3)
{
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const keys = Array.from(new Set(data.map(d => d.series)));
  
  const filteredData = data.filter(d => selectedSeries1.includes(d.series));

  // Group the data we selcted above
  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // Define scale X
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // Define scale Y
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // Define scale color
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#66BAB7', '#FAD689']);

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Create an element g, to combine chart elements.
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Draw all bar
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .transition() 
          .duration(500) 
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]));
  });

  // Draw X
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Draw Y
  g.append("g")
    .call(d3.axisLeft(yScale));

  return svg.node();
}


function _chart2(data,selectedSeries1,d3)
{
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const keys = Array.from(new Set(data.map(d => d.series)));
  
  const filteredData = data.filter(d => selectedSeries1.includes(d.series));

  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // scale X
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // scale Y
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  //scale color
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#66BAB7', '#FAD689']);

  // create SVG elements
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
  // Add Shadow filter effect
  const defs = svg.append("defs");
  const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
  
  filter.append("feGaussianBlur") //use Gaussian filter
      .attr("in", "SourceAlpha")//let filter can only apply in Alpha(transparent)
      .attr("stdDeviation", 3) //Filter degree
      .attr("result", "blur"); //Filter output

  filter.append("feOffset") //Displacement of filter
      .attr("in", "blur") //let this filter effect can onlu apply in above filter
      .attr("dx", 3) //dx
      .attr("dy", 3) //dy
      .attr("result", "offsetBlur"); //Filter output

  const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
               .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
               .attr("in", "SourceGraphic"); 


  // Create an element g, to combine chart elements.
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Draw all bar
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]))
          .attr("filter", "url(#drop-shadow)") // add filter to make bars have shadow

        //change color of bar
          .on("mouseover", function(d) {
            let currentColor = d3.select(this).attr("fill"); // get bar color
            
            if (currentColor === '#66BAB7') {          // Change different color
              d3.select(this).attr("fill", "#81C7D4");
            } else if (currentColor === '#FAD689') {
              d3.select(this).attr("fill", "#FFE6A9");
            }
          })

          .on("mouseout", function(d) {
            d3.select(this).attr("fill", colorScale(serie.key)); // Color recover
          d3.select(".tooltip").remove();
        });
});

  // Draw X
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Draw Y
  g.append("g")
    .call(d3.axisLeft(yScale));
  
  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artistPublic (1) - artistPublic (1).csv", {url: new URL("./files/41a9c6bfdf8907c7f19b5a52517012d51d11afcdf769218a6b5c1af5288c865ca2bf10f0fdac5144f8d3676054b833c736642053e880c85ec6123fb15744ae7f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["artistVer (1) - artistVer (1).csv", {url: new URL("./files/363ea43eed3c6a6a6fed83d3e26ac23641da56f4f0689da720760208af84f1c3caff531322fc2ceeaf3924e4ff2f0ca4314a49adfe0e45701c6687fc36ee24d3.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artistver")).define("artistver", ["__query","FileAttachment","invalidation"], _artistver);
  main.variable(observer("artistpublic")).define("artistpublic", ["__query","FileAttachment","invalidation"], _artistpublic);
  main.variable(observer("artist_columnKey")).define("artist_columnKey", ["artistver"], _artist_columnKey);
  main.variable(observer("artist_Column")).define("artist_Column", ["artistver","artist_columnKey"], _artist_Column);
  main.variable(observer("artistver_uniqueValues")).define("artistver_uniqueValues", ["artist_Column"], _artistver_uniqueValues);
  main.variable(observer("artist_counts")).define("artist_counts", ["artistver_uniqueValues","artist_Column"], _artist_counts);
  main.variable(observer("artistpublic_columnKey")).define("artistpublic_columnKey", ["artistpublic"], _artistpublic_columnKey);
  main.variable(observer("artistpublic_Column")).define("artistpublic_Column", ["artistpublic","artistpublic_columnKey"], _artistpublic_Column);
  main.variable(observer("artistpublic_uniqueValues")).define("artistpublic_uniqueValues", ["artistpublic_Column"], _artistpublic_uniqueValues);
  main.variable(observer("artistpublic_counts")).define("artistpublic_counts", ["artistpublic_uniqueValues","artistpublic_Column"], _artistpublic_counts);
  main.variable(observer("data")).define("data", ["artist_counts","artistpublic_counts"], _data);
  main.variable(observer("viewof selectedSeries")).define("viewof selectedSeries", ["Inputs"], _selectedSeries);
  main.variable(observer("selectedSeries")).define("selectedSeries", ["Generators", "viewof selectedSeries"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","artist_columnKey","data","selectedSeries"], _14);
  main.variable(observer("viewof selectedSeries1")).define("viewof selectedSeries1", ["Inputs"], _selectedSeries1);
  main.variable(observer("selectedSeries1")).define("selectedSeries1", ["Generators", "viewof selectedSeries1"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","selectedSeries1","d3"], _chart);
  main.variable(observer("chart1")).define("chart1", ["data","selectedSeries1","d3"], _chart1);
  main.variable(observer("chart2")).define("chart2", ["data","selectedSeries1","d3"], _chart2);
  return main;
}
