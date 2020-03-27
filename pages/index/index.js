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
  },
  Change() {
    let loc = app.i18n.locales
    let curLang = wx.getStorageSync('curLang')
    let lang = curLang == loc.zhCn ? loc.uighur : loc.zhCn
    app.i18n.setLocale(lang)
    app.i18n.resetSetData(this)
    this.selectComponent('#com').ChangeLang()

    this.setData({
      ValStr: app.i18n.replace('checkCount', {
        checkCount: 5
      }, this)
    })
  }
})