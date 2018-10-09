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
    markNumber:'',
    flag:'true',
    //保险价格
    total_fee:'',
    //国内还是国外
    classtype:'',
  },
  //获取用户输入的被保人姓名
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //获取用户输入的身份证号
  userIdInput: function (e) {
    this.setData({
      userId: e.detail.value
    }) 
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
  //获取用户输入的航班号
  flightNoInput: function (e) {
    this.setData({
      flightNo: e.detail.value
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
  //获取用户输入的行李牌号码
  markInput: function (e) {
    this.setData({
      markNumber: e.detail.value
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
  paycheck: function (event) {

    var that = this;
    console.log(that.data.classtype);
    if (that.data.userName.length == 0 || that.data.userId.length == 0 || 
        that.data.flightNo.length == 0 || that.data.flightDate.length == 0 || 
        that.data.depCity.length == 0 || that.data.arrCity.length == 0 || 
      that.data.telNumber.length == 0 || that.data.telNumber == 'false'){
       wx.showToast({ title: '请完善表单信息！', icon: 'none', duration: 1500 }) 
    }else{
      that.pay(event);
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


  //下单'APPLYNAME': that.data.userName, 
 // 'APPLYNAME': that.data.userName, 'INSURANCECARDCODE': that.data.userId,
 // 'VOYNO': that.data.flightNo, 'EFFECTDATE': that.data.flightDate,
 // 'STARTPORT': that.data.depCity, 'ENDPORT': that.data.arrCity,

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
        'mark': that.data.markNumber,
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
      },
      'fail': function (res) {
        console.log('支付失败');
      }
    })
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
      classtype: options.classtype,
    })
    console.log(this.data.classtype);
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