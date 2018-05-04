var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    searchMethod: '酒店',
    bitmap: '',
    fail: '',
    success: '',
    selectState: [1,0,0],
    placeData: { title: '点击地图上的marker获得附近-酒店-信息' }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'NQzVC90BITYgHWit2dklZ1V2ALpXb6GY'
    })

    that.setData({
      bitmap: BMap
    })

    var fail = function(data) {
      console.log(data)
    };

    var success = function(data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude
      })
    }

    that.setData({
      fail: fail,
      success: success
    })

  },

  //点击地图标记时触发
  makertap: function(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id); 
  },

  showSearchInfo: function(data, id) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称： ' + data[id].title + '\n',
        address: '地址： ' + data[id].address + '\n',
        telephone: data[id].telephone == undefined ? '电话： 暂无信息' : '电话： ' + data[id].telephone
      }
    })
  },

  changeMarkerColor: function(data, id) {
    var that = this;
    var markersTemp = [];
    var length = data.length;
    for (var i = 0; i < length; i++) {
      if (i === id) {
        data[i].iconPath = "../../images/marker_yellow.png";
      } else {
        data[i].iconPath = "../../images/marker_red.png";
      }
      markersTemp.push(data[i]);
    }

    that.setData({
      markers: markersTemp
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
    this.data.bitmap.search({
      "query": this.data.searchMethod,
      fail: this.data.fail,
      success: this.data.success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/marker_red.png' 
    })
  },

  clickHotel: function() {
    this.setData({
      searchMethod: '酒店',
      selectState: [1,0,0],
      placeData: { title: '点击地图上的marker获得附近-酒店-信息' }
    })

    this.onShow();
  },

  clickFood: function () {
    this.setData({
      searchMethod: '美食',
      selectState: [0, 1, 0],
      placeData: { title: '点击地图上的marker获得附近-美食-信息' }
    })

    this.onShow();
  },

  clickService: function () {
    this.setData({
      searchMethod: '服务',
      selectState: [0, 0, 1],
      placeData: { title: '点击地图上的marker获得附近-服务-信息' }
    })

    this.onShow();
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