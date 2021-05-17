const app = getApp();
import {
  db
} from '../../../../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
applicationlist:[],
sectionid:"",
isAdmin:false
  },
agree :function (e) {                         //让申请者加入社团
  var id=e.currentTarget.dataset.id;
  console.log(id);
  var openid=e.currentTarget.dataset.openid;
  console.log(openid);
  var title=e.currentTarget.dataset.title;
  var sectionid=this.data.sectionid;
  db.section.joinSection(sectionid,32,openid)
  let appliction={
    id:id,
    applicant:openid,
    title:title,
    inform:"审核完毕",
    state:"通过"
  };
  db.application.updateApplication(id,appliction)

},
refuse :function (e) {                         //让申请者加入社团
  var id=e.currentTarget.dataset.id;
  var openid=e.currentTarget.dataset.openid;
  var title=e.currentTarget.dataset.title;
  let appliction={
    id:id,
    applicant:openid,
    title:title,
    inform:"审核完毕",
    state:"拒绝"
  };
  db.application.updateApplication(id,appliction)
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
 sectionid:options.sid,
 isAdmin:options.isA
    })
    var sectionid=this.data.sectionid;
    db.application.getApplicationBySectionId(sectionid,[]).then((res)=>
    this.setData({
      applicationlist:res
    })
    )
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