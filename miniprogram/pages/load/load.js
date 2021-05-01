// pages/load/load.js

const db = getApp().globalData.db

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  //如果成功获取用户信息则跳转到
  next: function () {
    if (getApp().globalData.userInfo != undefined)
      wx.switchTab({
        url: '../index/index'
      })
  },
  // 获取用户信息的函数
  getUserProfile(e) {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              db.users.setUserInfo(getApp().globalData.openid, res.userInfo)
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              getApp().globalData.userInfo = res.userInfo;
              console.log(getApp().globalData.userInfo)
              that.next();
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.users.getOpenId().then(openid => {
      getApp().globalData.openid = openid
      let tempUserInfo = db.users.getUserInfo(openid).then(res => {
        if (res != null) {
          console.log("用户信息获取成功")
          getApp().globalData.userInfo = res
          this.next()
        } else {
          console.log("用户信息为空")
          if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true,
            })
          }
        }
      }) //从服务器获取的用户信息
    })
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