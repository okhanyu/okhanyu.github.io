
var isEmpty = function(value) {
    if (value == null || value == undefined || value == "") {
        return true;
    }
}

var isListEmpty = function(value) {
    if (value == null || value == undefined || value.length == 0) {
        return true;
    }
}

// 格式化时间
function formatDateAndCalculateTimeDifference(timeString) {
    // 解析输入的时间
    let date = new Date(timeString);

    // 获取当前时间
    let now = new Date();

    // 计算时间差（毫秒）
    let diff = now - date;

    // 如果时间差在5小时内
    if (diff <= 5 * 60 * 60 * 1000) {
        let hours = Math.floor(diff / (60 * 60 * 1000));
        let minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        return hours == 0 ? `${minutes}分钟前` : `${hours}小时${minutes}分钟前`;
    } else {
        // 否则，返回格式化的日期和时间
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1))
            .slice(-2);
        let day = ("0" + date.getDate())
            .slice(-2);
        let hours = ("0" + date.getHours())
            .slice(-2);
        let minutes = ("0" + date.getMinutes())
            .slice(-2);
        let seconds = ("0" + date.getSeconds())
            .slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}


// 时间格式化（废弃）
function format(timestamp) {
    // 创建 Date 对象
    var date = new Date(timestamp * 1000);

    // 获取各种时间组件
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // 月份从 0 开始，所以需要加 1
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // 格式化时间
    var formattedTime = year + '-' + addLeadingZero(month) + '-' + addLeadingZero(day) + ' ' + addLeadingZero(hours) + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds);

    return formattedTime;
}


// 在个位数前添加前导零
function addLeadingZero(number) {
    return number < 10 ? '0' + number: number;
}




String.prototype.lefttrim = function() {
    return this.replace(/(^\s*)/g, "");
}

// 获取地址栏参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");　　 //search,查询？后面的参数，并匹配正则
    var r = location.search.substr(1).match(reg);　　
    if (r != null) return decodeURI(decodeURI(r[2]));
};
