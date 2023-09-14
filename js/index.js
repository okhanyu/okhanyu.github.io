var api = "/api/v1/memo";

// 获取内容后回调
var callbak = function(response, apps, owner) {
    if (common.isEmpty(response)) {
        apps.button.loadbtn.loadmore = false;
        apps.button.loadbtn.text = "已无数据";
        return;
    };
    owner.push(...response);
    apps.isInitialized = true;

    // common.imgFacyboxHandle("momentsa fancybox");
    $(".fancybox").fancybox();
    // vm.$data.items.push.apply(vm.$data.items, item)
};

function getData(route,callback){
      var uri = route + "?limit="+ common.size +"&offset=" + common.page * common.size + "&creatorId=1";
      // const headers = {
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer your_token',
      // };
      options = {};
      fetch(uri,options )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        callback(response);
      })
      .catch(function(error) {
        console.log(error);
      });
}

const {
    createApp
} = Vue;

const app = createApp({
    delimiters: ['{[', ']}'],
    data() {
        return {
            isInitialized: true,
            items: [],
            button: {
                loadbtn: {
                    text: "加载更多",
                    loadmore: true
                }
            }
        }
    },
    computed: {},
    methods: {
        mark(text) {
            return common.convertMarkdownToHTML(text)
        },
        formatDate(value) {
            return common.formatTimes(value);
        },
        load(event) {
            const that = this;
            common.page += 1;
            getData(common.server + api,function(res){
                callbak(res,that,that.items);
            });
        }
    },
    mounted: function() {
        // common.initOther();
        common.size = 2;
        var that = this;
        getData(common.server + api,function(res){
            callbak(res,that,that.items);
        });
    }
});

const vm = app.mount('#app');




