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
    foreignPrice:'20',
    innerPrice:'10',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.redirectTo({
      url: '/pages/logs/logs'
    })
  },
  //跳转至保险详情说明页面
  to_detail_inner: function (e) {
    wx.navigateTo({
      url: '/pages/detail/showDetail?price=' + this.data.innerPrice
    })
  },
  to_detail_foreign: function (e) {
    wx.navigateTo({
      url: '/pages/detail/showDetail?price=' + this.data.foreignPrice
    })
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
  }
})
