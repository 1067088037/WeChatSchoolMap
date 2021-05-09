// pages/designPage/designPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadPostArea: false,
    file: []
  },
  // 导航之上传海报界面
  nevigaToUpLoadPoster() {
    this.setData({
      showUploadPostArea: true
    })
  },
  // 回到设计主页面
  backToHomePage() {
    this.setData({
      showUploadPostArea: false
    })
  },

  //下列一系列函数是图片上传相关函数
  /**
   * chooseImage(e)
   * @param {e}   
   * @todo 从相册或相机中上传图片，并将文件添加到data中的file
   */
  chooseImage(e) {
    console.log("e", e)
    let this_ = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this_.setData({
          file: this_.data.file.concat(res.tempFilePaths)
        })
      }
    })
  },
  /**
   * uplaodFile(file)
   * @param {file}   图片文件路径
   * @todo 上传图片到uploader区域
   * @returns Promise函数
   */
  uplaodFile(files) {
    console.log('upload files', files)
    var that = this
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      console.log(files.tempFilePaths)
      var tempFilePaths = files.tempFilePaths;
      that.setData({
        filesUrl :tempFilePaths
      })
      var obj ={}
      obj['urls'] =tempFilePaths
      resolve(obj)
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
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