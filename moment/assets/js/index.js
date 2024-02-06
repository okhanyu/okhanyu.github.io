const {
    createApp
} = Vue;

const app = createApp({
    //delimiters: ['{[', ']}'],
    data() {
        return {
            items: [],
            user: {},
            settings: {},
            loginStatus: false,
            current: "index",
            editObj: {},
            editVisibility: 1,  
            editVisibilityOptions: [{
                    text: '仅自己可见',
                    value: 1
                },
                {
                    text: '登录',
                    value: 2
                },
                {
                    text: '公开',
                    value: 3
                }
            ],
            newStorageShow: false,
            newStorage: {
                "uri": "https://%s.cos.%s.myqcloud.com"
            },
            storageType: 's3',  
            storageTypeOptions: [{
                    text: 'S3',
                    value: 's3'
                },
                {
                    text: 'COS',
                    value: 'cos'
                }
            ],
            link: {
                about: "#"
            },
            image: {
                topBg: "./assets/img/bg.jpg",
                topAvatar: "./assets/img/1.webp"
            },
            button: {
                loadbtn: {
                    text: "点击加载更多",
                    loadmore: true
                },
                navBtn: [{
                    title: "首页",
                    subTitle: "",
                    url: "/",
                    show:true
                },{
                    title: "片刻",
                    subTitle: "",
                    url: "index",
                    show:true
                }, {
                    title: "设置",
                    subTitle: "",
                    url: "settings",
                    show:true
                }, {
                    title: "退出",
                    subTitle: "",
                    url: "logout",
                     show:true
                }, {
                    title: "登录",
                    subTitle: "",
                    url: "./login.html",
                     show:true
                }]
            }
        }
    },
    computed: {
        isMobile() {
            return window.innerWidth <= 768;
        },

    },
    methods: {
        closeButtonClick(){
              document.getElementById('overlay').style.display = 'none';
                // 重新启用背后内容滚动
              document.body.style.overflow = 'auto';
             document.querySelectorAll('.item-menu-list').forEach(element => {
              element.style.display = 'none';
            });
        },
        editSubmit(){
            editSubmit(this.editObj);
            document.querySelectorAll('.item-menu-list').forEach(element => {
              element.style.display = 'none';
            });
        },
        editResourceDel(rid){
            let newArray = this.editObj.resources.filter(obj => obj.id !== rid);
            this.editObj.resources = newArray;
            console.log(JSON.stringify(this.editObj.resources));
        },
        editBtnClick(obj){
            this.editObj = obj;
            this.editVisibility = obj.visibility;
            document.getElementById('overlay').style.display = 'block';
            // 禁止背后内容滚动
            document.body.style.overflow = 'hidden';
            console.log(JSON.stringify(this.editObj.resources));
        },
        mark(content){
            return marked(content);
        },
        newStorageShowClick() {
            this.newStorageShow = !this.newStorageShow;
        },
        visibilityFormat(visibility){
            if (visibility == 1){
                return "自己可见"
            }
            else if (visibility == 2){
                return "登录可见"
            }
            else if (visibility == 3){
                return "公开"
            }
        },
        currentChange(currentValue) {
            if (currentValue == 'logout'){
                localStorage.clear();
                window.location.href = "login.html";
                return;
            } else if (currentValue == '/'){
                window.location.href = "/";
                return;
            } else if (currentValue.indexOf('.html') == -1){
                 this.current = currentValue;
            } else {
                window.location.href = currentValue;
            } 
        },
        imgClassHanle(obj) {
            return (obj.resources != undefined ? obj.resources.length : 0) == 1 ? 'single-pic' : 'pic';
        },
        formatDate(value) {
            return formatDateAndCalculateTimeDifference(value);
        },
        fileDisplay(obj) {
            return obj.file_path;
        },
        deleteMoment(id){
            deleteMomentById(id);
        },
        submit() {
            submit();
        },
        uploadFiles() {
            upload();
        },
        next(event) {
            this.button.loadbtn.text = "耐心等待，正在加载，有些缓慢...";
            page += 1;
            const that = this;
            getMoments();
        },
        saveSettings() {
            var saveObj = JSON.parse(JSON.stringify(this.settings));
            for (let key in saveObj) {
                if (key == "storage" && this.newStorage.secret_id != undefined && this.newStorage.secret_id != null && this.newStorage.secret_id != "") {
                    var v = {
                        enable: this.newStorage.enable,
                        value_id: this.storageType,
                        value_name: this.newStorage.value_name,
                        value: {
                            bucket: this.newStorage.bucket,
                            region: this.newStorage.region,
                            secret_id: this.newStorage.secret_id,
                            secret_key: this.newStorage.secret_key,
                        }
                    };
                    if (this.storageType == "cos") {
                        v.value.uri = this.newStorage.uri;
                    }
                    if (this.storageType == "s3") {
                        v.value.endpoint = this.newStorage.endpoint;
                    }
                    saveObj[key].values.push(v);
                }
                for (var i = 0; i < saveObj[key].values.length; i++) {
                    if (key == "storage") {
                        saveObj[key].values[i].value = JSON.stringify(saveObj[key].values[i].value);
                    }
                    saveObj[key].values[i].enable = saveObj[key].values[i].enable == true ? 1 : -1;
                }
            }
            submitSettings(saveObj);
        },
    },
    mounted: function() {
        this.button.loadbtn.text = "耐心等待，正在加载，有些缓慢...";
        const that = this;
        loginCheck(function(result) {
            that.loginStatus = result;
            if (result) {
                filesInit();
                for (var i = 0; i < that.button.navBtn.length; i++) {
                    if (that.button.navBtn[i].url.indexOf('login') != -1){
                        that.button.navBtn[i].show = false;
                    }
                }
            }else{
                for (var i = 0; i < that.button.navBtn.length; i++) {
                    if (that.button.navBtn[i].url == 'logout'){
                        that.button.navBtn[i].show = false;
                    }
                    if (that.button.navBtn[i].url == 'settings'){
                        that.button.navBtn[i].show = false;
                    }
                }
            }
        });

        getMoments();
        getUserProfile();
        getSettings();

    }
});

