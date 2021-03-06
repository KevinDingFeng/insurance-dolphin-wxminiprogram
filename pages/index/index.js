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
        
        foreignType: '2',
        
        innerType: '1',
        //登机牌信息
        passResult: '',
    },
    //事件处理函数
    bindViewTap: function () {
        wx.redirectTo({
            url: '/pages/logs/logs'
        })
    },
    //跳转至保险详情说明页面
    to_detail_inner: function (e) {
        wx.showModal({
            title: '正在建设中，敬请期待...',
            content: '功能正在建设中，敬请期待...',
            showCancel: false,
            // success: function (res) {
            //     if (res.confirm) {
            //         console.log('用户点击确定')
            //     }
            // }
        });

        // wx.navigateTo({
        //   url: '/pages/detail/showDetail?price=' + this.data.innerPrice+'&classtype='+this.data.innerType
        // })
    },
    to_detail_foreign: function (e) {
        wx.navigateTo({
            url: '/pages/detail/showDetail'
        })
    },
    //扫描
    scan: function () {
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
                var arr = []
                for (var i in dateList) {
                    if (dateList[i].length != 0) {
                        arr = arr.concat(dateList[i]);
                        console.log(arr);
                    }
                }
                var flight = arr[2] + arr[3];
                var startCity = arr[2].substring(0, 3);
                var endCity = arr[2].substring(3, 6);
                var flightNo = flight.substring(6, 12);
            }
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
