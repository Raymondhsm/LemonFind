// pages/setup/setup.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    match:true,
    message:true
  },

  Match:function(e){
    this.setData({
      match:e.detail.value
    })
    var that = this;

    qcloud.request({
      url: `${config.service.host}/weapp/setup`,
      login: true,
      method: "GET",
      data: {
        action: 1,
        skey: session.get(),
        match: that.data['match'],
        message: that.data['message']
      },
      success(result) {
        console.log(result.data);
      },
    })
  },

  Message: function (e) {
    this.setData({
      message: e.detail.value
    })

    var that = this;

    qcloud.request({
      url: `${config.service.host}/weapp/setup`,
      login: true,
      method: "GET",
      data: {
        action: 1,
        skey: session.get(),
        match: that.data['match'],
        message: that.data['message']
      },

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;

    qcloud.request({
      url: `${config.service.host}/weapp/setup`,
      login: true,
      method: "GET",
      data:{
        action:0,
        skey:session.get()
      },

      success(result) {
        that.setData({
          match:result.data['match']==1?true:false,
          message:result.data['message']==1?true:false
        })
      },

      fail(error) {
        util.showModel('获取设置失败了哎', error);
      }
      
      })
  },



})