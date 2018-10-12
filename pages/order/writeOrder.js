// pages/order/writeOrder.js
const app = getApp()
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo: {},
    payInfo: {},
    //当前日期
    start: '',
    //用户输入下单信息
    userName: '',
    userId:'',
    flightNo:'',
    flightDate: '',
    depCity:'',
    arrCity:'',
    telNumber:'',
    markNumber:[],
    pack1:'',
    pack2:'',
    pack3:'',
    pack4:'',
    pack5:'',
    flag:'true',
    depCityCode:'',
    arrCityCode:'',
    //保险价格
    total_fee:'',
    //国内还是国外
    classtype:'',
    //行李个数
    packNum:1,
    //页面显示价格
    showPrice: '',
  },


  //获取用户输入的航班日期
  datePickerBindchange: function (e) {
    this.setData({
      flightDate: e.detail.value
    })
  },
  checkDate: function (e) {
    var time = util.formatTime(new Date());
    console.log(time);
  },
  //获取用户输入的起点和终点信息
 
  startInput: function (e) {
    this.setData({
      depCity: e.detail.value
    })
  },

  endInput: function (e) {
    this.setData({
      arrCity: e.detail.value
    })
  },
 
  //输入航班号获取起点和终点信息
  getCity: function (e) {
    let that = this;
    wx.request({
      url: config.baseUrl + '/customer/flight',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'flightNo': that.data.flightNo, 'flightDate': that.data.flightDate },
      success: function (res) {
        console.log(res.data.data.depCity);
        that.setData({
          depCity: res.data.data.depCity,
          arrCity: res.data.data.arrCity
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '输入的航班号有误！',
          icon: 'none',
          duration: 1500
        })
      }

    })
  },
  //扫描获取航班号和城市的起点和终点
  scanFlight: function () {
    var that = this;
    console.log("进入扫描");
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        that.setData({
          passResult: res.result,
        })
        console.log(that.data.passResult);
        var dateList = that.data.passResult.split(" ");
        var arr = [];
        for (var i in dateList) {
          if (dateList[i].length != 0) {
            arr = arr.concat(dateList[i]);
            console.log(arr);
          }
        }
        var flight = arr[2] + arr[3];
        var startCity = arr[2].substring(0, 3);
        var endCity = arr[2].substring(3, 6);
        var flightNum = flight.substring(6, 12);
        that.setData({
          flightNo: flightNum,
          depCityCode: startCity,
          arrCityCode: endCity,
        })
        that.scanGetCity();
      }
    })
  },
  scanGetCity: function(e) {
    let that = this;
    wx.request({
      url: config.baseUrl + '/customer/getFlight',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'depCityCode': that.data.depCityCode, 'arrCityCode': that.data.arrCityCode, 'cityType': that.data.classtype },
      success: function (res) {
        console.log(res);
        that.setData({
          depCity: res.data.data.depCity,
          arrCity: res.data.data.arrCity,
         // total_fee: res.data.data.total_fee,
        })
      },

    })
  },

  //获取价格
  getPrice: function (e) {
    var that = this;
    console.log(that.data.depCityCode);
    wx.request({
      url: config.baseUrl + '/customer/getFlight',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'depCity': that.data.depCity, 'arrCity': that.data.arrCity},
      success: function (res) {
        console.log(res);
        that.setData({
          total_fee: res.data.data.total_fee,
        })
        console.log(that.data.total_fee);
      },
     

    })
  },
  //扫描获取用户输入的行李牌号码
  scanPackage1: function (event) {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result);
        that.setData({
          pack1 : res.result,
          packNum: that.data.packNum+1,
          showPrice: that.data.packNum*that.data.total_fee,
        })
        console.log(that.data.packNum)
      }
    })
  },
  scanPackage2: function (event) {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result);
        that.setData({
          pack2: res.result,
          packNum: that.data.packNum + 1,
          showPrice: that.data.packNum * that.data.total_fee,
        })
      }
    })
  },
  scanPackage3: function (event) {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result);
        that.setData({
          pack3: res.result,
          packNum: that.data.packNum + 1,
          showPrice: that.data.packNum * that.data.total_fee,
        })
      }
    })
  },
  scanPackage4: function (event) {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result);
        that.setData({
          pack4: res.result,
          packNum: that.data.packNum + 1,
          showPrice: that.data.packNum * that.data.total_fee,
        })
      }
    })
  },
  scanPackage5: function (event) {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result);
        that.setData({
          pack5: res.result,
          packNum: that.data.packNum + 1,
          showPrice: that.data.packNum * that.data.total_fee,
        })
      }
    })
  },
  //获取用户输入的手机号
  telNumberInput: function (e) {
    this.setData({
      telNumber: e.detail.value
    })
  },
  // 表单手机号验证
  blurPhone: function (e) {
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value)) {
      wx.showToast({ 
        title: '手机号有误！', 
        icon: 'none', 
        duration: 1500 })
      this.setData({
        flag: false
      })
    }else{
      this.setData({
        flag: true
      })
    } 
  },

  //点击支付按钮，获取openId，将openId传给下单方法
  pay: function (event) {
    var that = this;
    if (app.globalData.openId != null) {
      that.order(app.globalData.openId);
    } else {
      app.login();
    }
  },


  //下单

  order: function (openId) {
    console.log(openId);
    var that = this;
    console.log(that.data.classtype);
    wx.request({
      url: config.baseUrl + '/pay/order',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': openId, 
        'applyname':that.data.userName,
        'applycardcode':that.data.userId,
        'saildate':that.data.flightDate,
        'voyno':that.data.flightNo,
        'startport':that.data.depCity,
        'endport':that.data.arrCity,
        'markString': that.data.markNumber,
        'amount': that.data.total_fee, 
        'insuranttel': that.data.telNumber,
        'classestype': that.data.classtype,
      },
      success: function (res) {
        that.requestPayment(res.data);
      }
    })
  },
 
  //申请支付
  requestPayment: function (obj) {
    console.log(obj);
    var that = this;
    wx.requestPayment({
      'timeStamp': obj.data.timeStamp,
      'nonceStr': obj.data.nonceStr,
      'package': obj.data.package,
      'signType': obj.data.signType,
      'paySign': obj.data.paySign,
      'success': function (res) {
        console.log('支付成功');
        wx.navigateTo({
          url: '/pages/success/success'
        })
      },
      'fail': function (res) {
        console.log('支付失败');
      }
    })
  },
  /**
   * 投保须知页面跳转
   */
  instructions: function() {
    wx.navigateTo({
      url: '/pages/instructions/instructions'
    })
  },

  formSubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      'markNumber[0].mark': e.detail.value.mark1,
      'markNumber[1].mark': e.detail.value.mark2,
      'markNumber[2].mark': e.detail.value.mark3,
      'markNumber[3].mark': e.detail.value.mark4,
      'markNumber[4].mark': e.detail.value.mark5,
      userName: e.detail.value.userName,
      userId: e.detail.value.userId,
      flightDate: e.detail.value.flightDate,
      flightNo: e.detail.value.flightNo,
      depCity: e.detail.value.depCity,
      arrCity: e.detail.value.arrCity,
      
    })
    console.log(that.data.arrCity.length);
    if (e.detail.value.length == 0 || e.detail.value.length == 0 ||
      that.data.flightNo.length == 0 || that.data.flightDate.length == 0 ||
      that.data.depCity.length == 0 || that.data.arrCity.length == 0 ||
      that.data.telNumber.length == 0 || that.data.flag == 'false') {
      wx.showToast({ title: '请完善表单信息！', icon: 'none', duration: 1500 })
    } else {
      if (app.globalData.openId != null) {
        that.order(app.globalData.openId);
      } else {
        app.login();
      }
    }

    console.log(that.data.markNumber);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
    var _date = util.formatDate(new Date());
    that.setData({
      start: _date
    })
    that.setData({
      total_fee: options.price,
      showPrice: options.price,      
      classtype: options.classtype,
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