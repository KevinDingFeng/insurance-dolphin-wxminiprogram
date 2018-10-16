// pages/order/writeOrder.js
const app = getApp()
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        xl_list: [
            {
                id: "1",
                name: "行李单号1",
                pack1: ""//单号
            },
            {
                id: "2",
                name: "行李单号2",
                pack1: ""//单号
            }
        ],//行李列表
        cb_name: "",
        items: [
            { name: '《投保须知》', value: '我同意', checked: false},
        ],
        //用户信息
        userInfo: {
            user_name: "",//姓名
            user_num: "",//身份证号
        },
        payInfo: {},
        //当前日期
        start: '',
        //用户输入下单信息
        userName: '',
        userId: '',
        flightNo: '',//航班号
        flightDate: '',//航班时间
        depCity: '',//始发站
        arrCity: '',//终点站
        telNumber: '',
        markNumber: [],
        pNo1: 0,
        pNo2: 0,
        pNo3: 0,
        pNo4: 0,
        pNo5: 0,
        flag: 'true',
        depCityCode: '',
        arrCityCode: '',
        //保险价格
        total_fee: '',
        //国内还是国外
        classtype: '',
        //行李个数
        packNum: 1,
        //页面显示价格
        showPrice: '',
    },
    //新增行李单号
    add_dh: function (e) {
        let that = this;
        let _arr = that.data.xl_list;
        let _num = String(_arr.length + 1)
        _arr.push(
            {
                id: _num,
                name: "行李单号" + (_arr.length + 1),
                pack1: ""
            }
        )
        this.setData({
            xl_list: _arr
        })
    },
    //点击证件类型
    open: function () {
        wx.showActionSheet({
            itemList: ["身份证"],
            success: function (res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
    },
    //获取用户输入的航班日期
    datePickerBindchange: function (e) {
        this.setData({
            flightDate: e.detail.value
        })
    },
    checkDate: function (e) {
        var time = util.formatTime(new Date());
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
    scanGetCity: function (e) {
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
        wx.request({
            url: config.baseUrl + '/customer/getFlight',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 'depCity': that.data.depCity, 'arrCity': that.data.arrCity },
            success: function (res) {
                var city_class = that.data.classtype;
                console.log(res);
                that.setData({
                    total_fee: res.data.data.total_fee,
                    showPrice: res.data.data.total_fee,
                    classtype: res.data.data.classtype
                })
                if (city_class != that.data.classtype) {
                    console.log('类型不相等');
                    if (that.data.classestype == '1') {
                        wx.showToast({
                            title: '此航班为国内航班，价格为国内航班行李险价格！',
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        wx.showToast({
                            title: '此航班为国际航班，价格为国际航班行李险价格！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            },


        })
    },
    //扫描获取用户输入的行李牌号码
    scanPackage1: function (event) {
        var that = this;
        wx.scanCode({
            scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
            success: function (res) {
                var _xl_list = that.data.xl_list;//行李信息
                let _num = 0;
                for (var i = 0; i <= _xl_list.length; i++) {
                    if (_xl_list[i].pack1 == "") {
                        _xl_list[i].pack1 = res.result;
                        _num = i + 1
                        break;
                    } else if (_xl_list[_xl_list.length-1].pack1!=""){
                        _num = _xl_list.length;
                        wx.showToast({
                            title: '请添加行李单！',
                            icon: 'none',
                            duration: 1500
                        })
                        break;
                    }
                }
                that.setData({
                    xl_list: _xl_list,
                    showPrice: _num * that.data.total_fee,// 
                })

            }
        })
    },
    //手动输入行李牌
    p1blur: function (e) {
        var that = this;
        let _cc = that.data.xl_list;
        let _val = e.detail.value;
        if (_val == ""){
            wx.showToast({
                title: '行李单号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        let _index = e.currentTarget.dataset.index;
        let _num = 0;
        for (let i = 0; i < _cc.length; i++) {
            if ( _index - 1 != 0 && _cc[_index - 1].pack1 == ""){
                wx.showToast({
                    title: '请先添加上一个行李单！',
                    icon: 'none',
                    duration: 1500
                })
                break;
            }
           else if (_cc[i].pack1 !="" ){
                _num = _num+1;
            }else if (_cc[i].id == _index) {
                _cc[i].pack1 = _val;
                _num = _num + 1;
                break;
            } else if (_cc[_cc.length-1].pack1!=""){
                _num = _cc.length;
                wx.showToast({
                    title: '请添加行李单！',
                    icon: 'none',
                    duration: 1500
                })
                break;
            }
        }
        
        that.setData({
            xl_list: _cc,
            showPrice: _num * that.data.total_fee,// 
        })
        // this.setData({
        //     pack1: e.detail.value
        // })
        // if (e.detail.value != '') {
        //     this.setData({
        //         pNo1: 1 
        //     })
        //     var num = parseInt(that.data.pNo1) + parseInt(that.data.pNo2) + parseInt(that.data.pNo3) + parseInt(that.data.pNo4) + parseInt(that.data.pNo5);
        //     that.setData({
        //         packNum: num,
        //     })
        //     that.setData({
        //         showPrice: that.data.packNum * that.data.total_fee,
        //     })

        // } else {
        //     this.setData({
        //         pNo1: 0
        //     })
        //     var num = parseInt(that.data.pNo1) + parseInt(that.data.pNo2) + parseInt(that.data.pNo3) + parseInt(that.data.pNo4) + parseInt(that.data.pNo5);
        //     if (num == 0) {
        //         that.setData({
        //             packNum: 1,
        //         })
        //     } else {
        //         that.setData({
        //             packNum: num,
        //         })
        //     }

        //     that.setData({
        //         showPrice: that.data.packNum * that.data.total_fee,
        //     })
        // }
    },
    //个人信息验证
    peo_name_Blur: function (e) {
        let that =this;
        let _name = e.detail.value;
        
        let _num = that.data.userInfo.user_num;//身份证号
        if (_name == "") {
            wx.showToast({
                title: '姓名不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                userInfo:{
                    user_name: _name,
                    user_num: _num
                }
            })
        }
    },
    peo_num_Blur:function(e){
        let that = this;
        let _num = e.detail.value;
        let _name = that.data.userInfo.user_name;//姓名
        if (_num == "") {
            wx.showToast({
                title: '身份证号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                userInfo: {
                    user_name: _name,
                    user_num: _num
                }
            })
        }
    },
    //航班信息验证
    hb_num_Blur: function (e) {
        let that = this;
        let hb_num = e.detail.value;//航班号
        if (hb_num == "") {
            wx.showToast({
                title: '航班号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                flightNo: hb_num
            })
        }
    },
    hb_time_Blur: function (e) {
        let that = this;
        let hb_time = e.detail.value;//航班时间
        if (hb_time == "") {
            wx.showToast({
                title: '航班日期不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        }else{
            that.setData({
                flightDate: hb_time
            })
        }
    },
    hb_sf_Blur: function (e) {
        let that = this;
        let hb_f = e.detail.value;//始发站
        if (hb_f == "") {
            wx.showToast({
                title: '始发站不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                depCity: _name
            })
        }
    },
    hb_zd_Blur: function (e) {
        let that = this;
        let hb_z = e.detail.value;//终点站
        if(hb_z == "") {
            wx.showToast({
                title: '终点站不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                arrCity: _name
            })
        }
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
                duration: 1500
            })
            this.setData({
                flag: false
            })
        } else {
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
        wx.request({
            url: config.baseUrl + '/pay/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'openid': openId,
                'applyname': that.data.userInfo.user_name,
                'applycardcode': that.data.userInfo.user_num,
                'saildate': that.data.flightDate,
                'voyno': that.data.flightNo,
                'startport': that.data.depCity,
                'endport': that.data.arrCity,
                'orderAmount': that.data.showPrice,
                //'insuranttel': that.data.telNumber,
                'classestype': that.data.classtype,
                'markString': that.data.xl_list,
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
    instructions: function () {
        wx.navigateTo({
            url: '/pages/instructions/instructions'
        })
    },
    //投保须知状态
    checkboxChange:function(e){
        let _val = e.detail.value;
        if (_val[0] =="false"){
            _val[0] = "true"
        }else{
            _val[0] = "false"
        }
        this.setData({
            items: [
                { name: '《投保须知》', value: '我同意', checked: _val[0] },
            ],
        })
    },
    //去投保
    go_zf:function(e){
        var that = this;
        let _name = that.data.userInfo.user_name;//姓名
        let _num = that.data.userInfo.user_num;//身份证号
        let hb_f = that.data.depCity;//始发站
        let hb_z = that.data.arrCity;//终点站
        let hb_num = that.data.flightNo;//航班号
        let hb_time = that.data.flightDate;//航班时间
        let _cl_arr = that.data.xl_list;//行李单号
        let _checked = that.data.items[0].checked;//投保通知
        
        //人员信息
        if (_name == ""){
            wx.showToast({
                title: '姓名不能为空!',
                icon: 'none',
                duration: 1500
            })
            return;
        }  
        if (_num == ""){
            wx.showToast({
                title: '身份证号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        }
        //航班信息
        if (hb_num == "") {
            wx.showToast({
                title: '航班号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } 
        if (hb_time == "") {
            wx.showToast({
                title: '航班日期不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } 
        if (hb_f == "") {
            wx.showToast({
                title: '始发站不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } 
        if (hb_z == "") {
            wx.showToast({
                title: '终点站不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        }
        if (_cl_arr[0].pack1 ==""){
            wx.showToast({
                title: '请输入行李单号!',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        //是否勾选《投保须知》
        if (_checked == false) {
            wx.showToast({
                title: '请勾选《投保须知》!',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        if (wx.getStorageSync('openId') != null) {
            that.order(wx.getStorageSync('openId'));
        } else {
            console.log('缓存数据中不存在openId');
        }
    },
    // formSubmit: function (e) {
    //     var that = this;
    //     console.log(e.detail.value);
    //     that.setData({
    //         'markNumber[0].mark': e.detail.value.mark1,
    //         'markNumber[1].mark': e.detail.value.mark2,
    //         'markNumber[2].mark': e.detail.value.mark3,
    //         'markNumber[3].mark': e.detail.value.mark4,
    //         'markNumber[4].mark': e.detail.value.mark5,
    //         userName: e.detail.value.userName,
    //         userId: e.detail.value.userId,
    //         flightDate: e.detail.value.flightDate,
    //         flightNo: e.detail.value.flightNo,
    //         depCity: e.detail.value.depCity,
    //         arrCity: e.detail.value.arrCity,

    //     })
    //     console.log(that.data.arrCity.length);
    //     if (e.detail.value.length == 0 || e.detail.value.length == 0 ||
    //         that.data.flightNo.length == 0 || that.data.flightDate.length == 0 ||
    //         that.data.depCity.length == 0 || that.data.arrCity.length == 0 ||
    //         that.data.telNumber.length == 0 || that.data.flag == 'false') {
    //         wx.showToast({ title: '请完善表单信息！', icon: 'none', duration: 1500 })
    //     } else {
    //         if (wx.getStorageSync('openId') != null) {
    //             that.order(wx.getStorageSync('openId'));
    //         } else {
    //             console.log('缓存数据中不存在openId');
    //         }
    //     }

    //     console.log(that.data.markNumber);
    // },
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