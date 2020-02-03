// pages/approval/approvalresult/approvalresult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    approvalresult:'',
    imgarr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
    })
    console.log(options.insid)
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    })
    this.load(options.insid)
  },
  load(insid){
    wx.request({
      url: getApp().globalData.url + '/terminal/queryViewFlow.do?',
      data: {
        tmessage: {
          'query': {
            'insId': insid, //id
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
          this.setData({
            approvalresult: res.data.info.result
          })
        }
        if (res.data.info.result.fileAttaches){
          wx.request({
            url: getApp().globalData.url + '/terminal/getRemarkFileAttach.do?',
            data: {
              tmessage: {
                'query': {
                  'fileId': res.data.info.result.fileAttaches
                }

              }
            },
            header: {
              cookie: this.data.cookies
            },
            method: 'get',
            
            success: (res) => {
              console.log(res)
              if (res.data.result!=''){
                var arr = []
                arr.push(getApp().globalData.url + '/image/' + res.data.result.path)
                
                this.setData({
                  imgarr: arr
                })
              }
              
            }
          })
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

  },
  jieguo(){
    
  }
})