// pages/approval/approval-lc/approval-lc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    purchasePlanId:'',
    arr:[],
    value1:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
      purchasePlanId: options.purchasePlanId
    })
    console.log(options)
    this.load(options.purchasePlanId)
  },
  load(purchasePlanId){
    wx.request({
      url: getApp().globalData.url + '/terminal/queryFormAcceptFlow.do?',
      data: {
        tmessage: {
          'purchasePlanId': purchasePlanId
        }
      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          this.setData({
            arr: res.data
          })
          if (res.data.result==''){
            this.setData({
              value1:'暂无审批结果'
            })
          }else{
            var img=[]
            if(res.data.result.length>=1){
              wx.request({
                url: getApp().globalData.url + '/terminal/getRemarkFileAttach.do?',
                data: {
                  tmessage: {
                    'query':{
                      'fileId': res.data.purchasePlan.firstSignPic
                    }
                 
                  }
                },
                header: {
                  cookie: this.data.cookies
                },
                method: 'get',
                success: (res) => {
                  console.log(res)
                  this.setData({
                    img1: getApp().globalData.url + '/image/'+ res.data.result.path
                  })
                 
                }
              })
            }
            if (res.data.result.length >= 2) {
              wx.request({
                url: getApp().globalData.url + '/terminal/getRemarkFileAttach.do?',
                data: {
                  tmessage: {
                    'query': {
                      'fileId': res.data.purchasePlan.secondSignPic
                    }

                  }
                },
                header: {
                  cookie: this.data.cookies
                },
                method: 'get',
                success: (res) => {
                  
                  console.log(res)
                  this.setData({
                    img2: getApp().globalData.url + '/image/'+res.data.result.path
                  })
                }
              })
            }
            if (res.data.result.length >= 3) {
              wx.request({
                url: getApp().globalData.url + '/terminal/getRemarkFileAttach.do?',
                data: {
                  tmessage: {
                    'query': {
                      'fileId': res.data.purchasePlan.thirdSignPic
                    }

                  }
                },
                header: {
                  cookie: this.data.cookies
                },
                method: 'get',
                success: (res) => {
                  console.log(res)
                  this.setData({
                    img3: getApp().globalData.url +'/image/' + res.data.result.path
                  })

                }
              })
            }
          }
        }
      }
    })
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

  }
})