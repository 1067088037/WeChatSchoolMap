// pages/myCenter/creatasso/creatasso.js
const app = getApp();
import {
  db
} from '../../../../util/database/database';
import {
  section
} from '../../../../util/database/section';

Page({

  /**
   * 页面的初始数据
   */
  data: {
  section:{name:"",desc:"",image:"",geo:""},
  userUploadPhotoes: [], // 用户上传的图片
  files: []
  },
  setsection:function(e){
    this.setData({
    section:e.detial.value
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
  inputsectionName(e){
    this.setData({
      section: e.detail.value
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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