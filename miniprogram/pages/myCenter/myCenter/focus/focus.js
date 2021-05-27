// pages/myCenter/focus/focus.js
const app = getApp();
import {
  db
} from '../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    week:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
    attentionArray:[],
  },
  cancel:function(e){
    var that=this;
      var tapinfo=e.currentTarget.dataset.item;
      console.log(tapinfo);
      var obj={};
      obj['value']=tapinfo.value;
      obj['week']=tapinfo.weeks;
      obj['month']=tapinfo.month-1;
      var openid=app.globalData.openid;
      db.attention.removeAttention(openid,obj).then(()=>{console.log("删除成功")}).then(()=>{that.onLoad();})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid=app.globalData.openid;
db.attention.getAttention(openid).then((res)=>{
  this.setData(
    {
      attentionArray:res.attention
    }
  )
}).then(()=>{
 var tempa=[];
 var obj={};
 var weeka=this.data.week;
 var i;
 var k;
 for(i in this.data.attentionArray){
  var obj={};
   k=this.data.attentionArray[i].week;
   obj['week']=weeka[k];
   obj['value']=this.data.attentionArray[i].value;
   obj['month']=this.data.attentionArray[i].month+1; 
   obj['weeks']=k;
tempa.push(obj);
 }
 this.setData({
   attentionArray:tempa
 })
}).then(()=>{console.log(this.data.attentionArray)})
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