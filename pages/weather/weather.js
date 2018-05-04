var app = getApp();
Page({
  data: {
    now: '',
    city: '',//城市
    district: '',//区
    forecast: '',//天气预报
    quality: '',//空气质量
    showday: ['今天','明天',''],
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  },

  onLoad: function() {
    var date = new Date();
    this.setData({
      'showday[2]': this.data.weekday[(date.getDay() + 2) % 7]
    })
  },

  onShow: function() {
    var that = this;
    var city = app.globalData.defaultCity.slice(0,2);
    that.setData({
      city: app.globalData.defaultCity,
      district: app.globalData.defaultCounty
    })

    that.getWeather();
  },

  getWeather: function() {
    this.setData({
      now: app.globalData.weatherData.now,
      forecast: app.globalData.weatherData.daily_forecast,
      quality: app.globalData.air
    })
  }
})