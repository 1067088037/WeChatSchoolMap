//app.js
const qqMapWxSDK = require('./util/map/qqmap-wx-jssdk')

App({
  globalData: {
    userInfo: null, //用户信息
    qqMap: null, //腾讯位置服务实例
    db: null //数据库实例
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData.qqMap = new qqMapWxSDK({
      key: 'JUSBZ-OCPLX-TCA44-ZFJY3-5LIV5-UTBZM'
    })
    this.globalData.db = require('./util/database/database')
  }
})
