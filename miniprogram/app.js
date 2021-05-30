//app.js
const qqMapWxSDK = require('./util/map/qqmap-wx-jssdk')

App({
  globalData: {
    openid: null,      //用户开放识别码
    userInfo: null,    //用户信息
    qqMap: null,       //腾讯位置服务实例
    school: null,      //校园信息
    campus: null,      //校区信息
    buildingSelected: null, // 选中建筑对象
    archItem: [],
    versionCode: 68
  },
  onLaunch: function () {
    console.log('当前版本:', this.globalData.versionCode)
    //微信小程序用户及时更新到最新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本: ', + res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '提示',
        content: '检查到有新版本，但下载失败，请检查网络后重试',
        showCancel: false
      })
    })

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
  },

})
