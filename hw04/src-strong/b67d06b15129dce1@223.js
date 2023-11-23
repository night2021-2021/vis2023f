function _1(md){return(
md`# HW04-strong`
)}

function _artist(FileAttachment){return(
FileAttachment("./artist@1.csv").csv()
)}

function _3(__query,artist,invalidation){return(
__query(artist,{from:{table:"artist"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"artist")
)}

function _innerCircleQuestion(artist){return(
Object.keys(artist[0])[2]
)}

function _outerCircleQuestion(artist){return(
Object.keys(artist[0])[4]
)}

function _data(artist,innerCircleQuestion,outerCircleQuestion,buildHierarchy)
{
  // 提取內外圈問題的答案
  var innerCircleAnswer = artist.map(row => row[innerCircleQuestion]);
  var outerCircleAnswer = artist.map(row => row[outerCircleQuestion]);

  // 將內外圈答案結合，形成新的答案陣列
  var combinedAnswers = innerCircleAnswer.map((innerAns, index) => innerAns + '-' + outerCircleAnswer[index]);

  // 重新格式化答案，將其轉換為符合特定模式的陣列
  var reformattedAnswers = combinedAnswers.map(item => {
    const [prefix, values] = item.split('-');
    const splitValues = values.split(';').map(value => value.trim());
    return splitValues.map(value => `${prefix}-${value}`);
  }).reduce((acc, curr) => acc.concat(curr), []);

  // 計算每個重新格式化答案的出現次數
  var answerCounts = {};
  reformattedAnswers.forEach(reformattedAns => {
    answerCounts[reformattedAns] = (answerCounts[reformattedAns] || 0) + 1;
  });

  // 轉換為CSV格式的數據
  var csvData = Object.entries(answerCounts).map(([answer, count]) => [answer, String(count)]);
  
  // 建立包含層次結構的數據
  return buildHierarchy(csvData);
}


function _breadcrumb(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style("font", "12px sans-serif")
    .style("margin", "5px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

    g.append("polygon")
      .attr("points", breadcrumbPoints)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white");

    g.append("text")
      .attr("x", (breadcrumbWidth + 10) / 2)
      .attr("y", 15)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => {
        if(d.data.name === "減少包裝材及文宣印製") {
          return "減少包裝";
        }
        else if(d.data.name === "使用無毒媒材、再生材料、廢物利用素材等") {
          return "使用再生材料";
        }
        else if(d.data.name === "工作場所、活動展場的節約能源") {
          return "節約能源";
        }
        else if(d.data.name.length > 6)
        {
          return "其他答案";
        }
        return d.data.name;
      });

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle");

  return svg.node();
}


function _sunburst(partition,data,d3,radius,innerCircleQuestion,outerCircleQuestion,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  // 使用foreignObject插入HTML
  const fo = svg
    .append("foreignObject")
    .attr("x", `${radius+50}px`)
    .attr("y", -10)
    .attr("width", radius*2)
    .attr("height", 350);
  
  const div = fo
    .append("xhtml:div")
    .style("color","#555")
    .style("font-size", "25px")
    .style("font-family", "Arial");

  d3.selectAll("div.tooltip").remove(); // clear tooltips from before
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", `tooltip`)
    .style("position", "absolute")
    .style("opacity", 0)

  const label = svg
    .append("text")
    .attr("text-anchor", "middle");
    //.style("visibility", "hidden");

  label//內圈問題
    .append("tspan")
    .attr("class", "question1")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-6em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(innerCircleQuestion);

  label//外圈問題
    .append("tspan")
    .attr("class", "question2")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-4em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(outerCircleQuestion);

  label//答案
    .append("tspan")
    .attr("class", "sequence")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-1em")
    .attr("font-size", "2.5em")
    .text("");

  label//占比%數
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "0em")
    .attr("font-size", "5em")
    .attr("fill", "#555")
    .text("");

  label//數量
    .append("tspan")
    .attr("class", "dataValue")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "2em")
    .attr("font-size", "2em")
    .attr("fill", "#555")
    .text("");

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width*2.2} ${width}`)
    .style("max-width", `${width*2}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("fill-opacity", 1);
      //tooltip.text("");
      //label.style("visibility", null);
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseover", (_evt, d) => {
      if(d.data.name === "北部") {
        tooltip
        .style("opacity", 1)
        .html(`北部<br><svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M474 432h50v158h-50zM474 804h50v100h-50z" fill="#C4CDD1"></path><path d="M512.2 812.8c-63.3 0-114.6-51.3-114.6-114.6s51.3-114.6 114.6-114.6 114.6 51.3 114.6 114.6-51.3 114.6-114.6 114.6z m0-16c54.5 0 98.6-44.1 98.6-98.6 0-54.5-44.1-98.6-98.6-98.6s-98.6 44.1-98.6 98.6c0 54.4 44.1 98.6 98.6 98.6z" fill=""></path><path d="M512.7 348.7m-60.7 0a60.7 60.7 0 1 0 121.4 0 60.7 60.7 0 1 0-121.4 0Z" fill="#FFC200"></path><path d="M512.7 697.8m-82 0a82 82 0 1 0 164 0 82 82 0 1 0-164 0Z" fill="#FF684C"></path><path d="M407.8 709.8c-4.4 0-8-3.6-8-8s3.6-8 8-8h133.7c4.4 0 8 3.6 8 8s-3.6 8-8 8H407.8z m165.3 0c-4.4 0-8-3.6-8-8s3.6-8 8-8h4.9c4.4 0 8 3.6 8 8s-3.6 8-8 8h-4.9zM428.1 358.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h99.1c4.4 0 8 3.6 8 8s-3.6 8-8 8H428.1zM476 474.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h42c4.4 0 8 3.6 8 8s-3.6 8-8 8h-42zM476 518.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h42c4.4 0 8 3.6 8 8s-3.6 8-8 8h-42zM476 562.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h42c4.4 0 8 3.6 8 8s-3.6 8-8 8h-42zM476 848.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h42c4.4 0 8 3.6 8 8s-3.6 8-8 8h-42zM476 890.6c-4.4 0-8-3.6-8-8s3.6-8 8-8h42c4.4 0 8 3.6 8 8s-3.6 8-8 8h-42z" fill=""></path><path d="M465.089 433.222c0-4.4 3.6-8 8-8s8 3.6 8 8v158.5c0 4.4-3.6 8-8 8s-8-3.6-8-8v-158.5zM465.089 827.122c0-4.4 3.6-8 8-8s8 3.6 8 8v74.9c0 4.4-3.6 8-8 8s-8-3.6-8-8v-74.9zM538.989 433.222c0-4.4 3.6-8 8-8s8 3.6 8 8v130.8c0 4.4-3.6 8-8 8s-8-3.6-8-8v-130.8zM538.989 800.522c0-4.4 3.6-8 8-8s8 3.6 8 8v101.5c0 4.4-3.6 8-8 8s-8-3.6-8-8v-101.5z" fill=""></path><path d="M561.3 268.2c3.8 2.3 4.9 7.3 2.6 11-2.3 3.8-7.3 4.9-11 2.6-12.1-7.5-26.1-11.6-40.8-11.6-42.8 0-77.5 34.7-77.5 77.5s34.7 77.5 77.5 77.5 77.5-34.7 77.5-77.5c0-18.5-6.5-36-18.2-49.9-2.8-3.4-2.4-8.4 1-11.3 3.4-2.8 8.4-2.4 11.3 1 14.1 16.7 21.9 37.8 21.9 60.2 0 51.6-41.9 93.5-93.5 93.5s-93.5-41.9-93.5-93.5 41.9-93.5 93.5-93.5c17.7 0 34.6 4.9 49.2 14z" fill=""></path><path d="M503.2 122c0-4.4 3.6-8 8-8s8 3.6 8 8v138.7c0 4.4-3.6 8-8 8s-8-3.6-8-8V122z" fill=""></path><path d="M432.2 777.756c2.1-3.9 6.9-5.4 10.8-3.3s5.4 6.9 3.3 10.8l-63.2 119c-2.1 3.9-6.9 5.4-10.8 3.3-3.9-2.1-5.4-6.9-3.3-10.8l63.2-119zM590 777.756c-2.1-3.9-6.9-5.4-10.8-3.3-3.9 2.1-5.4 6.9-3.3 10.8l63.3 118.9c2.1 3.9 6.9 5.4 10.8 3.3 3.9-2.1 5.4-6.9 3.3-10.8l-63.3-118.9z" fill=""></path><path d="M510 206m-26 0a26 26 0 1 0 52 0 26 26 0 1 0-52 0Z" fill=""></path><path d="M312 914c-4.4 0-8-3.6-8-8s3.6-8 8-8h400c4.4 0 8 3.6 8 8s-3.6 8-8 8H312z" fill=""></path></g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "東部") {
        tooltip
        .style("opacity", 1)
        .html(`東部<br><svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M411.9 290.2h200v42.1h-200z" fill="#FFC200"></path><path d="M249.8 776.8c-4.4 0-8-3.6-8-8s3.6-8 8-8h238.5c4.4 0 8 3.6 8 8s-3.6 8-8 8H249.8zM390.9 296.4c-4.4 0-8-3.6-8-8s3.6-8 8-8h238.5c4.4 0 8 3.6 8 8s-3.6 8-8 8H390.9zM607.7 789.4c-4.4 0-8-3.6-8-8s3.6-8 8-8h153.9c4.4 0 8 3.6 8 8s-3.6 8-8 8H607.7zM469.8 821c-4.4 0-8-3.6-8-8s3.6-8 8-8H537c4.4 0 8 3.6 8 8s-3.6 8-8 8h-67.2z" fill=""></path><path d="M410.626 290.016c1.3-4.2 5.7-6.6 10-5.3 4.2 1.3 6.6 5.7 5.3 10-59.8 197.4-145.5 343.2-257.2 437.4-3.4 2.8-8.4 2.4-11.3-1-2.8-3.4-2.4-8.4 1-11.3 109-91.9 193.2-235.1 252.2-429.8zM611.126 289.716c-1.4-4.2-6-6.4-10.1-5s-6.4 6-5 10.1c23.8 70.3 43.4 123.3 59 159.3 2.4 5.6 4.8 10.9 7 15.7 1.9 4 6.6 5.7 10.6 3.9s5.7-6.6 3.9-10.6c-2.2-4.7-4.5-9.8-6.8-15.3-15.5-35.5-35-88.2-58.6-158.1z m180.8 358.4c-2.9-3.4-7.9-3.8-11.3-1-3.4 2.9-3.8 7.9-1 11.3 23.1 27.3 47.5 51.9 73.4 73.7 3.4 2.8 8.4 2.4 11.3-1 2.8-3.4 2.4-8.4-1-11.3-25.1-21.1-48.9-45-71.4-71.7z" fill=""></path><path d="M113 739.016c-4.4 0-8-3.6-8-8s3.6-8 8-8h797.8c4.4 0 8 3.6 8 8s-3.6 8-8 8H113zM426.2 423.9c-3.2 3.7-8.9 3.7-12.1 0l-27.8-32.1c-2.9-3.3-2.5-8.4 0.8-11.3 3.3-2.9 8.4-2.5 11.3 0.8l21.8 25.1 21.8-25.1c3.1-3.6 8.5-3.7 11.8-0.3l24.7 25.6 20.3-25.1c3.1-3.8 8.7-4 12.1-0.4l27.8 29.6h56.2c4.4 0 8 3.6 8 8s-3.6 8-8 8H535c-2.2 0-4.3-0.9-5.8-2.5l-23.9-25.4-20.2 25c-3 3.7-8.6 4-12 0.5l-24.9-25.8-22 25.4z" fill=""></path><path d="M226.9 705.3c80.1-92.2 135.4-185.7 166-280.4 0 0 8.1 7.5 24.4 22.4l31.2-22.4 31.4 22.4 26.9-22.4 30.3 22.4 93.1-0.6C691.5 578.3 746.4 663.8 795 703.2c5.6 1.4-183.7 2.1-568.1 2.1z" fill="#FF684C"></path><path d="M415.2 530.9c2.2-3.8 7.1-5.2 10.9-3s5.2 7.1 3 10.9c-1.8 3.2-3.6 6.3-5.3 9.3-2.2 3.8-7.1 5.1-10.9 2.9-3.8-2.2-5.1-7.1-2.9-10.9 1.6-2.9 3.4-6 5.2-9.2z m-17.9 30.6c2.3-3.8 7.2-5 11-2.7s5 7.2 2.7 11c-0.8 1.4-1.7 2.8-2.8 4.6-1.4 2.3-2.1 3.5-2.7 4.5-2.2 3.7-3.8 6.3-5.4 8.9-4 6.6-7.4 12.1-10.6 17.2-9.2 14.7-17.3 26.8-25.8 38.5-8.9 12.3-18.2 23.9-28.6 35.6-2.9 3.3-8 3.6-11.3 0.7s-3.6-8-0.7-11.3c10-11.3 19-22.6 27.7-34.4 8.2-11.3 16.1-23.1 25.1-37.6 3.2-5.1 6.5-10.4 10.5-17 1.6-2.6 3.2-5.2 5.4-8.9 0.6-1 1.4-2.3 2.7-4.5 1.1-1.8 1.9-3.2 2.8-4.6z" fill=""></path><path d="M670.775 628.11h85.9c26.7 0 47.6-18.4 47.6-41.9 0-21.7-20-40.2-43.8-41.8-2-8.4-5.8-16.2-11.2-23.1-13-16.3-34.5-27.1-59.3-27.1-27.7 0-51.5 13.4-62.9 33.5-29.5 3.3-51.4 24.2-51.4 50.2 0 27.6 25.7 50.2 57.1 50.2" fill="#FFFFFF"></path><path d="M812.175 586.21c0 28.1-24.7 49.9-55.6 49.9h-85.8c-4.4 0-8-3.6-8-8s3.6-8 8-8h85.9c22.5 0 39.6-15.1 39.6-33.9 0-17.1-16.3-32.4-36.4-33.9l-5.9-0.4-1.3-5.7c-1.7-7.1-5-13.9-9.7-19.9-11.9-14.9-31.4-24.1-53-24.1-24.4 0-45.8 11.6-55.9 29.4l-2 3.5-4 0.5c-26 3-44.4 20.8-44.4 42.3 0 22.9 21.9 42.2 49.1 42.2 4.4 0 8 3.6 8 8s-3.6 8-8 8c-35.6 0-65.1-25.9-65.1-58.2 0-28.9 23-52.4 54.6-57.6 13.7-21.1 39.3-34.1 67.7-34.1 26.5 0 50.7 11.4 65.5 30.2 5 6.3 8.8 13.3 11.2 20.7 25.4 4.3 45.5 25 45.5 49.1z" fill=""></path></g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "中部") {
        tooltip
        .style("opacity", 1)
        .html(`中部<br><svg version="1.1" id="svg3290" inkscape:version="0.44" sodipodi:docbase="/home/bruno/arte/imagens/icons/aiga/aigalike" sodipodi:docname="Crime.svg" sodipodi:version="0.32" xmlns:cc="http://web.resource.org/cc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" xml:space="preserve" width="64px" height="64px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <sodipodi:namedview bordercolor="#666666" borderopacity="1.0" height="800px" id="base" inkscape:current-layer="svg3290" inkscape:cx="475.29675" inkscape:cy="157.8571" inkscape:guide-bbox="true" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:window-height="933" inkscape:window-width="800px"> </sodipodi:namedview> <g> <path d="M223.4,58.6h-32c-7.6,0-13.1,3-17.7,9.6l-16.2,23.6h-14.8v-3.1h4v-9h-34.3h-5.8v4.5h5.8v4.5h22.4v3.1h-5.4 c-11.3,0-10.6,16-0.2,16h5.6v3.6h7.9v-3.6h18.8c2.5,0,5.6-0.9,7.4-3.6l12.3-17.6l0.1,137.2c0,13.7,20.2,13.6,20.2-0.3l0-82l3.9,0 l0,82c0,13.9,20.4,14.3,20.4,0.4L226,86h3.5v49.2c0,11.8,16,11.8,16,0.2V81.6C245.6,67.2,234.8,58.6,223.4,58.6z"></path> <circle cx="206" cy="37.4" r="17"></circle> <circle cx="63.7" cy="57.1" r="16"></circle> <path d="M115.9,55.9L93.3,33.2c-2.8-2.8-7.2-2.8-9.8,0c-2.8,2.8-2.8,7.2,0,9.8l17.6,17.6L88.3,73.5c-2.4,2.4-5.4,3.6-8.4,3.6H47.4 c-3,0-6.2-1.2-8.4-3.6L26.2,60.7L43.8,43c2.8-2.8,2.8-7.2,0-9.8c-2.8-2.8-7.2-2.8-9.8,0L11.4,55.9c-2.8,2.8-2.8,7.2,0,9.8 l30.2,30.2v127.4c0,5.6,4.4,10,10,10s10-4.4,10-10v-70.1c0-1.2,0.8-2,2-2c1.2,0,2,0.8,2,2v70.1c0,5.6,4.4,10,10,10 c5.6,0,10-4.4,10-10V95.9l30.2-30.2C118.5,63.1,118.5,58.7,115.9,55.9z"></path> </g> </g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "南部"){
        tooltip
        .style("opacity", 1)
        .html(`南部<br><svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M208.9 329.4h325.7v415.7H208.9z" fill="#FFC200"></path><path d="M193.649 761.2h41.9c4.4 0 8 3.6 8 8s-3.6 8-8 8h-49.9c-4.4 0-8-3.6-8-8V253c0-4.4 3.6-8 8-8h53.5c4.4 0 8 3.6 8 8v45.3h37.4V253c0-4.4 3.6-8 8-8h52.2c4.4 0 8 3.6 8 8v45.3h37.4V253c0-4.4 3.6-8 8-8h54.1c4.4 0 8 3.6 8 8v45.3h36.6V253c0-4.4 3.6-8 8-8h52.6c4.4 0 8 3.6 8 8v81.7c0 4.4-3.6 8-8 8s-8-3.6-8-8V261h-36.6v45.3c0 4.4-3.6 8-8 8h-52.6c-4.4 0-8-3.6-8-8V261h-38.1v45.3c0 4.4-3.6 8-8 8h-53.4c-4.4 0-8-3.6-8-8V261h-36.2v45.3c0 4.4-3.6 8-8 8h-53.4c-4.4 0-8-3.6-8-8V261h-37.5v500.2z m355.7-387.3c0-4.4 3.6-8 8-8s8 3.6 8 8v395.3c0 4.4-3.6 8-8 8h-272.5c-4.4 0-8-3.6-8-8s3.6-8 8-8h264.5V373.9z" fill=""></path><path d="M262.049 562.5c-4.4 0-8-3.6-8-8s3.6-8 8-8h5.7c4.4 0 8 3.6 8 8s-3.6 8-8 8h-5.7z m39.3 0c-4.4 0-8-3.6-8-8s3.6-8 8-8h250.2c4.4 0 8 3.6 8 8s-3.6 8-8 8h-250.2z" fill=""></path><path d="M477.149 560.7c0-4.4 3.6-8 8-8s8 3.6 8 8v44.7c0 4.4-3.6 8-8 8s-8-3.6-8-8v-44.7zM390.449 560.7c0-4.4 3.6-8 8-8s8 3.6 8 8v31c0 4.4-3.6 8-8 8s-8-3.6-8-8v-31z" fill=""></path><path d="M439.649 625.1c-4.4 0-8-3.6-8-8s3.6-8 8-8h117.7c4.4 0 8 3.6 8 8s-3.6 8-8 8h-117.7zM189.649 685.1c-4.4 0-8-3.6-8-8s3.6-8 8-8h51.4c4.4 0 8 3.6 8 8s-3.6 8-8 8h-51.4zM319.649 761h-16v-71.2c0-36.9 29.8-66.8 66.5-66.8s66.5 29.9 66.5 66.8V761h-16v-71.2c0-28.1-22.6-50.8-50.5-50.8s-50.5 22.6-50.5 50.7V761z" fill=""></path><path d="M338.449 760.8v-66.9c0-17.6 14.2-31.8 31.7-31.8s31.7 14.2 31.7 31.8v66.9" fill="#FF684C"></path><path d="M447.849 502.2v-41.5c0-18.9 15.3-26 34.1-26s34.1 7.1 34.1 26v41.5h-68.2zM229.049 502.2v-41.5c0-18.9 15.3-26 34.1-26s34.1 7.1 34.1 26v41.5h-68.2zM338.449 502.2v-41.5c0-18.9 15.3-26 34.1-26s34.1 7.1 34.1 26v41.5h-68.2z" fill="#FFFFFF"></path><path d="M508.049 494.2v-33.5c0-12.1-8.8-18-26.1-18s-26.1 5.9-26.1 18v33.5h52.2z m-68.2 8v-41.5c0-22.6 17-34 42.1-34s42.1 11.4 42.1 34v41.5c0 4.4-3.6 8-8 8h-68.1c-4.5 0-8.1-3.6-8.1-8zM289.149 494.2v-33.5c0-12.1-8.8-18-26.1-18s-26.1 5.9-26.1 18v33.5h52.2z m-68.1 8v-41.5c0-22.6 17-34 42.1-34s42.1 11.4 42.1 34v41.5c0 4.4-3.6 8-8 8h-68.2c-4.5 0-8-3.6-8-8zM398.549 494.2v-33.5c0-12.1-8.8-18-26.1-18s-26.1 5.9-26.1 18v33.5h52.2z m-68.1 8v-41.5c0-22.6 17-34 42.1-34s42.1 11.4 42.1 34v41.5c0 4.4-3.6 8-8 8h-68.1c-4.5 0-8.1-3.6-8.1-8z" fill=""></path><path d="M630.004 489.739h-41.7c-4.4 0-8-3.6-8-8s3.6-8 8-8h49.7c4.4 0 8 3.6 8 8v41.6h33.6v-41.6c0-4.4 3.6-8 8-8h48.6c4.4 0 8 3.6 8 8v41.6h33.6v-41.6c0-4.4 3.6-8 8-8h50.3c4.4 0 8 3.6 8 8v287.5c0 4.4-3.6 8-8 8h-247.8c-4.4 0-8-3.6-8-8s3.6-8 8-8h239.8v-271.5h-34.3v41.6c0 4.4-3.6 8-8 8h-49.6c-4.4 0-8-3.6-8-8v-41.6h-32.6v41.6c0 4.4-3.6 8-8 8h-49.6c-4.4 0-8-3.6-8-8v-41.6z" fill=""></path><path d="M165 378.7c-4.4 0-8-3.6-8-8s3.6-8 8-8h413c4.4 0 8 3.6 8 8s-3.6 8-8 8H165z" fill=""></path><path d="M586.2 554.5h223v190.6h-223z" fill="#E0E7EA"></path><path d="M614.283 647.648c-4.4 0-8-3.6-8-8s3.6-8 8-8h218.1c4.4 0 8 3.6 8 8s-3.6 8-8 8h-218.1z" fill=""></path><path d="M659.183 609.548c0-4.4 3.6-8 8-8s8 3.6 8 8v21.1c0 4.4-3.6 8-8 8s-8-3.6-8-8v-21.1zM781.583 646.048c0-4.4 3.6-8 8-8s8 3.6 8 8v21.1c0 4.4-3.6 8-8 8s-8-3.6-8-8v-21.1zM695.683 641.748c0-4.4 3.6-8 8-8s8 3.6 8 8v63.4c0 4.4-3.6 8-8 8s-8-3.6-8-8v-63.4zM732.183 585.948c0-4.4 3.6-8 8-8s8 3.6 8 8v44.7c0 4.4-3.6 8-8 8s-8-3.6-8-8v-44.7z" fill=""></path><path d="M646.083 719.448c-4.4 0-8-3.6-8-8s3.6-8 8-8h183.8c4.4 0 8 3.6 8 8s-3.6 8-8 8h-183.8z" fill=""></path><path d="M764.7 585.4h44.7c2.8 0 5 2.2 5 5v28.7c0 2.8-2.2 5-5 5h-44.7c-2.8 0-5-2.2-5-5v-28.7c0-2.7 2.2-5 5-5zM618.1 655.7h61.2c2.8 0 5 2.2 5 5v28.7c0 2.8-2.2 5-5 5h-61.2c-2.8 0-5-2.2-5-5v-28.7c0-2.8 2.2-5 5-5z" fill="#A7B2B7"></path></g></svg>`)
      }
      else
      {
        tooltip
        .style("opacity", 1)
        .html(`${d.data.name}`)
        .style("border-color", color(d.data.name));
      }
    })
    .on("mousemove", (evt, d) => {
      tooltip
        .style("top", evt.pageY - 10 + "px")
        .style("left", evt.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .on("mouseenter", (event, d) => {
      // Get the ancestors of the current segment, minus the root

      //introduce
      if(d.data.name === "北部")
      {
        div
          .html("<ul><li>行政區:臺北市、新北市、基隆市、新竹市、桃園市、新竹縣及宜蘭縣</li><li>人口：11,618,859。</li><li>該地藝術展覽場所：台北當代藝術館、華山1914文化創意產業園區、松山文創園區、台北花卉博覽公園。</li></ul>");
      }
      else if(d.data.name === "中部")
      {
        div
          .html("<ul><li>行政區:臺中市、苗栗縣、彰化縣、南投縣及雲林縣。</li><li>人口：5,755,741。</li><li>該地藝術展覽場所：國立台灣美術館、台中市纖維工藝博物館。</li></ul>");
      }
      else if(d.data.name === "南部")
      {
        div
          .html("<ul><li>行政區:高雄市、臺南市、嘉義市、嘉義縣、屏東縣及澎湖縣。</li><li>人口：6,250,078。</li><li>該地藝術展覽場所：駁二藝術特區、高雄市立美術館。</li></ul>");
      }
      else if(d.data.name === "東部")
      {
        div
          .html("<ul><li>行政區:花蓮縣及臺東縣</li><li>人口：529,386。</li><li>該地藝術展覽場所：台東美術館。</li></ul>");
      }
      else if(d.data.name === "5")
      {
        div
          .html("<ul><li>5分</ul>");
      }
      else if(d.data.name === "4")
      {
        div
          .html("<ul><li>4分</ul>");
      }
      else if(d.data.name === "3")
      {
        div
          .html("<ul><li>3分</ul>");
      }
      else if(d.data.name === "2")
      {
        div
          .html("<ul><li>2分</ul>");
      }
      else if(d.data.name === "1")
      {
        div
          .html("<ul><li>1分</ul>");
      }
      else
      {
        div.html("");
      }
      
      //dataValue
      label
        .style("visibility", null)
        .select(".dataValue")
        .text("計數："+d.value);
      
      //question
      if(d.depth-1 === 0)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#000");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#BBB");
      }
      else if(d.depth-1 === 1)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#BBB");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#000");
      }
      
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path.attr("fill-opacity", node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );
      label
        .style("visibility", null)
        .select(".sequence")
        //.style("visibility", "visible")
        .attr("fill", sequence => color(d.data.name))
        .text(d.data.name);
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");

      /*tooltip
        .text(d.data.name);*/
      
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });     

  return element;
}


