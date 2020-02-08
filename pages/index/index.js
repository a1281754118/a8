//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
    shebei: wx.getStorageSync('shebei')
  },
  //日常考勤
  timecard(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../timecard/timecard'
    })
    wx.hideLoading()
  },
  //安全巡检
  inspection(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../inspection/inspection'
    })
    wx.hideLoading()
  },
  //事物审批
  approval(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../approval/approval'
    })
    wx.hideLoading()
  },
  //故障报修
  repair() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../repair/repair'
    })
    wx.hideLoading()
  },
  //装车物流
  loading(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../loading/Loading'
    })
    wx.hideLoading()
  },
  //物流签收
  signfor(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: '../sign-for/sign-for'
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
    })
    this.load()
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
  load(){
    wx.request({
      url: getApp().globalData.url + '/terminal/countAllRepair.do?',
      data: {
        tmessage: {
          'query': {
            'receiveTel': wx.getStorageSync('username')
          }
        }

      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        console.log(res)
        if (res.data.success) {

          wx.setStorageSync('shebei', res.data.info.result[0])
          this.setData({
            shebei: res.data.info.result[0]
          })
        } else {
          wx.showLoading({
            title: '登录超时',
            duration: 1000,
            mask: true,
            success: () => {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/login/login'
                })
              }, 1000)
            }
          })
        }



      }
    })
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

  }
})