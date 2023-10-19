
var common = (function (){

     // 路由部分
    // const baseUri = "http://127.0.0.1:9999/blog/api/";
    const server= "https://api.hahaha.cc";

    // 初始页码
    var page = 0;

    // 查询条数
    var size = 10;

    function buildGetParam(paramKey,paramValue) {
           if (paramValue != undefined && (typeof paramValue) == 'string'){
            return "&" + paramKey +"=" + paramValue 
           }
          var  paramGet = "";
          for (var i = 0; i < paramValue.length; i++) {
              paramGet += "&" + paramKey + "=" + paramValue[i];  
          }
          return paramGet;
    }



   var rendererMD = new marked.Renderer();
   marked.setOptions({
      renderer: rendererMD,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      toc:true
    });//基本设置

    function convertMarkdownToHTML(text) {
        return marked.parse(text);
    }

    function getBrowserParam(param){
            // 创建URLSearchParams对象
            const params = new URLSearchParams(window.location.search);
            // 获取指定参数的值
            const paramValue = params.get(param);
            return paramValue;
    }

    function reverse(obj){
        // const obj = { a: 1, b: 2, c: 3 };

        // 将对象的属性转换为数组
        const entries = Object.entries(obj);

        // 对数组进行倒序排序
        const reversedEntries = entries.sort((a, b) => b[0].localeCompare(a[0]));

        // 将排序后的数组转回对象
        //const reversedObj = Object.fromEntries(reversedEntries);

       // 将倒序排序后的数组转换为 Map 对象
        const reversedMap = new Map(Array.from(reversedEntries));

        console.log(reversedMap);
        return reversedMap;
    }


    function getRandomRotation(){
        return Math.floor(Math.random() * 360); // 生成0到360之间的随机数作为旋转角度
    }

    function group(list){
       return  list.reduce((result, item) => {
        const key = item["category_name"];
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
        return result;
      }, {});
    }

    function initOther() {
        let nav,icon;
        icon = $('#menu_icon');
        nav = $('#site_nav');
        icon.click(function() {
            nav.slideToggle(250);
        });

        $('[data-fancybox="gallery"]').fancybox();
        $(".fancybox").fancybox();

        let bt;
        bt = $('#back_to_top');
        if ($(document).width() > 480) {
            $(window).scroll(function() {
                let st;
                st = $(window).scrollTop();
                if (st > 30) {
                    return bt.css('display', 'block')
                } else {
                    return bt.css('display', 'none')
                }
            });
            bt.click(function() {
                $('body,html').animate({
                    scrollTop: 0,
                },800);
                return false;
            });
        };
    }




    // Util工具部分

    function format(value,args){
        //var dt = new Date(value*1000);
        const dt = new Date(value);
        if(args == 'yyyy-M-d') {// yyyy-M-d
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let date = dt.getDate();
            return `${year}-${month}-${date}`;
        } else if(args == 'yyyy-M-d H:m:s'){// yyyy-M-d H:m:s
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let date = dt.getDate();
            let hour = dt.getHours();
            let minute = dt.getMinutes();
            let second = dt.getSeconds();
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        } else if(args == 'yyyy-MM-dd') {// yyyy-MM-dd
            let year = dt.getFullYear();
            let month = (dt.getMonth() + 1).toString().padStart(2,'0');
            let date = dt.getDate().toString().padStart(2,'0');
            return `${year}-${month}-${date}`;
        } else {// yyyy-MM-dd HH:mm:ss
            let year = dt.getFullYear();
            let month = (dt.getMonth() + 1).toString().padStart(2,'0');
            let date = dt.getDate().toString().padStart(2,'0');
            let hour = dt.getHours().toString().padStart(2,'0');
            let minute = dt.getMinutes().toString().padStart(2,'0');
            let second = dt.getSeconds().toString().padStart(2,'0');
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        };
    }

    var isEmpty = function (value){
        if (value == null || value == undefined || value == ""){
            return true;
        }
    }

    var isListEmpty = function (value){
        if (value == null || value == undefined || value.length == 0){
            return true;
        }
    }

    var formatTimes = function (timestamp){
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    var imgFacyboxHandle = function (cls){
    // 查找页面上的所有img标签
    const imgElements = document.getElementsByTagName('img');

    // 遍历所有的img标签
    for (let i = 0; i < imgElements.length; i++) {
        const img = imgElements[i];
        if (img.getAttribute("data-not") == undefined || img.getAttribute("data-not") == null || img.getAttribute("data-not") == ""){
            // 创建a标签元素
            const a = document.createElement('a');
            // 设置a标签的href属性
            a.href = img.src;
            a.setAttribute("data-fancybox","group");
            a.setAttribute("rel","group");
            // a.setAttribute("data-fancybox","gallery");
            a.setAttribute("data-caption",img.getAttribute("caption") == null ? "" : img.getAttribute("caption") );
            a.setAttribute("class",img.getAttribute("parent-class") == null ? cls : img.getAttribute("parent-class"));

            // 将img标签的属性复制到a标签
            // for (let j = 0; j < img.attributes.length; j++) {
            //     const attr = img.attributes[j];
            //     a.setAttribute(attr.name, attr.value);
            // }

            // 复制节点元素
            const clonedNode = img.cloneNode(true);
            // 将img标签替换为a标签
            img.parentNode.replaceChild(a, img);
            a.appendChild(clonedNode);
        }
    }
}


    return {
        server:server,
        page:page,
        size:size,
        format:format,
        isEmpty:isEmpty,
        isListEmpty:isListEmpty,
        getBrowserParam:getBrowserParam,
        reverse:reverse,
        buildGetParam:buildGetParam,
        convertMarkdownToHTML:convertMarkdownToHTML,
        getRandomRotation:getRandomRotation,
        group:group,
        initOther:initOther,
        formatTimes:formatTimes,
        imgFacyboxHandle:imgFacyboxHandle
    }

})();




