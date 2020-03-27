// pages/index/index.js
const app = getApp()
Page({
  data: {

  },
  onLoad() {
    app.i18n.resetSetData(this)
  },
  onShow() {
    this.setData({
      ValStr: app.i18n.replace('checkCount', {
        checkCount: 5
      }, this)
    })
  }
})