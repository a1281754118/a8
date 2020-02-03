// pages/approval/approval.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    showActionsheet: false,
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    groups: [{
        text: '新增审批',
        value: 1
      },
      {
        text: '采购审批',
        value: 2
      },
      {
        text: '后续增加',
        type: 'warn',
        value: 3
      }
    ],
    file:[],//归档
    start: 0,//起始记录
    pageSize: 15, //获取记录数量
    qingqiu:true
  },
  //拓展菜单
  close: function() {
    this.setData({
      showActionsheet: false
    })
  },
  btnClick(e) {
    console.log(e.detail.value)
    //审批
    if (e.detail.value == '2') {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      wx.navigateTo({
        url: './purchase-approval/purchase-approval'
      })
      wx.hideLoading()
    } else if (e.detail.value == '1') {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      wx.navigateTo({
        url: './add-approval/add-approval'
      })
      wx.hideLoading()
    }

    this.close()
  },
  //tap切换
  swiperTab: function(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      start: 0,//起始记录
      pageSize: 15, //获取记录数量
      qingqiu:true
    });
    
    wx.request({
      url: getApp().globalData.url + '/terminal/queryInstanceFlow.do?',
      data: {
        tmessage: {
          'query': {
            'userId': wx.getStorageSync('user').userId, //用户id
            'type': e.detail.current+1,
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
        if(res.data.success){
          this.setData({
            file: res.data.info.result
          })
        }
        
      }
    })
  },
  clickTab: function(e) {
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
  //采购审批
  purchaseApproval() {
    this.setData({
      showActionsheet: true
    })

  },
  //审批明细
  approvalresult(e) {
    console.log(e)
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.navigateTo({
      url: './approvalresult/approvalresult?insid=' + e.currentTarget.dataset.insid
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    })
    this.load()
  },
  load() {
    wx.request({
      url: getApp().globalData.url + '/terminal/queryInstanceFlow.do?',
      data: {
        tmessage: {
          'query': {
            'userId': wx.getStorageSync('user').userId, //用户id
            'type': this.data.currentTab+1,
            'start': this.data.start,//起始记录
            'pageSize':this.data.pageSize, //获取记录数量
          }

        }
      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        // var fileatt=[]
        // for(var i=0;i<res.data.info.result.length;i++){
        //   fileatt.push(res.data.info.result) 
        // }
        console.log(res)
        if (res.data.success) {
          this.setData({
            file: res.data.info.result
          })
        }
      }
    })
  },
  chudi(){
    if(this.data.qingqiu==true){
      this.setData({
        // start: this.data.start + this.data.pageSize,
        pageSize: this.data.pageSize + 15
      })
      wx.request({
        url: getApp().globalData.url + '/terminal/queryInstanceFlow.do?',
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
                file: fileatt
              })
            }
          } else {
            this.setData({
              qingqiu: false
            })
          }

        }
      })
    }else{
      console.log(1111111)
    }
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log(11111111)
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
  onReachBottom: function() {
    console.log(11111)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})