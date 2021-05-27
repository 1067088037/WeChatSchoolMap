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
applicationArray:[],
sectionid:"",
isAdmin:false
  },

agree :function (e) { 
  console.log("成功调用");
  var that=this;
  if(this.data.isAdmin){                 //让申请者加入社团
  var id=e.currentTarget.dataset.item.id;
  console.log(id);
  var openid=e.currentTarget.dataset.item.applicantid;
  console.log(openid);
  var title="已经通过申请表";
  var sectionid=this.data.sectionid;
  console.log(sectionid);
  db.section.joinSection(sectionid,32,openid)
  console.log("成功加入");
  let appliction={
    id:id,
    applicant:openid,
    title:title,
    inform:"审核完毕",
    state:"已通过"
  };
  db.application.updateApplication(id,appliction)
  that.onLoad();
console.log("修改成功");}
else{
  console.log("修改失败");
}
},
refuse :function (e) {
  var that=this;           
  if(this.data.isAdmin){
  var id=e.currentTarget.dataset.item.id;
  console.log(id);
  var openid=e.currentTarget.dataset.item.applicantid;
  console.log(openid);
  var title="已经拒绝申请表";
  var sectionid=this.data.sectionid;
  let appliction={
    id:id,
    applicant:openid,
    title:title,
    inform:"审核完毕",
    state:"已拒绝"
  };
  db.application.updateApplication(id,appliction)
  console.log("修改成功");
var options={};
options['sid']=that.data.sectionid;
that.onLoad(options);
}
  else{
    console.log("修改失败");
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
 sectionid:options.sid
    })
    console.log(this.data.sectionid);
    var sectionid=this.data.sectionid;
    var openid=app.globalData.openid;
    db.section.getUserPermission(sectionid,openid).then((res)=>
    this.setData({
      isAdmin:res.isAdmin
    })
    )
    var tempapplistArray=[];
    db.application.getApplicationBySectionId(sectionid,["未审核"]).then((res)=>
    {console.log(res);
    this.setData({
      applicationlist:res.data
    })}
    ).then(()=>{console.log(this.data.applicationlist)}).then(()=>{
      var i;
      for(i in this.data.applicationlist){
      db.user.getUser(this.data.applicationlist[i].applicant).then((res)=>{
        var tempapplist={};
        tempapplist['id']=this.data.applicationlist[i]._id;
        tempapplist['applicantid']=this.data.applicationlist[i].applicant;
      tempapplist['inform']=this.data.applicationlist[i].inform;
      tempapplist['state']=this.data.applicationlist[i].state;
        tempapplist['applicantname']=res.userInfo.nickName;
        tempapplistArray.push(tempapplist);
      }).then(()=>{
        this.setData(
          {
            applicationArray:tempapplistArray
          }
        )
      })
    }
    }).then(()=>{console.log(this.data.applicationArray);})
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