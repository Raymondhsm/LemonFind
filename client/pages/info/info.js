// pages/info/info.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session=require('../../vendor/wafer2-client-sdk/lib/session.js')

var localSchool;
var localCollege;
var localName;
var localStudentID;
var localPhoneNumber;
var skey;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schFocus:true,
    colFocus:false,
    namFocus:false,
    idFocus:false,
    phoFocus:false,

    school:localSchool,
    college:localCollege,
    name:localName,
    studentID:localStudentID,
    phoneNumber:localPhoneNumber
  },

/*
*表单提交函数
*/
formSubmit:function(e){
  console.log(e.detail.value);
  util.showBusy('请求中...');
  var that = this;
  qcloud.request({
    url: `${config.service.host}/weapp/information`,
    login: true,
    method:"GET",
    data:{
      action:0,
      skey:session.get(),
      school:e.detail.value["school"],
      college:e.detail.value["college"],
      name:e.detail.value["name"],
      studentID:e.detail.value["studentID"],
      phoneNumber:e.detail.value["phoneNumber"]
    },

    success(result) {
      util.showSuccess('上传成功')
      console.log(result.data)
      //延时
      var back= function () {
        wx.navigateBack({})
      }
      setTimeout(back,1000)


    },
    fail(error) {
      util.showModel('上传失败');
      console.log('request fail', error);
    }
  })
  
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/information`,
      login:true,
      method:"GET",
      data:{
        action:1,
        skey:session.get()
      },

      success(result) {
        console.log(result)
        that.setData({
          school: result.data['school'],
          college: result.data['college'],
          name:result.data['name'],
        studentID: result.data['studentID'],
        phoneNumber: result.data['phoneNumber']
        })
      }
    })
  },

  inpSchool:function(e){
    console.log("qw")
    this.setData({
      schFocus: false,
      colFocus: true,
      namFocus: false,
      idFocus: false,
      phoFocus: false
    })
  },

  inpCollege:function(e){
    this.setData({
      schFocus: false,
      colFocus: false,
      namFocus: true,
      idFocus: false,
      phoFocus: false
    })
  },

  inpName:function(e){
    this.setData({
      schFocus: false,
      colFocus: false,
      namFocus: false,
      idFocus: true,
      phoFocus: false
    })
  },

  inpID:function(e){
    this.setData({
      schFocus: false,
      colFocus: false,
      namFocus: false,
      idFocus: false,
      phoFocus: true
    })
  },

})