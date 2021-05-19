// pages/message/message.js
import {
  db
} from '../../util/database/database'
let util = require('../../util/util.js')
let app = getApp()
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMessage: true,
    messageData: [],
    slideButtons: [{
      text: '删除',
      type: 'warn',
      //src: '/page/weui/cell/icon_love.svg', // icon的路径
    }],
  },
  enterMessage(e) {
    let index = parseInt(e.currentTarget.id)
    let message = this.data.messageData
    app.globalData.buildingSelected = message[index].activity
    wx.redirectTo({
      url: '../building/building',
    })
    this.setData({
      messageData: message
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 从后端获取messageData 数据
    let userFollowTagSet;
    let userFollowTime;
    let message = [];
    db.attention.getAttention(app.globalData.openid).then(res => {
      userFollowTagSet = new Set(res.tag)
      userFollowTime = res.time
      console.log("取得关注标点的信息", res)
    }).then(() => {
      db.point.getPointArray(app.globalData.campus._id).then(res => {
        res.forEach(point => {
          if (point.type == 'activity') {
            let pointTagSet = new Set(point.tag);
            console.log("取得关注标点的信息", pointTagSet)
            let start = new Date(point.time.start)
            start = {
              month: start.getMonth()
            }
            for (let item of pointTagSet) {
              
              let hasTime=userFollowTime.find((itm, index) => {
                
                return(itm.month == start.month)
                // && hasTime!=undefined
              })
              
              if (userFollowTagSet.has(item)  ) {

                let msgObj = {
                  src: CloudPathFront + point.desc.icon,
                  msg: point.desc.name,
                  activity: point
                }
                message.push(msgObj);
                
                this.setData({
                  messageData:this.data.messageData.concat(msgObj)
                })
                break;
              }
            }

          }
        })
      })


    })
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