const vm = app.mount('#app');

function showsItemMenu(currentNode) {
    var nextSiblingNode = currentNode.nextSibling;
    if ( nextSiblingNode.style.display == 'none' || nextSiblingNode.style.display == ""){
         nextSiblingNode.style.display = 'block'
     }else{
         nextSiblingNode.style.display = 'none'
     }
}


/****/


// 菜单
var menuShow = false;

function shows() {
    var elements = document.querySelectorAll('.menu-list');
    elements.forEach(function(element) {
        if (menuShow) {
            element.style.display = 'none'
        } else {
            element.style.display = 'block'
        }
        menuShow = !menuShow
    });
}
var elements = document.querySelectorAll('.menu-list');
elements.forEach(function(element) {
    element.addEventListener('blur', () => {
        element.style.display = 'none'
    })
});

/****/

function filesInit() {
    fileInputAddEventListener(document.querySelector('#fileInput'), document.querySelector('#uploadBtn'));
}

function submit() {
    var content = document.getElementById('momentText')
        .value;
    var files = filesCos;
    var r = [];
    for (var i = 0; i < files.length; i++) {
        r.push({
            "file_path": files[i]
        });
    }

    // var visibility = document.querySelector('input[name="radio-status"]:checked').value;
    var visibility = document.querySelector('#radio-status')
        .value;

    var param = {
        "content": content,
        "visibility": parseInt(visibility),
        "resources": r
    };
    fetch(server + "moment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(param)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('获失败');
            }
            return response.json();
        })
        .then(data => {
            if (data == undefined) {
                alert("失败");
            } else {
                if (data.code == 100000) {
                    alert("成功");
                } else if (data.code == 100002) {
                    alert("登录失效，失败");
                    window.location.href = 'login.html';
                } else if (data.code != 100000) {
                    alert("失败");
                }

            }
            window.location.reload();
        });

}

function editSubmit(editObj){

    // var files = filesCos;
    // var r = [];
    // for (var i = 0; i < files.length; i++) {
    //     r.push({
    //         "file_path": files[i]
    //     });
    // }

    editObj.visibility = vm.$data.editVisibility;


    fetch(server + "moment", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(editObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('失败');
            }
            return response.json();
        })
        .then(data => {
            if (data == undefined) {
                alert("失败");
            } else {
                if (data.code == 100000) {
                    alert("成功");
                    document.getElementById('overlay').style.display = 'none';
                    // 重新启用背后内容滚动
                   document.body.style.overflow = 'auto';
                } else if (data.code == 100002) {
                    alert("登录失效，失败");
                    window.location.href = 'login.html';
                } else if (data.code != 100000) {
                    alert("失败");
                }

            }
            // window.location.reload();
        });
}


