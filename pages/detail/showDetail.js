// pages/detail/showDetail.js
const app = getApp()
var config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:'',
  },

  //跳转至下保单页面
  to_insured: function (e) { 
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    if (e.detail.errMsg == "getUserInfo:ok") {
      if (!app.globalData.userInfo || !wx.getStorageSync('userId')) {
        //获取用户数据
        app.login();
      }
      wx.navigateTo({
        url: '/pages/order/writeOrder?price='+this.data.price
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      price: options.price,
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