// pages/inspection/inspection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    showActionsheet: false,
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    groups: [{
      text: '本地巡检',
      value: 1
    },
    {
      text: '新增',
      value: 2
    }
    ],
    file: [],//归档
    start: 0,//起始记录
    pageSize: 15, //获取记录数量
    qingqiu: true
  },
  //拓展菜单
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  //tap切换
  swiperTab: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      start: 0,//起始记录
      pageSize: 15, //获取记录数量
      qingqiu: true
    });

    // wx.request({
    //   url: getApp().globalData.url + '/terminal/queryInstanceFlow.do?',
    //   data: {
    //     tmessage: {
    //       'query': {
    //         'userId': wx.getStorageSync('user').userId, //用户id
    //         'type': e.detail.current + 1,
    //         'start': 0,//起始记录
    //         'pageSize': 15, //获取记录数量
    //       }

    //     }
    //   },
    //   header: {
    //     cookie: this.data.cookies
    //   },
    //   method: 'get',
    //   success: (res) => {
    //     console.log(res)
    //     if (res.data.success) {
    //       this.setData({
    //         file: res.data.info.result
    //       })
    //     }

    //   }
    // })
  },
  clickTab: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //展开菜单
  purchaseApproval() {
    this.setData({
      showActionsheet: true
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    setTimeout(() => {
      wx.showToast({
        title: '刷新成功',
        duration: 500, //停留时间
      })
      this.load()
      wx.stopPullDownRefresh();
    }, 500)
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

  }
})