// pages/approval/add-approval/CClist/CClist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adTitle: '',//搜索内容
    display: 'none',
    display1: 'none',
    cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
    arr:[],
    arr1:[],
    opid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var flowid = options.flowid
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
      opid: options.id,
      flowid: flowid
    })
    this.load(flowid)
  },
  load(flowid){
    console.log(flowid)
    if(this.data.opid=='2'){
      wx.request({
        url: getApp().globalData.url + '/terminal/queryUsersRepair.do?',
        data: {
          tmessage: {
            'query': {
              'userName': this.data.adTitle
            }
          }
        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          var ress = res.data.info.result
          this.setData({
            arr: ress
          })
        }
      })
    }else if(this.data.opid=='1'){
      wx.request({
        url: getApp().globalData.url + '/terminal/queryChkManFlow.do?',
        data: {
          tmessage: {
            'query': {
              'flowId': flowid,
              'seq': 1,
              'userName': this.data.adTitle
            }
          }

        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          // var ress = res.data.info.result
          // var arr = []
          // for (var i = 0; i < ress.length; i++) {
          //   arr.push(ress[i])
          // }
          this.setData({
            arr1: res.data.info.result
          })
        }
      })
    }
    
  },
  camera(e){
    console.log(e)
    var pages = getCurrentPages();   //当前页面
    var arr = e.currentTarget.dataset.arr
    var prevPage = pages[pages.length - 2];   //上一页面
    console.log(prevPage)
    if(this.data.opid=='2'){
      prevPage.setData({

        //直接给上一个页面赋值
        addresschose: this.data.arr1,

      });
      wx.navigateBack({

        delta: 1  // 返回上一级页面。

      })
    }else if(this.data.opid=='1'){
      prevPage.setData({

        //直接给上一个页面赋值
        text5id: arr.USERID,
        text5: arr.USERNAME
      });
      wx.navigateBack({

        delta: 1  // 返回上一级页面。

      })
    }
    

    

    // wx.redirectTo({
    //   url: '../add-approval?userid='+this.data.arr1
    // })
  },
  checkboxChange: function (e) {
    console.log(e.detail.value)
    if(e.detail.value==''){
      this.setData({
        display1: 'none'
      })
    }else{
      this.setData({
        arr1: e.detail.value,
        display1:'block'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //删除搜索内容
  delt() {
    this.setData({
      adTitle: '',
      display: 'none'
    })
    this.search()
  },
  //点击完成按钮时触发
  search() {
    this.setData({
      start: '0',
      request: false
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    var flowid=this.data.flowid
    this.load(flowid)
  },
  input(e) {
    var that = this
    if (e.detail.value.length < 1) {
      that.setData({
        adTitle: '',
        display: 'none',
      })
      this.search()
    } else {
      that.setData({
        adTitle: e.detail.value,
        display: 'block'
      })
    }

  },
})