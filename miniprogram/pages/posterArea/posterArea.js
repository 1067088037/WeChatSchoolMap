const { db } = require("../../util/database/database")

// pages/posterArea/posterArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //海报数组
    //海报：用户头像，发布时间，活动名称，活动海报，活动简介（内容）
    //发送人
    postArray:[],
    sender: [],
    sendTime: [],//发送时间
    name: [],//活动名称
    images: [],//海报图片
    desc: [],//活动内容
    avatarUrl: [],//发送人头像
    number: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //从数据库中请求海报的数据
    db.poster.getPosterBySchoolId('1ace8ef160901b1b008f69ae08b0ee8a').then(res => {
      //let postList = Array.from(res.data);
      //   var postAll = res;
      //console.log(res);
      that.setData({
        postArray: res.data
      })
      // postList.forEach(post=>{
      //   //console.log(post.sender)
      //    db.user.getUser(post.sender).then(senderInfo=>{
      //      console.log(senderInfo.userInfo.avatarUrl);
      //      this.data.avatarUrl.push(senderInfo.userInfo.avatarUrl)
      //    })
      //   this.data.sendTime.push(post.sendTime)
      //   this.data.name.push(post.name)
      //   this.data.images.push(post.images[0])
      //   this.data.desc.push(post.desc)

      // // })
      // var sender = that.data.sender,
      //   sendTime = that.data.sendTime,
      //   name = that.data.name,
      //   images = that.data.images,
      //   desc = that.data.desc
      let postArray = Array.from(that.data.postArray);
      var avatarUrl = that.data.avatarUrl
      postArray.forEach(function (post, index) {
          db.user.getUser(post.sender).then(senderInfo => {
            //var avatarUrl = that.data.avatarUrl
            console.log(senderInfo)
            avatarUrl[index] = senderInfo.userInfo.avatarUrl
            console.log(index)
            that.setData({
              avatarUrl : avatarUrl
            })
          })
        }
      )
//           that.setData({
//             sender: sender,
//             sendTime: sendTime,//发送时间
//             name: name,//活动名称
//             images: images,//海报图片
//             desc: desc,//活动内容
//           })
//         //console.log(index);
//       }),
      
// senderList.forEach(function (item, index) {
    
//     var avatarUrl = that.data.avatarUrl
//     var n = index;
//     db.user.getUser(item).then(senderInfo => {
//       console.log(senderInfo.userInfo.avatarUrl);
//       avatarUrl[n] = senderInfo.userInfo.avatarUrl;
//     })
//     that.setData({
//       avatarUrl:post.avatarUrl
//     })
// })
        // this.setData({
        //     sender:post.sender,
        //     sendTime:post.sendTime,//发送时间
        //     name:post.name,//活动名称
        //     images:post.images,//海报图片
        //     desc:post.desc,//活动内容
        //     avatarUrl:post.avatarUrl,//发送人头像
        //   })
        //console.log(that.data.desc)
    })
    
console.log("onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
console.log("onready")

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

console.log("onShow")
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