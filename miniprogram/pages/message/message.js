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
    this.setData({
      showAttentionPage:true
    })
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
  getSame(arr1,arr2){
    for(let i = 0; i = arr1.length;i++){
      for(let j = 0; j = arr2.length; j++){
        if(arr1[i] == arr2[j]){
          return true;
        }
      }
    }
    return false
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
    let attentions = [];
    let activitiesPoint = [];
    let publishStrategyIds = [];
    db.attention.getAttention(app.globalData.openid).then(res => {
     attentions = res.attention
    }).then(() => {
      db.point.getPointArray(app.globalData.campus._id).then(r => {
        r.forEach(point => {
          if (point.type == 'activity') {
            activitiesPoint.push(point)
          }
        })
      }).then(()=>{
        attentions.forEach(e=>{
          let tag = e.value;
          let month = e.month;
          let week = e.week;
          activitiesPoint.forEach(p=>{
            let pMonth =new Date( p.time.start);
            pMonth = pMonth.getMonth();
            let pWeek = new Date( p.time.start );
            pWeek = pWeek.getDay();
            // && (week == pWeek) && (month == pMonth)
            if(this.getSame(tag,p.tag)  ){
              let msgObj = {
                src : CloudPathFront + p.desc.icon,
                msg:p.desc.name,
                activity:p,
                tag,
                month,
                week,
              }
              message.push(msgObj)
              this.setData({
                messageData:this.data.messageData.concat(msgObj)
              })
            }
          })
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