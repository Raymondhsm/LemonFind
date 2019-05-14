// pages/lostHistory/lostHistory.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //根据mine页面传入参数判断请求哪个表
    this.data.loseOrPick=(options.status==0?'lost':'pick');
    var title = options.status == 0 ? '失物记录' : '拾物记录'
    this.getNotices();
    wx.setNavigationBarTitle({
      title: title
    })
  },

  getNotices: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/history`,
      login: true,
      method: "GET",
      data: {
        skey: session.get(),
        loseOrPick: that.data.loseOrPick
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          var noticeList = res.data.message;
          var user_info = JSON.parse(res.data.user_info)
          // console.log(user_info)
          for (var i = 0; i < noticeList.length; i++) {
            noticeList[i].images = JSON.parse(noticeList[i].images);
            noticeList[i].color = JSON.parse(noticeList[i].color);
          }
          //考虑把名称，颜色，品牌合起来一个标签数组弄好
          that.setData({
            noticeList: noticeList,
            user_info: user_info
          })
        }
      }
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
    //this.getNotices();//在查看情况后，再次发布信息，历史页面还在栈内，再次显示应该更新页面。
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