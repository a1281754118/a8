// pages/timecard/timecard.js
var amapFile = require('../../libs/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specificdate:'',//日期
    time:'',//流动时间
    worktime:'',//上班时间
    signback:'',//下班时间
    signin:true,
    lenMore: 0,
    imgs: [],
    latitude :'',//维度
    longitude :'',//经度
    address:{},//位置信息
    cookies: decodeURIComponent(wx.getStorageSync('cookies')),//解码cookie
    work:'',//签到
    offwork:'',//签退
    remarksvalue: wx.getStorageSync('remarksvalue'),
    positionarr:wx.getStorageSync('positionarr'),//获取位置列表
    url: getApp().globalData.url,
    imgarr: wx.getStorageSync('imgarr'),//获取图片列表
  },
  //上传查看图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var that = this
        var imgs = that.data.imgs;
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.url + '/file-upload',      //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            cookie: this.data.cookies,
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ..'    //若有token，此处换上你的token，没有的话省略
          },
          formData: {
            'user': 'test', //其他额外的formdata，可不写
            'file_cat': 'APP_ATTENDAMCE'

          },
          success: (res) => {
            console.log(JSON.parse(res.data));
            var fileId = JSON.parse(res.data).fileId
            var filePath = JSON.parse(res.data).filePath
            // if (this.data.fileId == '') {
            //   this.setData({
            //     fileId: fileId
            //   })
            // } else {
            //   this.setData({
            //     fileId: this.data.fileId + ',' + fileId
            //   })
            // }
            wx.request({
              url: this.data.url + '/terminal/upPhotoAttendamce.do?',
              data: {
                tmessage: {
                  'userId': wx.getStorageSync('user').userId,//用户id
                  'sgDate': this.data.specificdate,//日期
                  'fileId': fileId
                  
                }
              },
              header: {
                cookie: this.data.cookies
              },
              method: 'get',
              success: (res) => {
                console.log(res)
                if (res.data.success==true) {
                  wx.showToast({
                    title: res.data.msg,
                    duration: 2000
                  })
                  var time = getApp().globalData.formatTime(new Date()).substring(10, 19);
                  var obj = { time: time, img: 'https://www.jjaq.com.cn/sdbjcs/image/'+filePath }
                  if (wx.getStorageSync('imgarr')) {
                    var arr = wx.getStorageSync('imgarr')
                    arr.push(obj)
                    console.log(arr)
                    wx.setStorageSync('imgarr', arr)
                    this.setData({
                      imgarr: arr
                    })
                  } else {
                    wx.setStorageSync('imgarr', [])
                    var arr = wx.getStorageSync('imgarr')
                    arr.push(obj)
                    console.log(arr)
                    wx.setStorageSync('imgarr', arr)
                    this.setData({
                      imgarr: arr
                    })
                  }
                }
              }
            })
          },
        })

        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //上报位置
  report(){
    var time = getApp().globalData.formatTime(new Date()).substring(10, 19);
    if (wx.getStorageSync('work') != ''){
      wx.request({
        url: getApp().globalData.url + '/terminal/upRemarkAttendamce.do?',
        data: {
          tmessage: {
            'userId': wx.getStorageSync('user').userId,//用户id
            'sgDate': this.data.specificdate,//日期
            'upTime': time,//时间
            'Location': this.data.latitude + "," + this.data.longitude
          }
        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          if (res.data.success==true) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
            
            var obj = { time: time, position: this.data.address.name }
            if (wx.getStorageSync('positionarr')){
              var arr = wx.getStorageSync('positionarr')
              arr.push(obj)
              console.log(arr)
              wx.setStorageSync('positionarr', arr)
              this.setData({
                positionarr: arr
              })
            }else{
              wx.setStorageSync('positionarr',[])
              var arr = wx.getStorageSync('positionarr')
              arr.push(obj)
              console.log(arr)
              wx.setStorageSync('positionarr', arr)
              this.setData({
                positionarr: arr
              })
            }
            
            
            
            
          }



        }
      })
    }else{
      wx.showToast({
        title: '请先签到',
        icon:'none',
        duration: 2000
      })
    }
    
  },
  //备注
  remarks(){
    if (wx.getStorageSync('work') != '') {
      wx.request({
        url: this.data.url + '/terminal/upRemarkAttendamce.do?',
        data: {
          tmessage: {
            'userId': wx.getStorageSync('user').userId,//用户id
            'sgDate': this.data.specificdate,//日期
            'remark': this.data.remarksvalue,//备注内容
            'aid': wx.getStorageSync('work').aid
          }
        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          if(res.data.success){
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
            wx.setStorageSync('remarksvalue', this.data.remarksvalue)
          }
          
          

        }
      })
    } else {
      wx.showToast({
        title: '请先签到',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //点击签到
  signin(){
    var time = getApp().globalData.formatTime(new Date()).substring(10, 19);
    wx.request({
      url: getApp().globalData.url + '/terminal/submitAttendamce.do?',
      data: {
        tmessage: {
          'userId': wx.getStorageSync('user').userId,
          'type': '1',
          'sgDate': this.data.specificdate,
          'sgTime': time,
          'location': this.data.latitude + "," + this.data.longitude
        }
      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
          
          var arr = {
            aid: res.data.aid,
            name: this.data.address.name,
            time: time
          }
          wx.setStorageSync('work', arr)
          this.setData({
            work: arr
          })
        }
        

      }
    })
    
    this.setData({
      signin:false,
      worktime:time
    })
  },
  //签退
  signback(){
    var time = getApp().globalData.formatTime(new Date()).substring(10, 19);
    wx.request({
      url: getApp().globalData.url + '/terminal/submitAttendamce.do?',
      data: {
        tmessage: {
          'userId': wx.getStorageSync('user').userId,
          'type': '2',
          'sgDate': this.data.specificdate,
          'sgTime': time,
          'location': this.data.latitude + "," + this.data.longitude
        }
      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
          var arr = {
            aid: res.data.aid,
            name: this.data.address.name,
            time: time
          }
          wx.setStorageSync('offwork', arr)
          this.setData({
            offwork: arr
          })
        }

        

      }
    })
    
    this.setData({
      signin: 'none',
      signback: time
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    })
    var time = getApp().globalData.formatTime(new Date());
    var specificdate = time.substring(0, 10)
    var specificdate = specificdate.replace('/', '-')
    var specificdate = specificdate.replace('/', '-')

    console.log(specificdate)
    //判断日期 每天清空打卡
    if (wx.getStorageSync('data')) {
      if (wx.getStorageSync('data') == specificdate) {
        console.log('今天是同一天')
      } else {
        console.log('过了一天了更新打卡')
        wx.setStorageSync('work', '')
        wx.setStorageSync('offwork', '')
        wx.setStorageSync('remarksvalue', '')
        wx.setStorageSync('positionarr', [])
        wx.setStorageSync('imgarr', [])
        this.setData({
          work: '',
          offwork: '',
        })
        wx.setStorageSync('data', specificdate)
      }
    } else {
      wx.setStorageSync('data', specificdate)
      console.log('储存时间')
    }
    //判断有没有签到
    if (wx.getStorageSync('work') != '') {
      this.setData({
        work: wx.getStorageSync('work'),
        signin:false
      })
    }
    //判断有没有签退
    if (wx.getStorageSync('offwork') != '') {
      this.setData({
        offwork: wx.getStorageSync('offwork'),
        signin: false
      })
    }
    wx.getLocation({
      isHighAccuracy: true,
      success: (res) => {
        console.log(res)
        this.setData({
          latitude: res.latitude,//维度
          longitude: res.longitude//经度
        })
          var myAmapFun = new amapFile.AMapWX({ key: '5f6088c04bd6ed321f5b5f8def5d9e28' });
          myAmapFun.getRegeo({
            location: '' + res.longitude + ',' + res.latitude + '',//location的格式为'经度,纬度'
            success: (data) => {
              console.log(data[0]);
              this.setData({
                address: data[0]
              })
            },
            fail: (err) => {
              console.log(err)
            }
          });
        

      },
    })
    
    
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      specificdate: specificdate,
      options: options,
      request: false,
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    });
    setInterval(()=>{
      var time = getApp().globalData.formatTime(new Date()).substring(10,19);
      this.setData({
        time: time
      })
    },1000)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      remarksvalue: wx.getStorageSync('remarksvalue'),
      positionarr: wx.getStorageSync('positionarr'),//获取位置列表
      url: getApp().globalData.url,
      imgarr: wx.getStorageSync('imgarr'),//获取图片列表
    })
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
  remarksvalue(e){
    this.setData({
      remarksvalue:e.detail.value
    })
  }
})