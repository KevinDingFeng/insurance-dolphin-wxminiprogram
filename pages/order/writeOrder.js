// pages/order/writeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // text:"这是一个页面"
    picker1Value: 0,
    picker1Range: ['人民币', '美元', '欧元', '日元'],
    picker2Value: 0,
    picker2Range: ['木材类', '医药类', '电器类', '文体类'],
    picker3Value: 0,
    picker3Range: ['陆运', '海运', '空运', '邮包', '铁路'],
    picker4Value: 0,
    picker4Range: ['北京', '上海', '广州', '深圳'],
    picker5Value: 0,
    picker5Range: ['北京', '上海', '广州', '深圳'],
    picker6Value: 0,
    picker6Range: ['国内水陆综合险', '国内水陆基本险'],
    timeValue: '08:08',
    dateValue: '请选择您的起运日期',
  },
  normalPickerBindchange: function (e) {
    this.setData({
      picker1Value: e.detail.value
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