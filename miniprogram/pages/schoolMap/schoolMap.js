// pages/schoolMap/schoolMap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapCtx:     null,                // MapContext对象
    longitude:  113.40275985754079,  // 小程序一开始显示的经纬度
    latitude:   23.048671682072218,
    isMoreTrue: false,               // 是否需要选择更多功能
    functions:[                      // 功能名称数组
      "海报",
      "添加",
      "搜索",
      "筛选"
    ],
    func:'',                          // 功能名称
    showPage:false,                   // 是否显示功能页面
    pagePosition: 'center',           // 弹出的方式
    pageDuration: 500,                // 动画时长
    overlay: false,                   // 是否显示遮罩层
  },

  // 获取屏幕中心经纬度
  getCenterLocation:function(){
    this.mapCtx.getCenterLocation({
      success:(res)=>{
        console.log(res.longitude+','+res.latitude)
      }
    })
  },

  // 显示功能页面
  showFunction:function(){
    if(this.data.isMoreTrue){
      this.setData({
        isMoreTrue:false
      })
    }
    else{
      this.setData({
        isMoreTrue:true
      })
    }
  },

  // 弹窗函数 
  popup:function(e){
    this.setData({
      func : e.currentTarget.dataset.item
    })
    // 根据用户选择，显示不同的页面
    switch(this.data.func){
      case "海报":{
        this.setData({
          isMoreTrue: false
        })
        break;
      }
      case "搜索":{
        this.setData({
          pagePosition:"top",
          isMoreTrue: false
        })
        break;
      }
      case "添加":{
        this.setData({
          isMoreTrue: false
        })
        break;
      }
      case "筛选":{
        this.setData({
          isMoreTrue:false,
        })
        break;
      }
      default:{
        this.setData({
          isMoreTrue:false
        })
      }
      break;
    }
    this.setData({
      showPage: true,
    })
  },

  // 退出功能页面
  showPrev(){
    this.setData({
      showPage:false
    })
  },

  // page-container的触发函数，不写以下这些函数会警告
  onBeforeEnter(res) {
    console.log(res)
  },
  onEnter(res) {
    console.log(res)
  },
  onAfterEnter(res) {
    console.log(res)
  },
  onBeforeLeave(res) {
    console.log(res)
  },
  onLeave(res) {
    console.log(res)
  },
  onAfterLeave(res) {
    console.log(res)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载后生成MapContext对象
    this.mapCtx = wx.createMapContext('myMap', this)
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