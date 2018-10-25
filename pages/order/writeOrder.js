// pages/order/writeOrder.js
const app = getApp()
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var name_reg = /^[\u0391-\uFFE5]+$/; //姓名中文验证
var phone_reg = /^[1][0-9][0-9]{9}$/;//手机号码正则
var sf_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isfull: false,//背景遮盖层
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        paye_width: `width: ${app.globalData.width};`,
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
            { checked: false },
        ],
        //用户信息
        user_name: "",
        user_num: "",
        payInfo: {},
        //当前日期
        start: '',
        //用户输入下单信息
        userName: '',
        userId: '',
        flightNo: '',//航班号
        flightDate: null,//航班时间
        depCity: '',//始发站
        arrCity: '',//终点站
        telNumber: '',
        markNumber: [],
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
        //原价
        del_price:"",
        state:true,
        remind:1,
        _num:"1"
    },
    //新增行李单号
    add_dh: function (e) {
        let that = this;
        that.data.state = true;
        let _arr = that.data.xl_list;
        if (_arr[_arr.length-1].pack1==""){
            wx.showToast({
                title: '请先添加上一个行李单！',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        let _num = String(_arr.length + 1);
        if (_arr.length == 5) {
            wx.showToast({
                title: '最多添加5个行李单',
                icon: 'none',
                duration: 2000
            })
        } else {
            _arr.push(
                {
                    id: _num,
                    name: "行李单号" + (_arr.length + 1),
                    pack1: ""
                }
            )
        }
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

    //扫描获取航班号和城市的起点和终点
    scanFlight: function () {
        var that = this;
        console.log("进入扫描");
        wx.scanCode({
            scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
            success: function (res) {
                console.log(res);
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

                if (arr[2] != undefined) {

                    var flight = arr[2] + arr[3];
                    var startCity = arr[2].substring(0, 3);
                    var endCity = arr[2].substring(3, 6);
                    var flightNum = flight.substring(6, 12);
                    console.log('航班信息截取成功');
                    that.setData({
                        flightNo: flightNum,
                        depCityCode: startCity,
                        arrCityCode: endCity,
                    })

                    that.scanGetCity();
                } else {
                    wx.showToast({
                        title: '二维码错误，请选择手动输入',
                        icon: 'none',
                        duration: 2000
                    })
                }

            },
            fail: function (res) {
                wx.showToast({
                    title: '扫描失败，请选择手动输入',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    scanGetCity: function (e) {
        let that = this;
        console.log('根据扫描结果获取城市');
        wx.request({
            url: config.baseUrl + '/customer/getFlight',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 'depCityCode': that.data.depCityCode, 'arrCityCode': that.data.arrCityCode, 'cityType': that.data.classtype },
            success: function (res) {
                console.log(res);
                if (res.data.data.total_fee == '00' || res.data.data.total_fee == '01') {
                    wx.showToast({
                        title: '二维码错误，请选择手动输入',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    console.log(res.data.data.depCity);
                    console.log(res.data.data.arrCity);
                    var city_class = that.data.classtype;
                    that.setData({
                        depCity: res.data.data.depCity,
                        arrCity: res.data.data.arrCity,
                        total_fee: res.data.data.total_fee,
                        showPrice: that.data._num *res.data.data.total_fee,
                        del_price: res.data.data.del_price,
                        classtype: res.data.data.classtype
                    })
                  if (city_class != that.data.classtype) {
                    console.log('类型不相等');
                    if (res.data.data.classtype == '1') {
                      wx.showToast({
                        title: '此航班为国内航班，价格为国内航班行李险价格！',
                        icon: 'none',
                        duration: 3000
                      })
                    } else {
                      wx.showToast({
                        title: '此航班为国际航班，价格为国际航班行李险价格！',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  }
                }
            },

        })
    },

    //获取价格
    getPrice: function (e) {
        var that = this;
        var _depCity = that.data.depCity;
        var _arrCity = that.data.arrCity;
        if (_depCity == "") {
            wx.showToast({
                title: '请输入始发站！',
                icon: 'none',
                duration: 3000
            })
        } else if (_arrCity == "") {
            wx.showToast({
                title: '请输入终点站！',
                icon: 'none',
                duration: 3000
            })
        } else {
            wx.request({
                url: config.baseUrl + '/customer/getPrice',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: { 'depCity': that.data.depCity, 'arrCity': that.data.arrCity },
                success: function (res) {
                    if (res.data.data.total_fee != '00' & res.data.data.total_fee != '01') {
                        console.log('城市结果返回' + res.data.data.total_fee);
                        console.log('城市结果返回' + res.data.data.arrCity);
                        console.log('城市结果返回' + res.data.data.depCity);
                        var city_class = that.data.classtype;
                        
                        that.setData({
                            total_fee: res.data.data.total_fee,
                            showPrice: that.data._num *res.data.data.total_fee,
                            del_price: res.data.data.del_price,
                            classtype: res.data.data.classtype,
                            depCity: res.data.data.depCity,
                            arrCity: res.data.data.arrCity,
                        })
                        console.log(city_class);
                        if (city_class != that.data.classtype) {
                            console.log('类型不相等');
                            if (res.data.data.classtype == '1') {
                                wx.showToast({
                                    title: '此航班为国内航班，价格为国内航班行李险价格！',
                                    icon: 'none',
                                    duration: 3000
                                })
                            } else {
                                wx.showToast({
                                    title: '此航班为国际航班，价格为国际航班行李险价格！',
                                    icon: 'none',
                                    duration: 3000
                                })
                            }
                        }
                    } else if (res.data.data.total_fee == '00') {
                        wx.showToast({
                            title: '始发站不存在！',
                            icon: 'none',
                            duration: 3000
                        })
                        that.setData({
                            depCity: '',
                        })
                    } else {
                        wx.showToast({
                            title: '终点站不存在！',
                            icon: 'none',
                            duration: 3000
                        })
                        that.setData({
                            arrCity: '',
                        })
                    }
                },
            })
        }

    },
    //扫描获取用户输入的行李牌号码
    scanPackage1: function (event) {
        var that = this;
        wx.scanCode({
            scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
            success: function (res) {
                var _xl_list = that.data.xl_list;//行李信息
                let _num = 0;
                let state = true;
                if (that.data.state == false) {
                    wx.showToast({
                        title: '请先增加一条行李单号！',
                        icon: 'none',
                        duration: 1500
                    })
                }
                for (var i = 0; i < _xl_list.length; i++) {
                    if (_xl_list[i].pack1 == "") {
                        _xl_list[i].pack1 = res.result;
                        break;
                    } 
                }
                for (var i = 0; i < _xl_list.length; i++) {
                    if (_xl_list[i].pack1 != "") {
                        _num = _num + 1;
                        state = false;
                    }else if(_xl_list[_xl_list.length-1].pack1 == ""){
                        state = true;
                    }
                }
                that.setData({
                    xl_list: _xl_list,
                    state: state,
                    _num:_num,
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
        let _index = e.currentTarget.dataset.index;//当前第几个
        let _num_cc = _cc.length;
        if (_val == "") {
            that.data.state = true;
            _cc[_index].pack1 = "";
            for (var i = 0; i < _cc.length; i++) {
                if (_cc[i].pack1 == "") {
                    _num_cc = _num_cc - 1;
                } 
            }
            if (_num_cc <= 0) {
                _num_cc = 1;
            }
            that.setData({
                xl_list: _cc,
                showPrice: _num_cc * that.data.total_fee,// 
            })
            wx.showToast({
                title: '行李单号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        let p_inde = parseInt(_index);
        let _p_inde = parseInt(_index) - 1;
        let _num = 0;
        for (var i = 0; i < _cc.length; i++) {
            if (i == _index) {
                _cc[i].pack1 = _val;
            }
            if (_cc[i].pack1 != "") {
                _num = _num + 1;
            }
        }

        that.setData({
            xl_list: _cc,
            _num: _num,
            showPrice: _num * that.data.total_fee,// 
        })
    },
    //个人信息验证
    peo_name_Blur: function (e) {
        let that = this;
        let _name = e.detail.value;
        let _num = that.data.user_num;//身份证号
        console.log(_name.length);
        if (_name == "") {
            wx.showToast({
                title: '姓名不能为空！',
                icon: 'none',
                duration: 1500
            })
            //return
        } else {
            that.setData({
                user_name: _name,
            })
        }
    },
    peo_num_Blur: function (e) {
        let that = this;
        let _num = e.detail.value;
        let _name = that.data.user_name;//姓名
        var sf_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号
        if (!sf_reg.test(_num)) {
            wx.showToast({
                title: '身份证号格式不正确！',
                icon: 'none',
                duration: 1500
            })
        } else if (_num == "") {
            wx.showToast({
                title: '身份证号不能为空！',
                icon: 'none',
                duration: 1500
            })
            //return
        } else {
            that.setData({
                user_num: _num
            })
        }
        return false;

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
        }
        that.setData({
            flightNo: hb_num
        })

    },
    hb_time_Blur: function (e) {
        let that = this;
        let hb_time = e.detail.value;//航班时间
        that.setData({
            flightDate: hb_time
        })
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
                depCity: hb_f
            })
        }
    },
    hb_zd_Blur: function (e) {
        let that = this;
        let hb_z = e.detail.value;//终点站
        if (hb_z == "") {
            wx.showToast({
                title: '终点站不能为空！',
                icon: 'none',
                duration: 1500
            })
            return
        } else {
            that.setData({
                arrCity: hb_z
            })
            that.getPrice();
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
        var myreg = /^[1][0-9][0-9]{9}$/;//手机号码正则
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
        console.log(that.data.telNumber);
        let _arr = that.data.xl_list;
        let c_arr = [];
        for (let i = 0; i < _arr.length; i++) {
            let _obj = {};
            _obj = {
                mark: _arr[i].pack1
            }
            if (_obj.mark == "") {

            } else {
                c_arr.push(_obj)
            }
        }
        wx.request({
            url: config.baseUrl + '/pay/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'openid': openId,
                'applyname': that.data.user_name,
                'applycardcode': that.data.user_num,
                'saildate': that.data.flightDate,
                'voyno': that.data.flightNo,
                'startport': that.data.depCity,
                'endport': that.data.arrCity,
                'orderAmount': that.data.showPrice,
                'insuranttel': that.data.telNumber,
                'classestype': that.data.classtype,
                "markString": c_arr
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
                that.setData({
                    isfull: true,
                })
                // wx.navigateTo({
                //     url: '/pages/success/success'
                // })
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
    checkboxChange: function (e) {
        let _val = e.detail.value;
        if (_val[0] == "false") {
            _val[0] = "true"
        } else {
            _val[0] =false
        }
        this.setData({
            items: [
                { name: '《投保须知》', value: '我同意', checked: _val[0] },
            ],
        })
    },
    //去投保
    go_zf: function (e) {
        var that = this;
        let _name = that.data.user_name;//姓名
        let _num = that.data.user_num;//身份证号
        let _phone = that.data.telNumber;//手机号
        let hb_f = that.data.depCity;//始发站
        let hb_z = that.data.arrCity;//终点站
        let hb_num = that.data.flightNo;//航班号
        let hb_time = that.data.flightDate;//航班时间
        let _cl_arr = that.data.xl_list;//行李单号
        let _checked = that.data.items[0].checked;//投保通知
        let _remind = that.data.remind;
        //人员信息
        if (_name == "") {
            wx.showToast({
                title: '姓名不能为空!',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        if (_num == "") {
            wx.showToast({
                title: '身份证号有误！',
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
        var state = false;
        for (let i = 0; i < _cl_arr.length;i++){
            if (_cl_arr[i].pack1 != ""){
                state = true;
                break;
            }
        }
        if (!state) {
          wx.showToast({
            title: '请输入行李单号!',
            icon: 'none',
            duration: 1500
          })
          return;
        }
        //手机验证
        var myreg = /^[1][0-9][0-9]{9}$/;//手机号码正则
        if (!myreg.test(_phone)) {
            wx.showToast({
                title: '手机号格式不正确！',
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
        console.log(_cl_arr[0].pack1);
        console.log(hb_time == null);
        if (_name == "" || !sf_reg.test(_num) || !myreg.test(_phone) || hb_f == "" || hb_z == "" || hb_num == "" ||
            _checked == false) {
            wx.showToast({
                title: '请完善表单信息!',
                icon: 'none',
                duration: 1500
            })
        } else {
            if (wx.getStorageSync('openId') != null) {
              if (_remind==1){
                wx.showModal({
                  title: '请确认填写信息全部正确!',
                  confirmText: "确定",
                  cancelText: "取消",
                  success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                      that.setData({
                        remind: 2,
                      })
                    } else {
                      that.order(wx.getStorageSync('openId'));
                    }
                  }
                })
               
              }else{
                that.order(wx.getStorageSync('openId'));
              }
            } else {
                console.log('缓存数据中不存在openId');
            }
        }

    },
    go_back: function () {
        wx.redirectTo({
            url: '/pages/index/index'
        })
    },
    //去投保须知
    go_notice: function () {
        wx.navigateTo({
            url: '/pages/notice/notice'
        })
    },
    //去投保须知
    go_protocol: function () {
        wx.navigateTo({
            url: '/pages/protocol/protocol'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var _date = util.formatDate(new Date());
        that.setData({
            start: _date,
            flightDate: _date
        })
        that.setData({
            total_fee: options.price,
            showPrice: options.price,
            classtype: options.classtype,
            del_price: options.del_price
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