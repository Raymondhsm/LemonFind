// pages/component/sign.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:""
    },

    name:{
      type:String,
      value:""
    },

    mode:{
      type:String,
      value:"show"
    },

    width:{
      type:String,
      value:"150px"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeSign: function () {
      this.triggerEvent('deleteSign');
    },
    IsSelect: function () {
      this.triggerEvent('beSelected')
    }
  }
})
