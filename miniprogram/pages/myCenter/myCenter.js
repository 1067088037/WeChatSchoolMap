import { db } from "../../util/database/database"

// pages/myCenter/myCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    versionCode: -1,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    getUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      versionCode: getApp().globalData.versionCode
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    db.user.getUser(getApp().globalData.openid).then(res => {
      if (res.userInfo.nickName == undefined) {
        this.setData({
          getUserInfo: true
        })
      }
    })
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: "用于完善用户信息",
      success: res => {
        console.log(getApp().globalData.openid)
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          getUserInfo: false
        })
        db.user.setUserInfo(getApp().globalData.openid, res.userInfo)
        console.log("获取用户信息成功")
        getApp().globalData.userInfo.userInfo = res.userInfo
      }
    })
  },
  navigaTocreatasso(e) {
    if (db.user.checkIsLogin()) {
      wx.navigateTo({
        url: '../myCenter/myCenter/creatasso/creatasso',
      })
    }
  },
  navigaToMyasso(e) {
    if (db.user.checkIsLogin()) {
      wx.navigateTo({
        url: '../myCenter/myCenter/myasso/myasso',
      })
    }
  },
  navigaToJoin(e) {
    if (db.user.checkIsLogin()) {
      wx.navigateTo({
        url: './myCenter/join/join',
      })
    }
  },
  navigaToFocus(e) {
    wx.navigateTo({
      url: '../myCenter/myCenter/focus/focus',
    })
  },
  navigaToMyset(e) {
    wx.navigateTo({
      url: './myCenter/myset/myset',
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