function _1(md){return(
md`# HW2 Strong Baseline`
)}

function _constellations(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _5(yCounts,data)
{
  yCounts.length = 0; //將yCounts清空
  for (var y=0; y<=11; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts.push({Constellation:y, gender:"male", count:0}); 
    //Object包含：1. 星座，2.男性，3.人數(設為0)
    yCounts.push({Constellation:y, gender:"female", count:0}); 
    //Object包含：1. 星座，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個星座的人
  })
  return yCounts
}


function _plot2(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _7(Plot,plot2,d3,constellations,yCounts){return(
Plot.plot({
  marginTop: plot2.mt,
  marginRight: plot2.mr,
  marginBottom: plot2.mb,
  marginLeft: plot2.ml,
  
  grid: true,
  y: {label: "count"},
  x: { 
    type: "band", 
    domain: d3.range(0,12), 
    tickFormat: (i) => constellations[i],
    label: "Constellation" 
  },
  color: {
    type: "ordinal",
    domain: ["male", "female"], 
    range: ["#0000BB", "orange"] 
  },
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {
      x: "Constellation",
      y: "count",
      fill: "gender",
      tip: true
    }),
  ]
})
)}

function _8(d3,data)
{
  const bins = d3.bin();
  const value = "Constellation";
  var minValue = 0; // 星座的最小值
  var maxValue = 11; // 星座的最大值

  const binnedData = bins
    .value(d => d[value]) // 設置數值變量
    .domain([minValue, maxValue + 1]) // 設置數值範圍，+1 以包含最大值
    .thresholds(d3.range(minValue, maxValue + 1))(data); // 設置bins

  // 返回處理後的binnedData供後續使用
  return binnedData;
}


function _constellationCounts(d3,data){return(
d3.rollups(data, 
  group => ({
    male: group.filter(record => record.Gender === '男').length,
    female: group.filter(record => record.Gender === '女').length
  }), 
  record => record.Constellation)
)}

function _formattedData(constellationCounts){return(
constellationCounts.flatMap(([constellation, counts]) => [
  { Constellation: constellation, Gender: '男', Count: counts.male },
  { Constellation: constellation, Gender: '女', Count: counts.female }
])
)}

function _11(Plot,plot2,constellations,formattedData){return(
Plot.plot({
  marginTop: plot2.mt,
  marginRight: plot2.mr,
  marginBottom: plot2.mb,
  marginLeft: plot2.ml,
  x: {
    type: "band",
    domain: constellations, // 使用星座名稱
    label: "Constellation"
  },
  y: {
    label: "Count"
  },
  color: {
    type: "ordinal",
    domain: ["男", "女"], 
    range: ["#0000BB", "orange"] // 男生用藍色，女生用粉色
  },
  marks: [
    Plot.barY(formattedData, {
      x: record => constellations[record.Constellation],
      y: record => record.Count,
      fill: record => record.Gender,
      offset: record => record.Offset // 使用 Offset 來分組
    }),
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("constellations")).define("constellations", _constellations);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer()).define(["yCounts","data"], _5);
  main.variable(observer("viewof plot2")).define("viewof plot2", ["Inputs"], _plot2);
  main.variable(observer("plot2")).define("plot2", ["Generators", "viewof plot2"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot2","d3","constellations","yCounts"], _7);
  main.variable(observer()).define(["d3","data"], _8);
  main.variable(observer("constellationCounts")).define("constellationCounts", ["d3","data"], _constellationCounts);
  main.variable(observer("formattedData")).define("formattedData", ["constellationCounts"], _formattedData);
  main.variable(observer()).define(["Plot","plot2","constellations","formattedData"], _11);
  return main;
}