function _9(md){return(
md`<h2>結論</h2>
<h3>從上圖中，我們可以看出：
  <ul>
    <li>填寫此問卷的藝術工作者多數北部工作，其次為南部</li>
    <li>多數藝術工作者認為自己對於本議題僅有3分的認知程度，其次為4分</li>
    <li>僅北部區域有得分5分者，且中部工作者得分為2分的多於4分(但也只多1位填寫者)，位居該地域第二</li>
  </ul>
</h3>`
)}

function _10(md){return(
md`<h2>參數、函數</h2>`
)}

function _buildHierarchy(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)}

function _width(){return(
640
)}

function _radius(width){return(
width / 2
)}

function _partition(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)}

function _mousearc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)}

function _color(d3){return(
d3
  .scaleOrdinal()
  .domain(["北部", "中部", "南部", "東部", "5", "4", "3", "2", "1"])
  //.range(d3.schemePaired)
  .range(["#FFBA84","#DCB879","#EBB471","#D9CD90","#255359","#0089A7","#33A6B8","#81C7D4","#A5DEE4"])
  .unknown("#BEBEBE")
)}

function _arc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)}

function _breadcrumbWidth(){return(
105
)}

function _breadcrumbHeight(){return(
30
)}

function _breadcrumbPoints(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)}

