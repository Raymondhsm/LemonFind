//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
  globalData: {
    check_sKey: false,//判断异步问题，登录前是否已经渲染index页面
    logged: true,
    userInfo: {
      'avatarUrl': '/images/default-avatar.png',
      'nickName': ''
    },
  },
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl);
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo

              util.showBusy('正在登录')
              var that = this

              // 调用登录接口
              qcloud.login({
                success(result) {
                  //必须在if和else里面都使用用一个回调操作，因为if是首次登录，else是已经都缓存
                  if (result) {
                    util.showSuccess('登录成功')
                    that.globalData.userInfo=result
                    that.globalData.check_sKey = true;
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(result)
                    }
                    console.log('hah')
                  } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                      url: config.service.requestUrl,
                      login: true,
                      success(result) {
                        util.showSuccess('登录成功')
                        that.globalData.userInfo=result.data.data
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        that.globalData.check_sKey=true;
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(result)
                        }
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
        }
        else {
          console.log('login false')
          this.globalData.logged=false;
          console.log(this.globalData.logged)
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }
      }
    })
  }

})