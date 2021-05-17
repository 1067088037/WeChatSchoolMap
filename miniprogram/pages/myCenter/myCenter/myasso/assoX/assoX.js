const app = getApp();
import {
  db
} from '../../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    sectionid:"",
memberid:{},
memberif:[{id:'',name:''}],
tapmemberif:{openid:"",                    
name:"0",
isAdmin:false,
imageurl:""
},            //点击到成员的信息
hiddenmodalput1:true,
userlevel:0,
matelevel:0,
resetfalsehd:true  ,  //等级不足时候跳出来的弹窗
resetsuccesshd:true   //修改等级成功
  },
  modal1: function () {
     this.setData({
 
      hiddenmodalput1: false
 
    })
 
  },
  //这个方法有待商榷，新增了是否为社团管理员，这个留着之后社团管理员等级要是有划分再用，所以现在只要是管理员就可以改非管理员为管理员

  resetrank_modal:function(e){
    console.log(e.currentTarget.dataset.id);
    var isAdmin=false;
      if(!isAdmin){
        this.setData({
       resetsuccesshd:false,
       hiddenmodalput1:true})
       //需要一个修改等级的接口，暂时只有弹窗
      }
      else{
        this.setData({
        resetfalsehd:false,
        hiddenmodalput1:true})
      }
    
  },
  tryaga :function(){
    this.setData({
      hiddenmodalput1:false,
      resetfalsehd:true
    })
  },
  accessfail :function(){
    this.setData({
      hiddenmodalput1:true,
      resetfalsehd:true
    })
  },
  tryagasu :function(){
    this.setData({
      hiddenmodalput1:false,
      resetsuccesshd:true
    })
  },
  tryagasu :function(){
    this.setData({
      hiddenmodalput1:false,
      resetsuccesshd:true
    })
  },
  accesssu:function(){
    this.setData({
      hiddenmodalput1:true,
      resetsuccesshd:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      sectionid:options.sid
    })
    var sectionid=this.data.sectionid;
    //获取所有处于这个社团的用户openid,目前好像还没有实际的社团ID,所以得不到东西
    
  //   db.section.getUserInSection(sectionid).then((res)=>{
  //     this.setData({
  //    member:res.openidArray             
  //   })})
  //   console.log(this.data.member);
    
  //  this.data.member.forEach((data)=>{
  //    db.user.getUser(data).then((res)=>{
  //      this.data.memberif.push({id:res._openid,
  //       name:res.userInfo.nickName      
  //    })    //这个建议之后加个备注名功能用昵称太奇怪了
  //  })
  // });
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