const { db } = require("../../util/database/database")

// pages/posterArea/posterArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //海报数组
    //海报：用户头像，发布时间，活动名称，活动海报，活动简介（内容）
    postArray: [],
    avatarUrl: [],//发送人头像
    number: 0//海报数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //从数据库中请求海报的数据
    db.poster.getPosterBySchoolId('1ace8ef160901b1b008f69ae08b0ee8a').then(res => {
      that.setData({
        postArray: res.data
      })
      let postArray = Array.from(that.data.postArray);
      var avatarUrl = that.data.avatarUrl
      postArray.forEach(function (post, index) {
        db.user.getUser(post.sender).then(senderInfo => {
          console.log(senderInfo)
          avatarUrl[index] = senderInfo.userInfo.avatarUrl
          console.log(index)
          that.setData({
            avatarUrl: avatarUrl
          })
        })
      })
    })
    //console.log("onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("onready")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log("onShow")
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