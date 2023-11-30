function _1(md){return(
md`# HW1 Strong Baseline **`
)}

function _students(__query,FileAttachment,invalidation){return(
__query(FileAttachment("students.csv"),{from:{table:"students"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _homework(){return(
["作業1", "作業2", "作業3", "作業4", "作業5", "作業6", "作業7", "作業8", "作業9", "作業10"]
)}

function _studentArray(){return(
[]
)}

function _studentList(studentArray,students,homework)
{
  studentArray.length = 0;
  students.forEach(row => {
    let Num = row["序號"]  //學生號碼
    for (let i = 0; i < 10; i++) {     //從第一項作業遍歷至第十項
      studentArray.push({    //遍歷數據抓取信息
        Num: Num,
        HW: i + 1,
        value: row[homework[i]]    //抓取成績
      });
    }
  });
  return studentArray
}


function _6(Plot,studentList,d3){return(
Plot.plot({
  marks: [
    Plot.cell(studentList, {
      x: d => d.Num, // 學生號碼
      y: d => d.HW, // 作業次數
      fill: d => d.value, // 作業成績
      title: d => `學號: ${d.Num}, 作業: ${d.HW}, 成績: ${d.value}` // 鼠標懸停時顯示的標題
    })
  ],
  x: {
    label: "學生號碼" // X軸標籤
  },
  y: {
    label: "作業次數" // Y軸標籤
  },
  color: {
    legend: true, // 顯示圖例
    label: "作業成績", // 圖例標籤
    scale: {
      type: "sequential",                           // 顏色比例尺的類型
      domain: d3.extent(studentList, d => d.value), // 成績的範圍
      interpolator: d3.interpolateRdBu              // 紅到藍的顏色插值器
    }
  },
  width: 1200, // 熱圖的寬度
  height: 200, // 熱圖的高度
  marginLeft: 30, // 左側邊距
  marginTop: 50 // 上側邊距
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["students.csv", {url: new URL("./files/d5c6bc57dac0d9ed45b8b1ace1dc7c97d18b65fc60f3faec592a868153398014b20190f8f5a51a30b5aef1b6ee839feed30b2e10d20f2ec1af09e26751757cd9.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("students")).define("students", ["__query","FileAttachment","invalidation"], _students);
  main.variable(observer("homework")).define("homework", _homework);
  main.variable(observer("studentArray")).define("studentArray", _studentArray);
  main.variable(observer("studentList")).define("studentList", ["studentArray","students","homework"], _studentList);
  main.variable(observer()).define(["Plot","studentList","d3"], _6);
  return main;
}
