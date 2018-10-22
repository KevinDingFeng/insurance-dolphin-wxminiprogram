// pages/detail/showDetail.js
const app = getApp()
var config = require('../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: 15,
        foreignPrice: '28',
        innerPrice: '15',
        innerclasstype: '',
        foreignclasstype:'',
        tabs: ["国内", "国际"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 128
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id, 
        });
       
        let _activeIndex = this.data.activeIndex;
        if (_activeIndex == "1"){
            this.setData({
                price: 28,
            });
        }else{
            this.setData({
                price: 15,
            });
        }
        
    },
    go_problem:function(e){
        wx.navigateTo({
            url: '/pages/problem/problem'
        })
    },
    //跳转至下保单页面
    to_insured: function (e) {
        if (e.detail.errMsg == "getUserInfo:ok") {
            if (!app.globalData.userInfo || !wx.getStorageSync('userId')) {
                console.log(app.globalData.userInfo);
                //获取用户数据
                app.login();
            }
            let _id = e.currentTarget.dataset;
            _id = Number(_id.id)
            this.setData({
                classtype: _id+1,
            });
            wx.navigateTo({
                url: '/pages/order/writeOrder?price=' + this.data.price + '&classtype=' + this.data.classtype
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            price: that.data.innerPrice,
            innerclasstype:'1',
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