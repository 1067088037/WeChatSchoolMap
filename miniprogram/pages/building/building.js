// pages/building/building.js
const app = getApp();
var archArray = new Array;
import {
  Campus
} from '../../util/database/campus';
import {
  db
} from '../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markerId: 1,
    introArea: true,
    showTipsArea: false,
    showComment: false,
    isLike: false,
    likeNum: 0,
    likePicIndex: null,
    commentValue: null,
    intoComment: false
  },
  //获取用户输入的评论内容
  getComment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  //发表评论
  sendComment() {
    db.comment.addComment(1, Campus, {
      reply: null,
      text: this.data.commentValue,
      image: null
    })
  },

  likeClick(e) {
    console.log(e);

    if (this.data.isLike) {
      var likeNum = this.data.likeNum
      likeNum--
      this.setData({
        isLike: false,
        likeNum
      })
    } else {
      var likeNum = this.data.likeNum
      likeNum++
      this.setData({
        isLike: true,
        likeNum
      })
    }
  },
  intoCommentClick(e) {
    this.setData({
      showTipsArea: false,
      showComment: true
    })
  },
  /**
   * tipsAreaTap
   * @param e
   * @returns void
   * @todo 显示攻略区
   */
  tipsAreaTap(e) {
    this.setData({
      showTipsArea: true,
      introArea: false,
      // 测试数据tips,正常使用时应从数据库获取
      tips: [{
        src: "/images/tabBarIcon/design_selected.png"
      }, {
        src: "/images/tabBarIcon/design_selected.png"
      }, {
        src: "/images/tabBarIcon/design_selected.png"
      }, {
        src: "/images/tabBarIcon/design_selected.png"
      }, {
        src: "/images/tabBarIcon/design_selected.png"
      }]
    })

  }, // end function

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.globalData.markerId)
    if (app.globalData.markerId) {
      this.setData({
        markerId: app.globalData.markerId
      })
    }
    db.arch.getArchArray(app.globalData.campus._id).then(res => {
      console.log(res)
      res.forEach((value, index) => {
        archArray.push({
          id: value._id,
          latitude: value.geo.coordinates[1],
          longitude: value.geo.coordinates[0],
          type: value.type,
          title: value.name,
          width: 50,
          height: 50
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    db.comment.getAllComment('1').then(res => {
      console.log(res)
    })
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