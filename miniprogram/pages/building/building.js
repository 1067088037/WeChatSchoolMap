// pages/building/building.js
const app = getApp();
var archArray = new Array;
import {
  Campus
} from '../../util/database/campus';
import {
  db
} from '../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    building: {
      type: 'canteen'
    },
    introArea: true,
    showTipsArea: false,
    showComment: false,
    isLike: false,
    likePicIndex: null,
    commentValue: null,
    intoComment: false,
    tips: [],
    selectedTip: null,
    showBuilidngBanner: true,
    isCreateNewTip: false,
    files: [],
    commentNum:5
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res.tempFilePaths)
        let obj = {}
        obj['url'] = res.tempFilePaths
        that.setData({
          files: that.data.files.push(obj)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;
      this.setData({
        filesUrl :tempFilePaths
      })
      var obj = {}
      obj['urls'] = tempFilePaths;
      resolve(obj)
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  //获取用户输入的评论内容
  getComment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  //发表评论
  sendComment() {
    db.comment.addComment("1", Campus, {
      reply: null,
      text: this.data.commentValue,
      image: null
    })
  },

  likeClick(e) {
    let id = parseInt(e.currentTarget.id);
    console.log(id)
    let newtip = new Object
    let idx = 0;
    this.data.tips.forEach((value, index) => {
      if (value.id == id) {
        if (!value.isLike) {
          newtip = value
          newtip.isLike = true;
          newtip.likeNum++;
          idx = index
        } else {
          newtip = value
          newtip.isLike = false;
          newtip.likeNum--;
          idx = index
        }
      }
    })
    console.log(newtip)
    this.data.tips.splice(idx, 1, newtip)
    let tips = this.data.tips
    this.setData({
      tips
    })
  },
  intoCommentClick(e) {
    db.comment.getAllComment('1').then(res => {
      //console.log(res[0].text)
      this.setData({
        showTipsArea: false,
        showComment: true,
        comments: [{
          text: res[0].text
        }, {
          text: res[1].text
        }]
      })
    })
  },
  toHomePage() {
    this.setData({
      showTipsArea: false,
      introArea: true
    })
  },
  toTipsAreaPage() {
    this.setData({
      selectedTip: null,
      showTipsArea: true,
      showBuilidngBanner: true
    })
  },
  returnTipArea(){
    this.setData({
      isCreateNewTip: false,
      showTipsArea: true,
      showBuilidngBanner: true
    })
  },
  createNewTip(e) {
    this.setData({
      isCreateNewTip: true,
      showTipsArea: false,
      showBuilidngBanner: false
    })
  },
  /**
   * tipsAreaTap
   * @param e
   * @returns void
   * @todo 显示攻略区
   */
  tipsAreaTap(e) {
    this.setData({
      showTipsArea: true,
      introArea: false,
      // 测试数据tips,正常使用时应从数据库获取
      tips: [{
        src: "/images/tabBarIcon/design_selected.png",
        id: 1,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 2,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 3,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 4,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 5,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }]
    })

  }, // end function
  intoDetailTip(e) {

    db.comment.getAllComment(e.currentTarget.id).then(res=>{
      this.setData({
        comments: [{
          text: res[0].text
        }, {
          text: res[1].text
        }]
      })
    })
    let id = parseInt(e.currentTarget.id)
    console.log(e)
    let selectedTip = new Object
    this.data.tips.forEach((value, index) => {
      if (value.id == id) {
        selectedTip = value
        selectedTip.isClicked = true;
      }
    })
    this.setData({
      selectedTip,
      showTipsArea: false,
      showBuilidngBanner: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.globalData.markerId)
    if (app.globalData.markerId) {
      this.setData({
        markerId: app.globalData.markerId
      })
    }
    if (app.globalData.buildingSelected != null) {
      this.setData({
        building: app.globalData.buildingSelected
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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