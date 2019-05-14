// pages/comment/comment.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentArray:[],
    user_info: {},
    canReply:false,
    m_id:'',
    mode: '评论',
    tapIndex:0,
    focus:false,
    pick:true,
    goods:[],
    noneValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      m_id: options.m_id,
      pick:options.pick
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
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getComment`,
      login: true,
      method: "GET",
      data: {
        skey: session.get(),
        id:that.data.m_id,
        pick:that.data.pick
      },

      success(result) {
        console.log(result.data);
        var user_info = JSON.parse(result.data['user_info'])
        var goods = result.data['goods']
        goods.images=JSON.parse(goods.images)
        goods.color=JSON.parse(goods.color)
        var comments = result.data['data']
        for(var i=0;i<comments.length;i++){
          comments[i].user_info=JSON.parse(comments[i].user_info)
        }
        that.setData({
          goods:goods,
          commentArray: comments,
          canReply:result.data['canReply'],
          user_info: user_info
        })
      },

      fail(error) {
        util.showModel('加载失败了哎', error);
      }
    })
  },


  submit:function(e){
    console.log(e);
    if(this.data.mode=='评论'){
      var that = this;
      qcloud.request({
        url: `${config.service.host}/weapp/comment`,
        login: true,
        method: "GET",
        data: {
          skey: session.get(),
          action:'comment',
          id:that.data.m_id,
          message:e.detail.value['message'],
          pick:that.data.pick,
          form_id:e.detail['formId']
        },

        success(result) {
          console.log(result.data);
          that.setData({noneValue:""});
          that.onShow();
        },

        fail(error) {
          util.showModel('评论失败了哎', error);
        }
      })
    }else{
      var that = this;
      qcloud.request({
        url: `${config.service.host}/weapp/comment`,
        login: true,
        method: "GET",
        data: {
          skey: session.get(),
          action: 'reply',
          id: that.data.m_id,
          reply: e.detail.value['message'],
          c_id:that.data.commentArray[that.data.tapIndex]['c_id'],
          pick:that.data.pick,
          form_id: e.detail['formId']
        },

        success(result) {
          console.log(result.data);
          that.setData({ noneValue: "" });
          that.onShow();
        },

        fail(error) {
          util.showModel('回复失败了哎', error);
        }
      })
    }
  },

  reply:function(e){
    console.log(e);
    this.setData({
      focus:true,
      mode:"回复",
      tapIndex:e.currentTarget.dataset.index
    })
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