function getMoments() {

    var momentsApi = "moments?page=" + page + "&size=" + limit;

    fetch(server + momentsApi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('获失败');
            }
            return response.json();
        })
        .then(data => {
            if (data.data != undefined && data.data != null && data.data.length != 0) {
                vm.$data.items.push(...data.data);
                vm.$data.button.loadbtn.text = "点击加载更多";
            } else {
                vm.$data.button.loadbtn.loadmore = false;
                return;
            };

        });

}

function getUserProfile() {

    var userApi = "user/" + localStorage.getItem("userid");

    fetch(server + userApi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('获失败');
            }
            return response.json();
        })
        .then(data => {
            //data.data.desc = JSON.parse(data.data.desc);
            if (data != undefined && data.code == 100000) {
               vm.$data.user = data.data;
               vm.$data.image.topAvatar = vm.$data.user.avatar;
            }
            
        });

}

function getSettings() {

    var settingsApi = "settings";

    fetch(server + settingsApi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('获失败');
            }
            return response.json();
        })
        .then(data => {
            if (data.data != undefined && data.data != null && data.data.length != 0) {
                var res = data.data;
                for (let key in res) {
                    // console.log(key, res[key]);

                    for (var i = 0; i < res[key].values.length; i++) {
                        if (key == "storage") {
                            res[key].values[i].value = JSON.parse(res[key].values[i].value);
                        }
                        res[key].values[i].enable = res[key].values[i].enable == -1 ? false : true;
                    }

                }
                vm.$data.settings = res;
                if (res.display != undefined && res.display.values != undefined) {
                    for (var i = 0; i < res.display.values.length; i++) {
                        if (res.display.values[i].value_id == "top_img") {
                            vm.$data.image.topBg = res.display.values[i].value;
                        }
                    }
                }
            };
        });
}

function submitSettings(saveObj) {

    fetch(server + "settings", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(saveObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('请求失败');
            }
            return response.json();
        })
        .then(data => {
            if (data == undefined) {
                alert("失败");
            } else {
                if (data.code == 100000) {
                    alert("成功");
                } else if (data.code == 100002) {
                    alert("登录失效，失败");
                    window.location.href = 'login.html';
                } else if (data.code != 100000) {
                    alert("失败");
                }
            }

        });
}

function deleteMomentById(deleteId) {

    fetch(server + "moment", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({id:deleteId})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('请求失败');
            }
            return response.json();
        })
        .then(data => {
            if (data == undefined) {
                alert("失败");
            } else {
                if (data.code == 100000) {
                    alert("成功");
                    var element = document.getElementById(deleteId);
                    if (element) {
                      element.remove();
                    } else {
                      console.log('未找到指定id的元素');
                    }
                } else if (data.code == 100002) {
                    alert("登录失效，失败");
                    window.location.href = 'login.html';
                } else if (data.code != 100000) {
                    alert("失败");
                }
            }

        });
}



function tagHandle(obj) {
    var content = obj.content;
    content = content.lefttrim();
    var tags = [];
    if (content.indexOf("#") == 0) {
        var k = 0;
        for (var j = 0; j < content.length; j++) {
            var temp = j + 1 == content.length ? true : false;
            if (content.charAt(j) == " " || content.charAt(j) == "\n" || content.charAt(j) == "\t" || temp) {
                j = temp ? j + 1 : j;
                var tag = content.substring(k, j);
                tags.push(tag);
                k = j + 1;
                if (content.charAt(j + 1) != "#") {
                    break;
                }
            }
        }
        content = content.substring(k, content.length);
        obj["tags"] = tags;
    }

    content = marked(content);
    content = content.replace("\n", "<p></p>");
    obj.content = content;
    return obj;
}


// markdown格式化
var rendererMD = new marked.Renderer();
marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

hljs.initHighlightingOnLoad();

// document.getElementById('openButton').addEventListener('click', function() {
//   document.getElementById('overlay').style.display = 'block';
// });

