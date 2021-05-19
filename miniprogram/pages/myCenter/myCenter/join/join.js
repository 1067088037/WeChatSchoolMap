// pages/myCenter/joinasso/joinasso.js
const app = getApp();
import{db}from'../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sectionArray:[],
    schoolid:{},
    sectiontext: "", //搜索框的值
    noneview: false, //显示未找到提示
    sectionlist: true, //显示列表
    sectionArray: [{ //社团信息
      id: 0,
      images: "/miniprogram/images/index/centerLocation.png",
      title: "学生会",
      status: 1
    }],
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

  input1: function(e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
        sectionlist: true //呈现所有列表
      });
      //所有社团列表的状态改为1
      for (var index in this.data.sectionarray) {
        let temp = 'sectionarray[' + index + '].status';
        this.setData({
          [temp]: 1,
        })
      }
    }
    this.setData({
      sectiontext: e.detail.value
    })
   this.search();
  },
  search: function() {
    var searchtext = this.data.sectiontext; //搜索框的值
    console.log(searchtext);
    var sss = true;
    if (searchtext != "") {
      //模糊查询 循环查询数组中的title字段
      for (var index in this.data.sectionArray) {
        console.log("循环开始");
        var num = this.data.sectionArray[index].title.indexOf(searchtext);
        let temp = 'sectionArray[' + index + '].status';
        if (num != -1) { //不匹配的不显示
          this.setData({
            [temp]: 1,
          })
          sss = false //隐藏未找到提示
        }
        else{
          this.setData({
            [temp]: 0,
          })
        }
      }
      this.setData({
        noneview: sss, //隐藏未找到提示
        sectionlist: true, //显示社团列表
      })
    } else {
      this.setData({
        noneview: false, //显示未找到提示
        sectionlist: true, //展示所有社团
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid=app.globalData.openid;
    let value;
    db.user.getUser(openid).then((res)=>{
      console.log(res)
      this.setData({
        schoolid:res.info.school
      })
    }).then(()=>{
      console.log(this.data.schoolid);
      db.section.getSectionArray(this.data.schoolid).then((res)=>{this.setData({
        sectionArray:res
      })})
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