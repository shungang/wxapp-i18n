import uighur from './uighur.js'

const StorKey = 'curLang'
let locales = {
  uighur: 'uighur',
  zhCn: 'zhCn'
}
let curLang = wx.getStorageSync(StorKey)
if (!curLang) {
  curLang = locales.zhCn //默认中文
  wx.setStorage({
    key: StorKey,
    data: curLang
  })
}

// 处理简体中文  '确认要删除这{{checkCount}}种商品吗？' + sp + 'م شىلىۋى{{checkCount}}تېس ىسىۋر',
let setSpKey = function(obj, key) {
  let val = obj[key]
  if (key != 'sp' && val.includes(uighur.sp)) {
    let vals = val.split(uighur.sp)
    return vals[0] + uighur.sp + vals[0]
  }
  if (key == 'sp')
    return val
  return key
}
let zhCn = {}
for (let key in uighur) {
  let obj = uighur[key]
  if (typeof obj == 'string') {
    let val = setSpKey(uighur, key)
    zhCn[key] = val //简体中文，键与值 是一样的
  } else {
    //处理第二层 对象
    let temp = {}
    for (let objKey in obj) {
      let val = setSpKey(obj, objKey)
      temp[objKey] = val
    }
    zhCn[key] = temp
  }
}
// console.log(zhCn)
module.exports = {
  locale: curLang, // 默认是维文，已简体中文为键
  locales: locales, //可选语言类别
  langs: {
    uighur,
    zhCn
  },
  registerLocale(langs) {
    this.langs = langs
  },
  setLocale(lang) {
    wx.setStorage({
      key: StorKey,
      data: lang
    })
    this.locale = lang
  },
  /**
   * 代理小程序的 setData，在更新数据后，翻译传参类型的字符串
   * @param {object} page 当前需要翻译的组件或页面
   */
  resetSetData(page) {
    let olang = this.langs[this.locale]
    let id = page.id
    if (!id && page.route) {
      let paths = page.route.split('/')
      id = paths[paths.length - 1]
    }

    let lang = Object.assign({}, olang)
    if (lang[id]) {
      let temp = lang[id]
      lang[id] = null //将二级对象提升到一级
      for (let key in temp) {
        if (typeof temp[key] == 'string')
          lang[key] = temp[key]
      }
    }
    // 去除多余的 字符串  避免 setData 数据量过大
    for (let key in lang) {
      if (typeof lang[key] == 'object')
        lang[key] = null
    }

    page.data.T = lang
    console.log('resetSetData 页面初始化' + id)

    //执行更新 绑定 所有语言key
    page.setData.call(page, page.data)
  },
  /**
   *  'checkCountStr': '确认要删除这{{checkCount}}种商品吗？' + sp + 'م شىلىۋى{{checkCount}}تېس ىسىۋر',
   */
  replace(key, data, page) {
    let list = page.data.T
    let sp = list['sp']
    let val = list[key]
    if (val) {
      // 处理 
      if (val.includes(sp))
        val = val.split(sp)[1]

      let res = val.replace(/\{\{[\s\w]+\}\}/g, x => {
        x = x.substring(2, x.length - 2).trim()
        return data[x];
      })

      return res
    }

    throw new Error(`语言处理错误：（${key}）`)
  },
  /**
   * 返回二选一类型的翻译结果
   * @param {string} key, /util/language/en.js 中的键名，如 "curslide"
   * @param {object} data, 传入的参数，如 {first: true} 选择前面的
   * @returns {string}
   *
   * @desc 如："sendprob": "Send | Check",
   *       sendprob 为 key，可以输入data {first: true}
   *       返回："Send"
   */
  select(key, data) {
    let locale = this.locale
    let langs = this.langs
    let val = locale && langs[locale] && langs[locale][key]

    if (val) {
      let res = val.split('|')[data.first ? 0 : 1].trim()
      return res
    }

    throw new Error(`select语言处理错误：（${key}）`)
  },
  // 递归查找所有
  get(key, obj) {
    let locale = this.locale
    let langs = this.langs
    let val = locale && langs[locale] && langs[locale][key]

    if (typeof val == 'string') {
      return val
    } else if (obj) {
      if (obj[key])
        return obj[key]
      else
        return null
    } else if (langs[locale]) {
      // 进行递归查找
      let lang = langs[locale]
      for (let okey in lang) {
        if (typeof lang[okey] == 'object') {
          let res = this.get(key, lang[okey])
          if (res)
            return res
        }
      }
    }

    throw new Error(`get语言处理错误：（${key}）`)
  }
}