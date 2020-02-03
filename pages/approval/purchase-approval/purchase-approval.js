// pages/approval/purchase-approval/purchase-approval.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    purchaseapproval:'',
    start: 0,//起始记录
    pageSize: 15, //获取记录数量
    qingqiu: true
  },
  //q切换
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
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    wx.request({
      url: getApp().globalData.url + '/terminal/queryPurchasePlanFlow.do?',
      data: {
        tmessage: {
          'query': {
            'userId': wx.getStorageSync('user').userId,
            'type': e.detail.current + 1,
            'start': 0,//起始记录
            'pageSize': 15, //获取记录数量
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
            purchaseapproval: res.data.info.result
          })
        }
      }
    })
  },
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  chudi() {
    if (this.data.qingqiu == true) {
      this.setData({
        // start: this.data.start + this.data.pageSize,
        pageSize: this.data.pageSize + 15
      })
      wx.request({
        url: getApp().globalData.url + '/terminal/queryPurchasePlanFlow.do?',
        data: {
          tmessage: {
            'query': {
              'userId': wx.getStorageSync('user').userId, //用户id
              'type': this.data.currentTab + 1,
              'start': this.data.start,//起始记录
              'pageSize': this.data.pageSize, //获取记录数量
            }

          }
        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          if (res.data.info.result != '') {
            var fileatt = []
            for (var i = 0; i < res.data.info.result.length; i++) {
              fileatt.push(res.data.info.result[i])
            }

            if (res.data.success) {
              this.setData({
                purchaseapproval: fileatt
              })
            }
          } else {
            this.setData({
              qingqiu: false
            })
          }

        }
      })
    } else {
      console.log(1111111)
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    })

    this.load()
  },
  load(){
    wx.request({
      url: getApp().globalData.url + '/terminal/queryPurchasePlanFlow.do?',
      data: {
        tmessage: {
          'query': {
            'userId': wx.getStorageSync('user').userId,
            'type': this.data.currentTab+1
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
            purchaseapproval: res.data.info.result
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

  },
  approvalresult(e){
    console.log(e)
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: './approvalresultlist/approvalresultlist?purchasePlanId=' + e.currentTarget.dataset.id + '&currentTab=' + this.data.currentTab
    })
    wx.hideLoading()
  }
})