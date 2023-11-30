let headers = ["序號", "班級", "學號", "姓名", "GitHub帳號", "作業1", "作業2", "作業3", "作業4", "作業5", "作業6", "作業7", "作業8", "作業9", "作業10"];

// 初始化data
let data = [headers];

let classNumber = 0;

// 填充data
for(let i = 1; i <= 120; i++){
    let studentData = [i.toString()]; // 序號
    for (let j = 1; j < headers.length; j++) {
        if(j == 1){
            studentData.push(CreateClass()); // 班級
        }else if(j == 2){
            studentData.push(CreateStudentNumber()); // 學號
        }else if(j == 3){
            studentData.push(CreateName()); // 姓名
        }else if(j == 4){
            studentData.push(CreateAccount()); // 帳號
        }else{
            studentData.push(CreateGrade().toString()); // 作業成績
        }
    }
    data.push(studentData);
}

// 班級
function CreateClass(){
    let CalssName = ["資工系", "資工所", "電資AI", "電資資安", "創新AI"];
    classNumber = Math.floor(Math.random() * 5);
    return CalssName[classNumber];
}   

//學號
function CreateStudentNumber(){
    let years = ["111","112"]
    let classID = ["590","598", "C52", "C53", "C71"]
    let numberRandom = Math.floor(Math.random() * 100);
    studentNumber = years[Math.floor(Math.random()*2)] + classID[classNumber] + numberRandom.toString();
    return studentNumber;
}

// 姓名
function CreateName() {
    function random(a, l){
        var x = [];
        x.push(a[Math.floor(Math.random() * a.length)]);
        while (l > 1) {
            x.push(a[Math.floor(Math.random() * a.length)]);
            l--;
        }
        return x.join("");
    }
    return random("李 王 張 劉 陳 楊 黃 趙 周 吳 徐 孫 朱 馬 胡 郭 林 何 高 梁 鄭 羅 宋 謝 唐 韓 曹 許 鄧 蕭 馮 曾 程 蔡 彭 潘 袁 於 董 餘 蘇 葉 呂 魏 蔣 田 杜 丁 沈 姜 范 江 傅 鐘 盧 汪 戴 崔 任 陸 廖 姚 方 金 邱 夏 譚 韋 賈 鄒 石 熊 孟 秦 閻 薛 侯 雷 白 龍 段 郝 孔 邵 史 毛 常 萬 顧 賴 武 康 賀 嚴 尹 錢 施 牛 洪 祁".split(" ")) + random("世 中 仁 伶 佩 佳 俊 信 倫 偉 傑 儀 元 冠 凱 君 哲 嘉 國 士 如 娟 婷 子 孟 宇 安 宏 宗 宜 家 建 弘 強 彥 彬 德 心 志 忠 怡 惠 慧 慶 憲 成 政 敏 文 昌 明 智 曉 柏 榮 欣 正 民 永 淑 玉 玲 珊 珍 珮 琪 瑋 瑜 瑞 瑩 盈 真 祥 秀 秋 穎 立 維 美 翔 翰 聖 育 良 芬 芳 英 菁 華 萍 蓉 裕 豪 貞 賢 郁 鈴 銘 雅 雯 霖 青 靜 韻 鴻 麗 龍".split(" "), Math.ceil(2));
}

//帳號
function CreateAccount(){
    function random(a, l){
        var x = [];
        x.push(a[Math.floor(Math.random() * a.length)]);
        while (l > 1) {
            x.push(a[Math.floor(Math.random() * a.length)]);
            l--;
        }
        return x.join("");
    }
    return random("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", Math.ceil(10));
}

// 成績
function CreateGrade(){
    return Math.floor(Math.random() * 11);
}

function CreateTable() {
    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    
    // 创建表格标题
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    for (let i = 0; i < headers.length; i++) {
        let th = document.createElement('th');
        th.innerText = headers[i];
        headerRow.appendChild(th);
    }
    
    // 创建表格内容
    let tbody = table.createTBody();
    for (let i = 1; i < data.length; i++) { 
        let row = tbody.insertRow();
        for (let j = 0; j < data[i].length; j++) {
            let cell = row.insertCell();
            // 检查是否为作业成绩列
            if (j > 4) {
                // 创建 img 元素来显示成绩对应的图片
                let img = document.createElement('img');
                img.src = `../Image/${data[i][j]}.svg`; // 假设您的图片位于同一目录，并以分数命名
                img.alt = 'Score Image';
                img.className = 'score-image'; 
                cell.appendChild(img);
            } else {
                cell.innerText = data[i][j];
            }
        }
    }
    document.body.appendChild(table);
}
document.addEventListener('DOMContentLoaded', CreateTable);
// 确保在页面加载完毕后调用 CreateTable 函数
//window.onload = CreateTable;