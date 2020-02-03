// pages/login/login.js
const md5 = require('../../utils/md5.js')
const base64 = require('../../utils/base64.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    mobile: wx.getStorageSync('username'),
    display:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      isHighAccuracy: true,
      success: (res) => {
        console.log(res)
        
      },
    })
    this.setData({
      mobile: wx.getStorageSync('username'),
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
  //获取账号
  mobile(e){
    this.setData({
      mobile:e.detail.value
    })
    if(e.detail.value!=''){
      this.setData({
        display:'block'
      })
    }else{
      this.setData({
        display:'none'
      })
    }
  },
  //获取密码
  password(e){
    this.setData({
      password: e.detail.value
    })
  },
  //删除账号密码
  delt(){
    this.setData({
      mobile:'',
      password:'',
    })
  },
  hide(){
    this.setData({
      display:'none'
    })
  },
  display(){
    if(this.data.mobile!=''){
      this.setData({
        display:'block'
      })
    }
  },
  //登录
  login(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var loginData = {
      mobile: this.data.mobile, 
      password: base64.hex2b64(md5.hex_md5(this.data.password)).toString(), 
      // password:this.data.password
    }
    wx.request({
      url: getApp().globalData.url +'/loginMiniProgram.do?',
      data:loginData,
      method:'get',
      success:(res)=>{
        console.log(res)
        var cookies = res.header["Set-Cookie"].split(";")[0] //测试
        wx.setStorageSync('cookies', encodeURIComponent(cookies)) //对cookies进行储存
        wx.setStorageSync('username', this.data.mobile)
        wx.setStorageSync('user', res.data.user)
        if (res.data.success==true){
          wx.hideLoading()
          wx.showToast({
            title: '登录成功',
            duration: 2000
          })
          setTimeout( ()=> {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }, 2000)
         
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
        }
        
      }
    })
    
  }
})