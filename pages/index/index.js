//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://pptdown.pptbz.com/pptbeijing/%E7%AE%80%E7%BA%A6%E9%A3%8E%E6%A0%BC%E5%88%9B%E6%84%8F%E5%B0%8F%E6%B8%85%E6%96%B0%E5%9B%9B%E5%8F%B6%E8%8D%89PPT%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.jpg',
      'http://pic1.win4000.com/wallpaper/0/5832b69176bcf.jpg',
      'http://img5.imgtn.bdimg.com/it/u=3253414561,3360165866&fm=27&gp=0.jpg'
    ],
    location: '',
    county: '',
    today: '',
    weatherData: '',
    dress: '',
    air: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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

    //定位当前城市
    this.getLocation();
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        console.log(res)
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
          success: function(res) {
            console.log(res)            
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;

            that.setData({
              location: app.globalData.defaultCity,
              county: app.globalData.defaultCounty
            })

            that.getWeather();
            that.getAir();
          }
        })
      }
    })
  },
  //获取天气
  getWeather: function() {
    var length = this.data.location.length;
    var city = this.data.location.slice(0,length - 1);
    var that = this;
    var param = {
      key: app.globalData.heWeatherKey,
      location: city
    }
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/weather",
      data :param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {

        console.log(res)
        app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
        var weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
        var dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : { txt: "暂无该城市天气信息" };
        that.setData({
          weatherData: weatherData, //今天天气情况数组 
          dress: dress //生活指数
        });
      }
    })
  },
  getAir: function() {
    var length = this.data.location.length;
    var city = this.data.location.slice(0, length - 1);
    var that = this;
    var param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    wx.request({
      url: app.globalData.heWeatherBase + '/s6/air/now',
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        app.globalData.air = res.data.HeWeather6[0].status == 'unknown city' ? '' :res.data.HeWeather6[0].air_now_city;
        that.setData({
          air: app.globalData.air
        })
      }
    })
  },
  //跳转到天气页面
  gotoWeather: function() {
    wx.navigateTo({
      url: '../weather/weather',
    })
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: "你好啊",
      desc: '小程序',
      success: function() {
        wx.showToast({
          title: '分享成功',
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})
