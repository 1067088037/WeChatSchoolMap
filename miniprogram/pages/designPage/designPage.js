const {
  db
} = require("../../util/database/database");
const app = getApp()
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
// pages/designPage/designPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadPostArea: false, // 显示上传海报界面
    showEditStrategy: false, // 显示编辑攻略界面
    draftStrategiesId: [], // 草稿攻略的id合集
    draftStrategies: [], // 草稿攻略合集
    draftStrategySelected: null, // 选择的攻略
    file: [], // 海报文件数组
    userUploadPosters: [], // 用户上传的海报
    userUploadPhotoes: [], // 用户上传的照片
    stateArch: false, // 建筑里的攻略草稿的状态 -- 是否显示下拉
    firstClickArch: false, // 第一次点击建筑攻略草稿 
    isExitEditStrategy: false, // 显示退出编辑攻略的页面
    strategyTitle: "", // 用户发布的攻略标题
    strategyContent: "", // 用户发布的攻略内容
    strategyBriefIntro: "", // 用户发布的内容简介
    dialogButtons: [{
      text: "不保存"
    }, {
      text: "保存"
    }], // 对话框按钮集,
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
      userUploadPosters: []
    })
  },
  sendPhoto() {
    this.data.userUploadPosters.forEach((e, i) => {
      const filepath = e;
      const name = Math.round(Math.random * 10000).toString()
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
      userUploadPosters: this.data.userUploadPosters.concat(e.detail.urls[0])
    })
  },
  uploadPhotoesSuccess(e) {
    console.log('upload success', e.detail)
    this.setData({
      userUploadPhotoes: this.data.userUploadPhotoes.concat(e.detail.urls[0])
    })
  },
  inputStrategyTitle(e) {
    this.setData({
      strategyTitle: e.detail.value
    })
  },
  inputStrategyBriefIntro(e) {
    this.setData({
      strategyBriefIntro: e.detail.value
    })
  },
  inputStrategyMainBody(e) {
    this.setData({
      strategyContent: e.detail.value
    })
  },
  isShowSaveEditDialog(e) {
    this.setData({
      isExitEditStrategy: true
    })
  },
  updatePhotoesToCloud() {
    let images = []
    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      const name = Math.round(Math.random * 10000).toString()
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
  isSaveEdit(e) {
    if (e.detail.item.text == '不保存') {
      this.setData({
        strategyTitle: "",
        strategyContent: "",
        strategyBriefIntro: "",
        userUploadPhotoes: [],
        isExitEditStrategy: false,
        draftStrategySelected: null
      })
    } else if (e.detail.item.text == '保存') {
      let content = [];
      let image = this.updatePhotoesToCloud();
      let contentObj = {
        desc: this.data.strategyContent,
        name: this.data.strategyTitle,
        image: image
      }
      content.push(contentObj)
      let draft = {
        name: this.data.draftStrategySelected.name,
        desc: this.data.strategyBriefIntro,
        content: content
      }
      db.strategy.updateDraftStrategy(this.data.draftStrategySelected.id, draft)
      this.data.draftStrategies.forEach(strategy => {
        if (strategy.id == this.data.draftStrategySelected.id) {
          strategy.content = content
          strategy.desc = draft.desc
        }
      })
      this.setData({
        strategyTitle: "",
        strategyContent: "",
        strategyBriefIntro: "",
        userUploadPhotoes: [],
        isExitEditStrategy: false,
        draftStrategySelected: null
      })
    }
  },
  publishDraft(e) {
    let content = [];
    let image = this.updatePhotoesToCloud();
    let contentObj = {
      desc: this.data.strategyContent,
      name: this.data.strategyTitle,
      image: image
    }
    content.push(contentObj)
    let draft = {
      name: this.data.draftStrategySelected.name,
      desc: this.data.strategyBriefIntro,
      content: content
    }
    db.strategy.updateDraftStrategy(this.data.draftStrategySelected.id, draft)
    setTimeout(() => {
      db.strategy.publishFromDraft(this.data.draftStrategySelected.id)
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        strategyTitle: "",
        strategyContent: "",
        strategyBriefIntro: "",
        userUploadPhotoes: [],
        isExitEditStrategy: false,
        draftStrategySelected: null
      })
    }, 800)

  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  navigaToEditStrategy(e) {
    let draftStrategies = this.data.draftStrategies
    this.data.draftStrategiesId.forEach(id => {
      db.strategy.getStrategy(id).then(res => {
        if (res.type == "draft") {
          let draft = res.draft;
          draft['id'] = res._id;
          draftStrategies.push(draft)
        }
      })
    })

    setTimeout(() => {
      this.setData({
        showEditStrategy: true,
        draftStrategies
      })
    }, 1000)

  },
  EditDraftTap(e) {
    let id = e.currentTarget.id
    let draftStrategySelected = new Object;
    let image = []
    this.data.draftStrategies.forEach(item => {
      if (item.id == id) {
        draftStrategySelected = item;

        item.content[0].image.forEach(e => {
          e = CloudPathFront + e;
          image.push(e)
        })
        draftStrategySelected.content[0].image = image
      }
    })
    let files = []
    draftStrategySelected.content[0].image.forEach(im => {
      console.log(im)
      files.push({
        url: im
      })
    })
    this.setData({
      strategyTitle: draftStrategySelected.content[0].name,
      strategyContent: draftStrategySelected.content[0].desc,
      strategyBriefIntro: draftStrategySelected.desc,
      draftStrategySelected,
      files
    })
  },
  navigaToCreateLifeStrategy(e){
    this.setData({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      userOpenId: app.globalData.openid
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let draftStrategiesId = this.data.draftStrategiesId
    db.strategy.getBriefStrategyArrayByOpenid(this.data.userOpenId).then(res => {
      //console.log(res)
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