// pages/building/building.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markerId: 1,
    introArea: true,
    showTipsArea: false,
    isLike:false,
    likeNum:0,
    likePicIndex:null
  },
  likeClick(e){
    console.log(e);
    
    if(this.data.isLike)
    {
      var likeNum = this.data.likeNum
      likeNum--
      this.setData({
        isLike:false,
        likeNum
      })
    }
    else
    {
      var likeNum = this.data.likeNum
      likeNum++
      this.setData({
        isLike:true,
        likeNum
      })
    }
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
    console.log(app.globalData.markerId, app.globalData.desLatitude, app.globalData.desLongtitude)
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