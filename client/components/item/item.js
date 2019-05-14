// components/item/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: String,
      value: ""
    },

    nickname: {
      type: String,
      value: ""
    },
    avatar: {
      type: String,
      value: "../../images/磷叶石.jpg"
    },
    tags: {
      type: Array,
      value: ''
    },
    description: {
      type: String,
      value: '暂无详细描述'
    },
    location: {
      type: String,
      value: '暂无地点'
    },
    time: {
      type: String,
      value: '暂无时间'
    },
    imageList: {
      type: Array,
      value: [
        '../../images/1.jpg',
        '../../images/ngnl.jpg'
      ]
    }
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
    previewImg: function (event) {
      var src = event.currentTarget.dataset.src;
      wx.previewImage({
        current: src,
        urls: this.properties.imageList
 
      })
    }
  }
})
