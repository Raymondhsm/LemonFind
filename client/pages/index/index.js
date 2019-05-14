var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    stayPickNotice: true,//当前停留在哪个页面
    showHistory: false,
    history: [],
    searchKey: '',
    goodsTypeOptions: ['饭卡', '钱包', '手机','证件','U盘','雨伞','耳机','水瓶','书本','衣物','其他'],
    goodsColorOptions: ['蓝色', '绿色', '白色','黑色','红色','黄色','橙色','紫色','粉色','透明','彩色','其他'],
    showSort: false,
    typeOptions: [false, false, false, false, false, false, , false, false, false, false, false],//考虑初始化时再复制
    colorOptions: [false, false, false, false, false, false, false, false, false, false, false, false],
    avatarUrl: '',
    noticeList: [],
    imgUrl: [],
    hasKey: false
  },
  //{{stayLost? :"selected"}}
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(app.globalData.check_sKey){
      console.log(app.globalData.check_sKey)
      this.getNotices();

    }
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      console.log('callback')
      this.getNotices()
    }
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
    this.setData({
      'history': wx.getStorageSync('history')
    })
    this.getNotices();//考虑功效要不要onshow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  onPullDownRefresh: function() {
    this.getNotices()
    setTimeout(function () { wx.stopPullDownRefresh() },2000)
  },

  /*获取Notice*/
  getNotices: function() {
    wx.showNavigationBarLoading()
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/goodsInfo`,
      login: true,
      method: "GET",
      data: {
        skey: session.get(),
        loseOrPick: that.data.stayPickNotice ? 'pick' : 'lost',
        hasKey: that.data.hasKey
      },
      success(res) {
        if (res.statusCode == 200) {
          console.log(res)
          console.log(res.data)
          var noticeList = res.data.message;
          console.log(noticeList.length)
          for (var i = 0; i < noticeList.length; i++) {
            noticeList[i].images = JSON.parse(noticeList[i].images);
            noticeList[i].color = JSON.parse(noticeList[i].color);
            noticeList[i].user_info = JSON.parse(noticeList[i].user_info);
          }
                    //考虑把名称，颜色，品牌合起来一个标签数组弄好
          that.setData({
            noticeList: noticeList,
          })
        }
      },
      complete(res) {
        wx.hideNavigationBarLoading() //完成停止加载
      }
    })
  },


  save: function () {
    wx.setStorageSync('history', this.data.history);
  },

  inputSearch: function (event) {
    this.setData({
      searchKey: event.detail.value
    })
  },

  showPickNotice: function () {
    if(!this.data.stayPickNotice){
      this.setData({
        stayPickNotice: true
      })
      this.getNotices();
      this.clearSelections()
    }
  },

  showLoseNotice: function () {
    if (this.data.stayPickNotice) {
      this.setData({
        stayPickNotice: false
      })
      this.getNotices();
      this.clearSelections()
    }
  },

  //考虑一下点击除了输入框在焦点态时显示历史搜索，点击搜索的历史，不展示，删除历史，继续展示；
  showHistory: function () {
    if (this.data.history.length == 0) return;//或者在wxml中设置
    this.setData({
      'showHistory': true
    })
  },

  hideHistory: function () {
    this.setData({
      'showHistory': false
    })
  },

  onSearch: function () {
    if (!this.data.searchKey || !this.data.searchKey.trim()) return;
    //判断是否在历史中已存在
    var history = this.data.history;
    var existed = history.indexOf(this.data.searchKey)
    if (existed != -1) {
      //放到第一位，其他依次后退
      var newitem = history[existed];
      history.splice(existed, 1)
      history.unshift(newitem);
    }
    else {
      history.unshift(this.data.searchKey);//放到第一位
      if (history.length > 6) history.pop();
    }
    this.setData({
      history: history
    })
    this.save()

    //发送筛选给服务器
    var color_selected=[];
    var goods_selected=[];
    for (var i = 0; i < this.data.goodsColorOptions.length;i++){
      if (this.data.colorOptions[i]){
        color_selected.push(this.data.goodsColorOptions[i]);
        console.log(this.data.goodsColorOptions[i]);
        this.data.hasKey=true;
      }
    }
    for (var i = 0; i < this.data.goodsTypeOptions.length; i++) {
      if (this.data.typeOptions[i]){
        goods_selected=this.data.goodsTypeOptions[i];
        console.log(this.data.goodsTypeOptions[i]);
        this.data.hasKey = true;
      }
    }
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/goodsInfo`,
      login: true,
      method: "GET",
      data: {
        skey: session.get(),
        loseOrPick: that.data.stayPickNotice ? 'pick' : 'lost',
        hasKey: that.data.hasKey,
        color_selected: color_selected,
        goods_selected: goods_selected
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          console.log(res.data)
          var noticeList = res.data.message;
          for(var i=0;i<noticeList.length;i++){
            noticeList[i].images= JSON.parse(noticeList[i].images);
            noticeList[i].color = JSON.parse(noticeList[i].color);
          }

          var user_info = JSON.parse(res.data.user_info)
          that.setData({
            noticeList: noticeList,
            user_info: user_info
          })
        }
      },

    })
    // wx.uploadFile({
    //   url: config.service.uploadUrl,
    //   filePath: '/images/磷叶石.jpg',
    //   name: 'file',

    //   success: function (res) {
    //     if (res.statusCode == 200) {
    //       util.showSuccess('上传图片成功')
    //       res = JSON.parse(res.data)
    //       that.data.imgUrl.push(res.data.imgUrl)
    //       that.setData({
    //         imgUrl: that.data.imgUrl
    //       }),
    //       wx.request({
    //         url: `${config.service.host}/weapp/message`,
    //         data: {
    //           nickname: '呜咕',
    //           tags: 'card',
    //           color: 'blue',
    //           brand: 'thinkpad',
    //           description: 'lost, wish to come back',
    //           images: that.data.imgUrl,
    //           time: "",
    //           location: 'first canteen'
    //         },
    //         success: function (res) {
    //           if (res.statusCode == 200) {
    //             console.log(res)
    //             console.log(res.data)
    //             console.log(res.data.images)
    //           }
    //         }
    //       })
    //     }
    //   },

    //   fail: function (e) {
    //     util.showModel('上传图片失败')
    //   }
    // })

   
  },

  searchByHistory: function (event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      'showHistory': false,
      'searchKey': this.data.history[index]
    })

    //然后根据索引的item去传递给服务器搜索关键字
  },

  removeItem: function (event) {
    var index = event.currentTarget.dataset.index;
    var history = this.data.history;//防止setData之前数据不一致。
    history.splice(index, 1);
    this.setData({
      'history': history,
      'showHistory': true
    })
    this.save()
  },

  switchTypeSelected: function (event) {
    var Options = this.data.typeOptions;
    var selected=-1;//-1代表没有选中
    for(var i=0;i<Options.length;i++){
      if(Options[i]){
        selected=i;
        break;
      }
    }
    var index = event.currentTarget.dataset.index;
    if(selected==-1){
      Options[index] = true;
      this.setData({
        typeOptions: Options
      })
    }
    else if(index==selected){
      Options[index] = false;
      this.setData({
        typeOptions: Options
      })
    }
  },

  switchColorSelected: function (event) {
    var Options = this.data.colorOptions;
    var index = event.currentTarget.dataset.index;
    var selected=[];
    for(var i=0;i<Options.length;i++){
      if(Options[i])
        selected.push(i)
    }
    if (selected.indexOf(index)!=-1)
        Options[index] = false;
    else if(selected.length<3)
      Options[index] = true;
    this.setData({
      colorOptions: Options
    })
  },

  showSort: function () {
    this.setData({ showSort: true })
  },

  hideSort: function () {
    this.setData({ showSort: false })
  },

  clearSelections: function () {
    var typeOptions = this.data.typeOptions;
    var colorOptions = this.data.colorOptions;
    for (var i = 0; i < typeOptions.length; i++)
      typeOptions[i] = false
    for (var i = 0; i < colorOptions.length; i++)
      colorOptions[i] = false
    this.setData({
      typeOptions: typeOptions,
      colorOptions: colorOptions
    })
    this.data.hasKey=false;
  },

  confirmSelections: function () {
    this.setData({ showSort: false});

    var color_selected = [];
    var goods_selected = '';
    for (var i = 0; i < this.data.goodsColorOptions.length; i++) {
      if (this.data.colorOptions[i]) {
        color_selected.push(this.data.goodsColorOptions[i]);
        console.log(this.data.goodsColorOptions[i]);
        this.data.hasKey = true;
      }
    }
    for (var i = 0; i < this.data.goodsTypeOptions.length; i++) {
      if (this.data.typeOptions[i]) {
        goods_selected = this.data.goodsTypeOptions[i];
        console.log(this.data.goodsTypeOptions[i]);
        this.data.hasKey = true;
        break;
      }
    }
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/goodsInfo`,
      login: true,
      method: "GET",
      data: {
        'skey': session.get(),
        'loseOrPick': that.data.stayPickNotice ? 'pick' : 'lost',
        'color_selected': color_selected,
        'goods_selected': goods_selected,
        'hasKey': that.data.hasKey
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          console.log(res)
          console.log(res.data)
          var noticeList = res.data.message;
          for (var i = 0; i < noticeList.length; i++) {
            noticeList[i].images = JSON.parse(noticeList[i].images);
            noticeList[i].color = JSON.parse(noticeList[i].color);
            noticeList[i].user_info = JSON.parse(noticeList[i].user_info);
          }
          that.setData({
            noticeList: noticeList,
          })
        }
      },
      complete: function () {
        that.data.hasKey = false;
        console.log(that.data.hasKey)
      }
})},
  getDetails: function(event) {
    // console.log('../comment/comment?m_id=' + (this.data.noticeList[event.currentTarget.dataset.index]).id + '&pick=' + this.data.stayPickNotice)
    wx.navigateTo({
      url: '../comment/comment?m_id=' + (this.data.noticeList[event.currentTarget.dataset.index]).id+'&pick='+ this.data.stayPickNotice
    })
  }

})


