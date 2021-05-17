// pages/myCenter/joinasso/joinasso.js
import{db}from'../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostList:[], 
    userInfo: null,  
    hidden:false,
    hiddenmodalput: true,
    hiddenmodalput2:true
  },
  modalinput: function () {
 
    this.setData({
 
      hiddenmodalput: !this.data.hiddenmodalput
 
    })
 
  },
 
  //取消按钮
 
  cancel: function () {
 
    this.setData({
 
      hiddenmodalput: true
 
    });
 
  },
  cancel2: function () {
 
    this.setData({
 
      hiddenmodalput2: true
 
    });
 
  },
 
  //确认
 
  confirm: function () {
 
    this.setData({
 
      hiddenmodalput2:false
 
    })
 
  },
  confirm2: function () {
 
    this.setData({
 
      hiddenmodalput2:true
 
    })
 
  },
  onChangeShowState: function () {
 
    var that = this;
 
    that.setData({
 
      showView: (!that.data.showView)
 
    })
 
  },
  // 弹框
  powerDrawer: function (e) {
 
    var currentStatu = e.currentTarget.dataset.statu;
    console.log(currentStatu);
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    })
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
 
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
 
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })
 
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
 
        this.setData({
          showModalStatus: false
        });
        wx.showToast({
          title: '添加成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

  input1:function(e){
    this.search(e.detail.value);
  },
  search:function(key){
    var This=this;
    var hostList=wx.getStorage({
      key:'hosList',
    success:function(res){
if(key==""){
  This.setData({
    hostList:res.data
  })
  return;
}
var arr=[];
for(let i in res.data){
  res.data[i].show=false;
  if(res.data[i].search.indexOf(key)>=0){
    res.data[i].show=true;
    arr.push(res.data[i]);
  }
}
if(arr.length==0){
  This.setData({
    hostList:[{show:true,name:'无关数据'}]
  })
}else
{
  This.setData({
    hostList:arr
  })
}
    },})
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var hostList=[{
  id:101,name:"学生会",show:true,search:"101学生会"
},{
  id:102,name:"测试数据之后再绑后台",show:true,search:"102测试数据之后再绑后台"
}
] //之后会替换为后台获得的数据
wx.setStorage({
  key:'hostList',
  data:hostList,
})
this.setData({
  hostList:hostList
})
}
  ,

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