// pages/message/message.js
import {
  db
} from '../../util/database/database'
let util = require('../../util/util.js')
let app = getApp()
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
let SCREEN_WIDTH = 750; // 屏幕宽度
let RATE = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapWidth: SCREEN_WIDTH,
    mapHeight: SCREEN_WIDTH * RATE,
    hasMessage: true,
    messageData: [],
    slideButtons: [{
      text: '删除',
      type: 'warn',
      //src: '/page/weui/cell/icon_love.svg', // icon的路径
    }],
    showAttentionPage:false,
    showLifeStrategiesPage:false,
    publishStrategyIds:[],
    publishStrategies:[],
    showLifeStrategyDetail:false,
    selectedLifeStrategy:null,
    showMap:false
  },
  navigaToAttentionPage(e){

  },
  navigaToLifeStrategiesPage(e){
    let publishStrategies = []
    this.data.publishStrategyIds.forEach(id=>{
      db.strategy.getStrategy(id).then(res=>{
        if(res.type == 'publish'){
          res.publish.content.forEach(con=>{
            con.images.forEach((im,index)=>{
              im = CloudPathFront+im;
              con.images[index] = im;
            })
          })
          let strategy = res.publish;
          strategy.id = res._id;
          publishStrategies.push(strategy)
        }
      }).then(()=>{
        this.setData({
          publishStrategies,
          showLifeStrategiesPage:true
        })
      })
    })
  },
  intoLifeStrategy(e){
    let id = e.currentTarget.id
    this.data.publishStrategies.forEach(strategy=>{
      if(strategy.id == id){
        this.setData({
          selectedLifeStrategy:strategy,
          showLifeStrategiesPage:false,
          showLifeStrategyDetail:true
        })
      }
    })
  },
  navigatoMark(e){
    let markers = []
    let mCampus = getApp().globalData.campus
    this.data.selectedLifeStrategy.content.forEach(con=>{
      let marker = {
        id : util.randomNumberId(),
        longitude:con.coordinates.longitude,
        latitude:con.coordinates.latitude,
        width:40,
        height:55,
        label:{content:con.name,bgColor:"#F0F8FF",anchorY:-60, fontSize:16, borderRadius:6}
      }
      markers.push(marker)
    })
    this.setData({
      markers,
      showMap:true,
      showLifeStrategyDetail:false,
      longitude: mCampus.geo.center.longitude,
      latitude: mCampus.geo.center.latitude
    })
  },
  returnToLifeStrategyDetail(e){
    this.setData({
      showMap:false,
      showLifeStrategiesPage:true,
      markers:[]
    })
  },
  returnToLifeStrategiesPage(e){
    this.setData({
      selectedLifeStrategy:{},
      showLifeStrategyDetail:false,
      showLifeStrategiesPage:true
    })
  },
  returnToHomePageFromSP(e){
    this.setData({
      publishStrategies:[],
      showLifeStrategiesPage:false
    })
  },
  navigaToAttentionPage(e){
    this.setData({
      showAttentionPage:true
    })
  },
  returnToHomePageFromAP(e){
    this.setData({
      showAttentionPage:false
    })
  },
  enterMessage(e) {
    let index = parseInt(e.currentTarget.id)
    let message = this.data.messageData
    app.globalData.buildingSelected = message[index].activity
    wx.switchTab({
      url:'../index/index'
    })
    this.setData({
      messageData: message
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mapCtx:wx.createMapContext('newMap', this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let superid = app.globalData.campus._id
    // 从后端获取messageData 数据
    let userFollowTagSet;
    let userFollowTime;
    let message = [];
    let publishStrategyIds = [];
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
    db.strategy.getBriefStrategyArray(superid).then(res=>{
      res.forEach(item=>{
        publishStrategyIds.push(item._id)
      })
      this.setData({
        publishStrategyIds
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