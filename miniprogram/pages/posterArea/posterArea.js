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
    attentionOrNot: [],//是否收藏
    imagesAttention: [],//显示哪一张图片
    number: 0//海报数量
  },
  attentionOrCancelAttention(e) {
    var that = this;
    //console.log(e)
    db.poster.getAttention(getApp().globalData.openid).then(res => {
      let attentionArray = Array.from(res)
      wx.showLoading({
        title: 'Loading...',
      })
      if (attentionArray.indexOf(e.currentTarget.id) != -1) {
        db.poster.removeAttention(getApp().globalData.openid, e.currentTarget.id).then(res => {
          if (!res.refuse) {
            console.log("取消收藏")
            db.poster.getAttention(getApp().globalData.openid).then(res2 => {
              let attentionArray2 = Array.from(res2)
              let postArr = Array.from(this.data.postArray)
              var attentionOrNotVar = this.data.attentionOrNot;
              var imagesAttentionVar = that.data.imagesAttention;
              postArr.forEach(function (post, index) {
                attentionOrNotVar[index] = (attentionArray2.indexOf(post._id) == -1) ? 0 : 1;
                imagesAttentionVar[index] = (attentionArray2.indexOf(post._id) == -1) ? "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect.png" : "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect_selected.png";
                console.log("foreach")
                that.setData({
                  attentionOrNot: attentionOrNotVar,
                  imagesAttention: imagesAttentionVar
                })
              })
              wx.hideLoading()
            })
          } else {
            wx.hideLoading()
          }
        })
      }
      else {
        db.poster.addAttention(getApp().globalData.openid, e.currentTarget.id).then(res => {
          if (!res.refuse) {
            // console.log("收藏")
            db.poster.getAttention(getApp().globalData.openid).then(res2 => {
              let attentionArray2 = Array.from(res2)
              let postArr = Array.from(this.data.postArray)
              var attentionOrNotVar = this.data.attentionOrNot;
              var imagesAttentionVar = that.data.imagesAttention;
              postArr.forEach(function (post, index) {
                attentionOrNotVar[index] = (attentionArray2.indexOf(post._id) == -1) ? 0 : 1;
                imagesAttentionVar[index] = (attentionArray2.indexOf(post._id) == -1) ? "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect.png" : "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect_selected.png";
                console.log("foreach")
                that.setData({
                  attentionOrNot: attentionOrNotVar,
                  imagesAttention: imagesAttentionVar
                })
              })
              wx.hideLoading()
            })
          } else wx.hideLoading()
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //从数据库中请求海报的数据
    db.poster.getPosterByCampusId(getApp().globalData.campus._id).then(res => {
      //console.log(res.data)
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
      console.log(getApp().globalData.openid)
      db.poster.getAttention(getApp().globalData.openid).then(resAtt => {
        console.log(resAtt)
        let attentionArray = Array.from(resAtt)
        //console.log(attentionArray)
        let postArr = Array.from(res.data)
        var attentionOrNotVar = that.data.attentionOrNot;
        var imagesAttentionVar = that.data.imagesAttention;
        postArr.forEach(function (post, index) {
          //console.log(attentionArray.indexOf(post._id))
          attentionOrNotVar[index] = (attentionArray.indexOf(post._id) == -1) ? 0 : 1;
          imagesAttentionVar[index] = (attentionArray.indexOf(post._id) == -1) ? "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect.png" : "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/Global/images/collect_selected.png";
          //console.log(that.data.attentionOrNot)
          that.setData({
            attentionOrNot: attentionOrNotVar,
            imagesAttention: imagesAttentionVar
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