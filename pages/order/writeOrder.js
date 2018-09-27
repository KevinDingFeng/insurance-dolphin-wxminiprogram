// pages/order/writeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // text:"这是一个页面"
    picker1Value: 0,
    picker1Range: ['北京', '上海', '广州', '深圳'],
    timeValue: '08:08',
    dateValue: '请选择您的起运日期',
  },
  normalPickerBindchange: function (e) {
    this.setData({
      picker1Value: e.detail.value
    })
  },
  timePickerBindchange: function (e) {
    this.setData({
      timeValue: e.detail.value
    })
  },
  datePickerBindchange: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  bindShowMsg() {
    if (this.data.select == false) {
      this.setData({ select: true })
    } else {
      this.setData({ select: false })
    }
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({ tihuoWay: name, select: false })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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