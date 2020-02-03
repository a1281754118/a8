//app.js
var utils = require("./utils/util.js")
App({
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null,
    // url: 'https://www.jjaq.com.cn/sdbj',//正式接口
    // url: 'http://192.168.0.227:8080/mmis',//本地接口
    url: 'https://www.jjaq.com.cn/sdbjcs',//测试接口
    formatTime: utils.formatTime,
    utils: utils
  }
})