const app = getApp();
import {
  db
} from '../../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin:true,
    title:"",
    sectionid:"",
tapmemberif:{
},            //点击到成员的信息
hiddenmodalput1:true,
resetfalsehd:true  ,  //等级不足时候跳出来的弹窗
resetsuccesshd:true ,  //修改等级成功
reset:false,
getout:false,
member:[]
  },
  modal1: function () {
     this.setData({
 
      hiddenmodalput1: false
 
    })
 
  },
 setAdmin:function(e){
     var temptap={};
     temptap['openid']=e.currentTarget.dataset.item._openid;
     temptap['name']=e.currentTarget.dataset.item.nickName;
     this.setData({
    tapmemberif:temptap,
    reset:true
     })
 },
 getoutof:function(e){
   console.log("成功调用");
  var temptap={};
  temptap['openid']=e.currentTarget.dataset.item._openid;
  temptap['name']=e.currentTarget.dataset.item.nickName;
  this.setData({
 tapmemberif:temptap,
 getout:true
  })
},
 giveUp :function(){
   this.setData({
     reset:false
   })
 },
  setnewAdmin:function(){
      if(!this.data.isAdmin){
       this.setData({
        resetfalsehd:false,
        hiddenmodalput1:true})
  
      }
      else{
        db.section.addAdmin(this.data.sectionid,this.data.tapmemberif.openid).then(()=>{
          console.log("修改成功")
        })
        this.setData({
          resetsuccesshd:false,
          hiddenmodalput1:true,
          reset:false
        })
      }
    
  },
  getout:function(){
    if(!this.data.isAdmin){
      this.setData({
        resetfalsehd:false,
        hiddenmodalput1:true})

    }
    else{
      console.log("调用成功")
      db.section.exitSection(this.data.sectionid,this.data.tapmemberif.openid).then(()=>{
        console.log("请离社团成功")
      })
      this.setData({
        resetsuccesshd:false,
        hiddenmodalput1:true,
        getout:false
      })
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
    console.log(options.title);
    console.log(options.id);
    this.setData({
      title: options.title,
      sectionid:options.id
    })
    var sectionid=this.data.sectionid;
    console.log(sectionid);
    db.section.getUserInSection(sectionid).then((res)=>{
       this.setData({
      member:res            
     })}).then(()=>console.log(this.data.member));
    
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