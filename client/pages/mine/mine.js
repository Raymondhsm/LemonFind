//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    // userInfo: {
    //   'avatarUrl':'/images/default-avatar.png',
    //   'nickName':''
    // },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logged: true
  },

  

  onLoad: function () {
    this.setData({
      logged:app.globalData.logged,
      userInfo: app.globalData.userInfo
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况

    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
      //   }
      // })
    // }
  },

  login: function() {
    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.data.userInfo = result
          app.globalData.userInfo = result
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              app.globalData.userInfo = result.data.data
              that.data.userInfo = result
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },


  getUserInfo: function(e) {
    wx.getSetting({
      success: res => {
        //查看是否已经取得用户授权
        if (res.authSetting['scope.userInfo']){
          this.setData({
            userInfo: e.detail.userInfo,
            logged: true
          })
          app.globalData.logged=true;
          // app.globalData.userInfo = e.detail.userInfo
          this.login()
        }
        else {
          //拒绝授权，弹出模态窗口提示
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '登录失败，请重新授权登录哦',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  }
})