function _21(htl){return(
htl.html`<style>
.tooltip {
  padding: 8px 12px;
  color: white;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2);
  pointer-events: none;
  transform: translate(-50%, -100%);
  font-family: "Helvetica", sans-serif;
  background: rgba(20,10,30,0.6);
  transition: 0.2s opacity ease-out, 0.1s border-color ease-out;
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artist@1.csv", {url: new URL("./artist.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer()).define(["__query","artist","invalidation"], _3);
  main.variable(observer("innerCircleQuestion")).define("innerCircleQuestion", ["artist"], _innerCircleQuestion);
  main.variable(observer("outerCircleQuestion")).define("outerCircleQuestion", ["artist"], _outerCircleQuestion);
  main.variable(observer("data")).define("data", ["artist","innerCircleQuestion","outerCircleQuestion","buildHierarchy"], _data);
  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], _breadcrumb);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","innerCircleQuestion","outerCircleQuestion","width","color","arc","mousearc"], _sunburst);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("buildHierarchy")).define("buildHierarchy", _buildHierarchy);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("partition")).define("partition", ["d3","radius"], _partition);
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], _mousearc);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("arc")).define("arc", ["d3","radius"], _arc);
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", _breadcrumbWidth);
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", _breadcrumbHeight);
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], _breadcrumbPoints);
  main.variable(observer()).define(["htl"], _21);
  return main;
}
