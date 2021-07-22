// pages/myCenter/creatasso/creatasso.js
const app = getApp();
import {
  db
} from '../../../../util/database/database';
import {
  section
} from '../../../../util/database/section';
const util = require('../../../../util/util')
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successHidden: true,
    openid: "",
    sectionid: "",
    schoolid: "",
    section: {},
    title: "",
    desc: "",
    userUploadPhotoes: [], // 用户上传的图片
    files: []
  },
  setsection: function (e) {
    this.setData({
      section: e.detial.value
    })
  },
  selectFile(files) {
    console.log('files', files)
  },
  uplaodFile(files) {
    console.log('upload files', files)
    return new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;
      this.setData({
        filesUrl: tempFilePaths
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
    this.setData({
      userUploadPhotoes: this.data.userUploadPhotoes.concat(e.detail.urls[0])
    })
  },
  inputsectionName(e) {
    this.setData({
      title: e.detail.value
    })
  },
  inputBriefIntro(e) {
    this.setData({
      desc: e.detail.value
    })
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
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;
      this.setData({
        filesUrl: tempFilePaths
      })
      var obj = {}
      obj['urls'] = tempFilePaths;
      resolve(obj)
    })
  },
  updatePhotoesToCloud() {
    let images = []

    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      let name = util.randomId()
      const cloudpath = "School/4144010561/images/Strategies/Strategy" + name + filepath.match(/\.[^.]+?$/)[0]
      images.push(cloudpath)
      console.log(cloudpath)
      wx.cloud.uploadFile({
        cloudPath: cloudpath,
        filePath: filepath,
        success: res => {
          console.log(res.fileId)
        },
        fail: console.error
      })
    })
    return images
  },
  sendStrategy() {
    var schoolid;
    let title = this.data.title;
    //let campusId = app.globalData.campus._id
    let content = [];
    let obj = {};
    obj['desc'] = this.data.desc;
    obj['name'] = this.data.title;
    console.log(this.data.title);
    if (obj.name === "" || obj.desc === "") {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'error'
      })
      return
    }
    let images = this.updatePhotoesToCloud()
    obj['image'] = images;
    obj['geo'] = "无"
    var openid = app.globalData.openid;
    console.log(openid);
    wx.showLoading({
      title: 'Loading...',
    })
    db.user.getUser(openid).then((res) => {
      console.log(res);
      this.setData({
        schoolid: res.info.school
      })
    }).then(() => {
      console.log(this.data.schoolid);
      console.log(obj);
      db.section.addSection(this.data.schoolid, obj).then(res => {
        if (!res.refuse) {
          this.setData({
            sectionid: res._id
          })
          var openid = app.globalData.openid;
          db.section.joinSection(this.data.sectionid, 48, openid);
          db.section.addAdmin(this.data.sectionid, openid);
          this.setData({
            successHidden: false
          });
          var that = this;
          wx.hideLoading()
          setTimeout(function () {
            that.setData({
              successHidden: true
            });
            wx.navigateBack({
              delta: 1,
            })
          }, 500)
        } else wx.hideLoading()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = app.globalData.openid;
    console.log(openid);
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
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