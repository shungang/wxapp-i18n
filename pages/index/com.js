// pages/index/com.js
const app = getApp();
const i18n = app.i18n

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    demo: i18n.get('我知道了')
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    app.i18n.resetSetData(this)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
