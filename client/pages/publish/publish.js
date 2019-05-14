// pages/publish/publish.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')


var action;
const Pick = 0;
const Lose = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnPick: 'btnSelect',
    btnLose: 'btnNotSelect',
    btnCondition: 'pick',

    option: "goods",
    colorCounter: 2,
    mode: ["show", "show", "show", "show", "show", "show", "show", "show", "show", "show", "show", "show"],

    value: [],              //用于储存select标签内容
    colorValue: [],
    width: [],
    index: [],
    imagePath: [],

    noneValue:'',

    goodsSigns: [{ value: '饭卡', width: '150rpx' }, { value: '钱包', width: '150rpx' }, { value: '证件', width: '150rpx' }, { value: 'U盘', width: '150rpx' }, { value: '雨伞', width: '150rpx' }, { value: '耳机', width: '150rpx' }, { value: '水瓶', width: '150rpx' }, { value: '书本', width: '150rpx' }, { value: '衣物', width: '150rpx' }, { value: '电子设备', width: '150rpx' }, { value: '其他', width: '150rpx' }],

    colorSigns: [{ value: '蓝色', width: '70px' }, { value: '绿色', width: '70px' }, { value: '白色', width: '70px' }, { value: '黑色', width: '70px' }, { value: '红色', width: '70px' }, { value: '黄色', width: '70px' }, { value: '橙色', width: '70px' }, { value: '紫色', width: '70px' }, { value: '粉色', width: '70px' }, { value: '透明', width: '70px' }, { value: '彩色', width: '70px' }, { value: '其他', width: '70px' }],
    colorSignsArray: ['蓝色', '绿色', '白色', '黑色', '红色', '黄色', '橙色', '紫色', '粉色', '透明', '彩色', '其他',]

  },

  tapPick: function (e) {
    action = Pick;
    this.setData({
      btnPick: 'btnSelect',
      btnLose: 'btnNotSelect',
      btnCondition: 'pick'
    })
  },

  tapLose: function (e) {
    action = Lose;
    this.setData({
      btnPick: 'btnNotSelect',
      btnLose: 'btnSelect',
      btnCondition: 'lost'
    })
  },

  deleteSign: function (e) {
    var moded = this.data.mode;
    var indexd = this.data.index;
    var valued = this.data.value;
    var colorValued = this.data.colorValue;

    var id = e.currentTarget.id;
    valued[id] = null;

    var options;
    if (id == 0) options = "goods";
    else if (id == 1) options = "brand";
    else if (id >= 2) options = "color";

    if (id >= 2) {
      var listIndex = this.data.colorSignsArray.indexOf(colorValued[e.currentTarget.dataset.index]);
      moded[listIndex] = "show";

      colorValued.splice(e.currentTarget.dataset.index, 1);
      valued.splice(e.currentTarget.dataset.index + 2, 1);
    }

    this.setData({
      mode: moded,
      value: valued,
      option: options,
      colorValue: colorValued
    })

    if (id >= 2) this.setData({ colorCounter: (this.data.colorCounter - 1) })
  },

  beSelected: function (e) {
    var moded = this.data.mode;
    var indexd = this.data.index;
    var valued = this.data.value;
    var widthd = this.data.width;
    var detail;
    var indexs;                                      //获取当前目标索

    var option;
    switch (this.data.option) {
      case "goods":
        option = 0;
        detail = e.currentTarget.dataset.detail;
        valued[0] = detail['value'];
        widthd[0] = detail['width'];
        break;
      case "brand":
        option = 1;
        valued[1] = e.detail.value['brand'];
        widthd[1] = "150px";
        break;
      case "color":
        option = this.data.colorCounter;
        indexs = e.currentTarget.dataset.index;
        detail = e.currentTarget.dataset.detail;
        valued[option] = detail['value'];
        widthd[option] = detail['width'];
        indexd[option] = indexs;
        if (moded[indexs] == "tap" && option >= 2) return;
        moded[indexs] = "tap";
        break;
    }

    var options = this.data.option;
    if (options == "goods" && valued[1] == null) options = "brand";
    else if (options == "goods" && option < 4) options = "color";
    else if (options == "goods") options = "";
    else if (options == "brand" && option < 4) options = "color";
    else if (options == "brand") option = "";
    else if (option < 4) options = "color";
    else options = "";

    this.setData({
      mode: moded,
      value: valued,
      width: widthd,
      index: indexd,
      option: options
    })

    if (option >= 2) this.setData({
      colorCounter: (option + 1),
      colorValue: valued.slice(2, option + 1)
    })
  },

  remarkTap: function (e) {
    this.setData({
      option: ""
    })
  },

  addPhoto: function (e) {
    var imagePathed = this.data.imagePath;
    var length = this.data.imagePath.length;
    var that = this;
    wx.chooseImage({
      count: 3 - length,

      success: function (res) {
        for (var i = length; i < length + res.tempFilePaths.length; i++) {
          imagePathed[i] = res.tempFilePaths[i - length];
        }
        that.setData({
          imagePath: imagePathed
        })
      },
    })
  },

  preview: function (e) {
    var that = this;
    wx.previewImage({
      urls: [that.data.imagePath[e.currentTarget.dataset.index]],
    })
  },

  deleteImage: function (e) {
    var imagePathed = this.data.imagePath;
    imagePathed.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imagePath: imagePathed
    })
  },

  tapGoods: function (e) {
    this.setData({
      option: "goods"
    })
  },

  tapBrand: function (e) {
    this.setData({
      option: "brand"
    })
  },

  tapColor: function (e) {
    this.setData({
      option: "color"
    })
  },

  publish:function(form_id,remark,position,imageUrl){
    var that=this;
    qcloud.request({
      url: `${config.service.host}/weapp/publish`,
      login: true,
      method: "GET",
      data: {
        skey: session.get(),
        form_id: form_id,
        // goods_id: goodsid,
        condition: that.data.btnCondition,
        goods: that.data.value[0],
        brand: that.data.value[1],
        color: that.data.colorValue,
        description:remark,
        images: imageUrl,
        position: position
      },

      success(result) {
        console.log(result.data);
        util.showSuccess('发布成功')
        that.clear();
      },

      fail(error) {
        util.showModel('发布失败了哎', error);
      }
    })
  },


  submit: function (e) {
    console.log(e);
    var that = this;
    var imageUrl = [];
    var count=0;
    if (!that.data.imagePath.length) that.publish(e.detail['formId'],e.detail.value['remark'],e.detail.value['position'],imageUrl);
    for (var i = 0; i < that.data.imagePath.length; i++) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: that.data.imagePath[i],
        name: 'file',

        success: function (res) {
          res = JSON.parse(res.data)
          console.log(res)
          imageUrl[count++] = res.data.imgUrl;//此处不能用i，否则会有本地路径
          if(count==that.data.imagePath.length){
            that.publish(e.detail['formId'],e.detail.value['remark'], e.detail.value['position'],imageUrl);
          }
          
        },
        fail: function (e) {
          util.showModel('上传图片失败')
        }
      })
    }

    //生成唯一的物品ID
    // var goodsid = Number(Math.random().toString().substr(6, 60) + Date.now()).toString(36);

    
  },

  clear:function(){
    this.setData({
      btnPick: 'btnSelect',
      btnLose: 'btnNotSelect',
      btnCondition: 'pick',

      option: "goods",
      colorCounter: 2,
      mode: ["show", "show", "show", "show", "show", "show", "show", "show", "show", "show", "show", "show"],

      value: [],              //用于储存select标签内容
      colorValue: [],
      width: [],
      index: [],
      imagePath: [],
      noneValue:""
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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