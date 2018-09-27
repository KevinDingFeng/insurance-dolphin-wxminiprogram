//index.js
//获取应用实例
const app = getApp()
var config = require('../../utils/config.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
    scale: app.globalData.windowWidth / app.globalData.windowHeight,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.redirectTo({
      url: '/pages/logs/logs'
    })
  },
  my_to: function (e) {
    var _this = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      if (!app.globalData.userInfo || !wx.getStorageSync('userId')) {
        //获取用户数据
        app.login();
      }
      wx.redirectTo({
        url: '/pages/myWriting/myWriting',
      })
    }
  },
  my_fq: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    if (e.detail.errMsg == "getUserInfo:ok") {
      if (!app.globalData.userInfo || !wx.getStorageSync('userId')) {
        //获取用户数据
        app.login();
      }
      wx.redirectTo({
        url: '/pages/order/writeOrder',
      })
    }
  },
  onLoad: function () {
    console.log(app.globalData)
    console.log(this.data.canIUse)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    let that = this;
    let title_ = config.onShareAppMessageTitle[Math.floor(Math.random() * config.onShareAppMessageTitle.length)];
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title_,
      path: '/pages/index/index',
    }
  },
})
