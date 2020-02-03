// pages/approval/add-approval/add-approval.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lenMore: 0,
    imgs: [],
    cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    startdate: '请选择开始日期',
    enddate: '请选择结束日期',
    array1: [],
    array2: ['病假', '其他假', '探亲假', '异常请假说明', '事假', '年休假', '出差'],
    array3: [],
    array4: [],
    text1: '请选择流程',
    text2: '请选择类型',
    text3: '', //请输入出差/请假天数
    text4: '', //详细内容
    text5: '添加审批人',
    text6: '添加抄送人',
    text5id: '',
    userid: '',
    flowid:'',
    flowName:'',
    ares:[],
    fileAttaches:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //选择开始与结束日期
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startdate: e.detail.value
    })
  },
  bindDateChangeEnd: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: e.detail.value
    })
  },
  //选择流程
  bindPickerChange1(e) {
    var arr=this.data.ares
    console.log('picker发送选择改变，携带值为', e.detail.value)
    for(var i=0;i<arr.length;i++){
      arr[i].index=i
      if(arr[i].index==e.detail.value){
        console.log(arr[i])
        this.setData({
          flowid: arr[i].flowid,
          flowName: arr[i].flowName,
        })
      }
    }
    this.setData({
      text1: this.data.array1[e.detail.value]
    })
  },
  bindPickerChange2(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      text2: this.data.array2[e.detail.value]
    })
  },
  bindPickerChange3(e) {
    console.log(this.data.array)
    console.log('picker发送选择改变，携带值为', e.detail)
    for (var i = 0; i < this.data.array3.length; i++) {
      this.data.array3[i].index = i
      console.log(this.data.array3[i].index)
      if (this.data.array3[i].index == e.detail.value) {
        this.setData({
          text5id: this.data.array3[i].USERID
        })

      }
    }
    console.log(this.data.text5id)

    this.setData({
      text5: this.data.array3[e.detail.value].USERNAME
    })
  },
  bindPickerChange4(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      text6: this.data.array4[e.detail.value]
    })
  },
  //上传照片
  chooseImg: function(e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function() {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var that = this
        var imgs = that.data.imgs;
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.url+ '/file-upload', //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            cookie: this.data.cookies,
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
          },
          formData: {
            'user': 'test', //其他额外的formdata，可不写
            'file_cat': 'APP_APPLY'

          },
          success: (res) => {
            console.log(res)
            console.log(JSON.parse(res.data).fileId);
            var fileId = JSON.parse(res.data).fileId
            if (this.data.fileAttaches == '') {
              console.log('为空')
              this.setData({
                fileAttaches: fileId
              })
            } else {
              console.log('不为空')
              this.setData({
                fileAttaches: this.data.fileAttaches + ',' + fileId
              })
            }

          },
          fail: function(res) {
            console.log(res);

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
  previewImg: function(e) {
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
  onLoad: function(options) {
    console.log(options)
    this.setData({
      cookies: decodeURIComponent(wx.getStorageSync('cookies')), //解码cookie
    })

    wx.request({
      url: getApp().globalData.url + '/terminal/queryFlow.do?',
      data: {
        tmessage: {
          'query': {
           
          }
        }

      },
      header: {
        cookie: this.data.cookies
      },
      method: 'get',
      success: (res) => {
        console.log(res)
        var ress = res.data.info.result[0]
        var ares = res.data.info.result
        var arr = []
        var text = ''
        
        for (var i = 0; i < ares.length; i++) {
          var resss = ares[i]
          var text1 = ''
          text1 = text1 + ares[i].flowName
          for (var a = 0; a < resss.nodeSet.length; a++) {
            text = text1+ '-' + resss.nodeSet[a].nodeName
          }
          arr.push(text)
        }
        console.log(arr)
        this.setData({
          array1: arr,

        })
        this.setData({
          ares:ares
          // flowid: ress.flowid,
          // flowName: ress.flowName,
        })
        
      }
    })
    if (this.data.addresschose) {
      wx.request({
        url: getApp().globalData.url + '/terminal/queryUsersRepair.do?',
        data: {
          tmessage: {
            'query': {
              'userName': ''
            }
          }
        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          var s = this.data.addresschose;
          // var ss = s.split(","); // 在每个逗号(,)处进行分解  ["abc", "abcd", "aaa"]
          console.log(s)
          var ress = res.data.info.result
          var text = ''
          var text1=''
          for (var i = 0; i < ress.length; i++) {
            for (var a = 0; a < s.length; a++) {
              if (ress[i].USERID == s[a]) {
                console.log(ress[i])
                text = text + ress[i].USERNAME + ','
                text1 = text1 + ress[i].USERID + ','
                this.setData({
                  text6: text,
                  userid: text1
                })
              }
            }

          }
        }
      })
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
    this.onLoad()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  chucha(e) {
    this.setData({
      text3: e.detail.value
    })
  },
  xiangxi(e) {
    this.setData({
      text4: e.detail.value
    })
  },
  cclist(e) {
    console.log(e)
    if (this.data.flowid!=''){
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      wx.navigateTo({
        url: './CClist/CClist?id=' + e.currentTarget.dataset.id +'&flowid='+this.data.flowid
      })
      wx.hideLoading()
    }else{
      wx.showToast({
        title: '请先选择流程',
        icon:'none',
        duration: 2000
      })
    }
    
  },
  tijiao() {
    var that=this.data
    if (that.flowid != '' && that.flowName != '' && that.text2 != '' 
      && that.text3 != '' && that.text4 != '' && that.text5id != ''
      && that.startdate != '' && that.enddate != '' && that.userid != ''){
      console.log(this.data)
      var time = getApp().globalData.formatTime(new Date());
      var specificdate = time.substring(0, 10)
      var specificdate = specificdate.replace('/', '-')
      var specificdate = specificdate.replace('/', '-')
      wx.request({
        url: getApp().globalData.url + '/terminal/applyFlow.do?',
        data: {
          tmessage: {
            'userId': wx.getStorageSync('user').userId, // 用户ID
            'applyDt': specificdate,// 申请日期
            'flowId': this.data.flowid,//引用流程ID
            'flowName': this.data.flowName, //流程名称
            'flowType': this.data.text2, //流程类型
            'content': this.data.text4, //申请内容
            'days': this.data.text3, //出差 / 休假天数
            'chkUserId': this.data.text5id,//下一级审核人ID
            'startinDate': this.data.startdate,
            'endinDate': this.data.enddate,
            'copyUserIds': this.data.userid,
            'fileAttaches': this.data.fileAttaches
          }

        },
        header: {
          cookie: this.data.cookies
        },
        method: 'get',
        success: (res) => {
          console.log(res)
          wx.showToast({
            title: '操作成功',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../approval'
            })
          }, 2000)
          
        }
      })
    }else{
      wx.showToast({
        title: '请填写完整信息',
        icon:'none',
        duration: 2000
      })
    }
    
  }
})