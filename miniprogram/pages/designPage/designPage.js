const {
  db
} = require("../../util/database/database");
const app = getApp()
// pages/designPage/designPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadPostArea: false,
    showEditStrategy: false,
    draftStrategiesId: [],
    draftStrategies: [],
    draftStrategySelected:null,
    file: [],
    userUploadPhotoes: [],
    stateArch: false,
    firstClickArch: false,
    isExitEditStrategy:false
  },
  toggleArch() {
    var list_state = this.data.stateArch,
      first_state = this.data.firstClickArch;
    if (!first_state) {
      this.setData({
        firstClickArch: true
      });
    }
    if (list_state) {
      this.setData({
        stateArch: false
      });
    } else {
      this.setData({
        stateArch: true
      });
    }
  },
  toggleSchool() {
    var list_state = this.data.stateSchool,
      first_state = this.data.firstClickSchool;
    if (!first_state) {
      this.setData({
        firstClickSchool: true
      });
    }
    if (list_state) {
      this.setData({
        stateSchool: false
      });
    } else {
      this.setData({
        stateSchool: true
      });
    }
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
      showUploadPostArea: false,
      userUploadPhotoes: []
    })
  },
  sendPhoto() {
    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      const name = i.toString()
      const cloudpath = "School/4144010561/images/Design/design" + name + filepath.match(/\.[^.]+?$/)[0]
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
        filesUrl: tempFilePaths
      })
      var obj = {}
      obj['urls'] = tempFilePaths
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

  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },


  nevigaToEditStrategy(e) {
    let draftStrategies = this.data.draftStrategies
    this.data.draftStrategiesId.forEach(id=>{
      db.strategy.getStrategy(id).then(res=>{
        let draft = res.draft;
        draft['id'] = res._id;
        draftStrategies.push(draft)
      })
    })
    

    setTimeout(() => {
      this.setData({
        showEditStrategy: true,
        draftStrategies
      })
    }, 1000)

  },
  EditDraftTap(e){
    let id = e.currentTarget.id
    let draftStrategySelected = new Object;
    this.data.draftStrategies.forEach(item=>{
      if(item.id == id)
      {
        draftStrategySelected = item;
      }
    })
    this.setData({
      draftStrategySelected,
      files : draftStrategySelected.content[0].image
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      userOpenId:app.globalData.openid
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let draftStrategiesId = this.data.draftStrategiesId
    db.strategy.getBriefStrategyArrayByOpenid(this.data.userOpenId).then(res => {
      let draftStrategiesId = this.data.draftStrategiesId
      res.forEach(e => {
        draftStrategiesId.push(e._id)
      })
      this.setData({
        draftStrategiesId
      })
    })


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