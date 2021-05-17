const {
  Campus
} = require("../../util/database/campus");
const {
  db
} = require("../../util/database/database");
const util = require("../../util/util")
const app = getApp()
const CloudStrategyPath = "School/4144010561/images/Strategies/Strategy"
const CloudPointIconPath = "School/4144010561/images/Point/Point"
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
let touchDotBegin;
let interval;
let time;
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
    userUploadIcon: [], // 用户上传标点的图示
    stateArch: false, // 建筑里的攻略草稿的状态 -- 是否显示下拉
    firstClickArch: false, // 第一次点击建筑攻略草稿 
    isExitEditStrategy: false, // 显示退出编辑攻略的页面
    strategyTitle: "", // 用户发布的攻略标题
    strategyContent: "", // 用户发布的攻略内容
    strategyBriefIntro: "", // 用户发布的内容简介
    postTitleInput: "", //上传海报时填写的活动名称
    postContentInput: "", //上传海报时填写的活动内容（简介）
    postTime: "", //上传海报时的时间
    postSenderAvator: [], //海报作者头像
    postSenderNickname: [], //海报作者昵称
    publishedPoint: [], // 保存用户发布的活动标点
    dialogButtons: [{
      text: "不保存"
    }, {
      text: "保存"
    }], // 对话框按钮集,
    showCreateLifeStrategy: false,
    isShowDeleteDraft: false,
    showEditPoint: false,
    showEditPointPage: false,
    selectedPoint: null,
    bgdate: "", // 活动开始日期 暂存
    bgtime: "",
    edtime: "",
    endate: "", // 活动结束日期 
    MarkerTitle: "",
    MarkerDesc: "",
    markerTypes: ['实时消息', '活动', '失物招领', '诈骗防范', '地点'],
    markerType: 1,
    departmentsItemOne: [
      "(全校)", "软件学院", "百步梯", "校学生会"
    ],
    departmentsItemMore:["软件学院", "百步梯", "校学生会"],
    departmentsIndex: [0],
    pickerNum: [1],
    labelArray: [{
      name: '讲座票',
      selected: false,
    }, {
      name: '德育分',
      selected: false
    }, {
      name: '创新分',
      selected: false
    }, {
      name: '活动票',
      selected: false
    }, {
      name: '文体分',
      selected: false
    }],
    isSaveEditPoint: false,
    savePointButtons: [{
      text: "不保存"
    }, {
      text: "保存"
    }]
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
      userUploadPosters: this.data.userUploadPosters.concat(e.detail.urls[0]),
    })
  },
  uploadIconSuccess(e) {
    console.log('upload success', e.detail)
    this.setData({
      userUploadIcon: (e.detail.urls[0])
    })
  },
  uploadIconError(e) {
    console.log('upload error', e.detail)
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
  updatePhotoesToCloud(path) {
    let images = []
    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      const name = util.randomId()
      const cloudpath = path + name + filepath.match(/\.[^.]+?$/)[0]
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
  uploadIcontoCloud() {
    let name = util.randomId()
    let fileName = this.data.userUploadIcon;
    let type = this.data.selectedPoint.type
    console.log(cloudPath)
    let cloudPath = "School/4144010561/images/Point/" + type + name + fileName.match(/\.[^.]+?$/)[0]
    console.log(cloudPath)
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: fileName,
      success: res => {
        console.log(res.fileId)
      },
      fail: console.error
    })
    return cloudPath
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
      let image = this.updatePhotoesToCloud(CloudStrategyPath);
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
    let image = this.updatePhotoesToCloud(CloudStrategyPath);
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
    wx.showLoading({
      title: 'loading....',
    })
    let draftStrategies = this.data.draftStrategies
    this.data.draftStrategiesId.forEach(id => {
      db.strategy.getStrategy(id).then(res => {
        if (res.type == "draft") {
          let draft = res.draft;
          draft['id'] = res._id;
          draftStrategies.push(draft)
        }
      }).then(() => {
        this.setData({
          showEditStrategy: true,
          draftStrategies
        })
        wx.hideLoading()
      })
    })
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
  showDeleteDraft(e) {
    wx.showModal({
      title: "确定删除草稿吗？",
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "删除",
      confirmColor: "#ff00000",
      success: (res) => {
        if (res.confirm) {
          db.strategy.removeStrategy(this.data.draftStrategySelected.id)
          this.data.draftStrategies.forEach((item, index) => {
            if (item.id == this.data.draftStrategySelected.id) {
              this.data.draftStrategySelected.splice(index, 1);
            }
          })
          let draftStrategies = this.data.draftStrategies
          this.setData({
            strategyTitle: "",
            strategyContent: "",
            strategyBriefIntro: "",
            userUploadPhotoes: [],
            isExitEditStrategy: false,
            draftStrategySelected: null,
            draftStrategies
          })
        } else if (res.cancel) {
          console.log(res)
        }
      }
    })
  },
  navigaToCreateLifeStrategy(e) {
    this.setData({
      showCreateLifeStrategy: true
    })
  },
  navigaToPostedPoint(e) {
    this.setData({
      showEditPoint: true
    })
  },
  toEditPointPage(e) {
    let id = e.currentTarget.id
    this.data.publishedPoint.forEach(point => {
      if (point._id == id) {
        let end = new Date(point.time.end)
        let start = new Date(point.time.start)
        let bgdate = "" + start.getFullYear().toString() + "-" + (start.getMonth() + 1).toString() + "-" + start.getDate().toString()
        let endate = "" + end.getFullYear().toString() + "-" + (end.getMonth() + 1).toString() + "-" + end.getDate().toString()
        let bgtime = "" + start.getHours() + ":" + start.getMinutes()
        let edtime = "" + end.getHours() + ":" + end.getMinutes()
        console.log(bgdate, endate, bgtime)
        let userUploadIcon = point.desc.icon
        this.setData({
          selectedPoint: point,
          endate,
          bgdate,
          bgtime,
          edtime,
          files: [{
            url: userUploadIcon
          }],
          userUploadIcon: userUploadIcon

        })
      }
    })
    this.setData({
      showEditPointPage: true
    })
  },
  inputMarkerName(e) {
    let selectedPoint = this.data.selectedPoint;
    selectedPoint.desc.name = e.detail.value
    this.setData({
      selectedPoint
    })
  },
  inputMarkerDesc(e) {
    let selectedPoint = this.data.selectedPoint;
    selectedPoint.desc.text = e.detail.value
    this.setData({
      MarkerDesc: e.detail.value
    })
  },
  bindBeginDateChange(e) {
    this.setData({
      bgdate: e.detail.value,
    })
  },
  bindBeginTimeChange(e) {
    this.setData({
      bgtime: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endate: e.detail.value,
    })
  },
  bindEndTimeChange(e) {
    this.setData({
      edtime: e.detail.value,
    })
  },
  markerTypeChange(e) {
    let index = e.detail.value;
    let selectedPoint = this.data.selectedPoint
    selectedPoint.type = this.data.markerTypes[index]
    this.setData({
      markerType: e.detail.value,
      selectedPoint
    })
  },
  visibleChange(e) {
    console.log(e)
    var id = parseInt(e.currentTarget.id)
    var departmentsIndex = this.data.departmentsIndex
    departmentsIndex[id] = e.detail.value
    let selectedPoint = this.data.selectedPoint;
    selectedPoint.belong[id] = (this.data.departmentsItemOne[departmentsIndex[id]])
    this.setData({
      departmentsIndex,
      selectedPoint
    })
  },
  addPicker(e) {
    let selectedPoint = this.data.selectedPoint
    selectedPoint.belong.push(this.data.departmentsItemOne[0])
    this.data.departmentsIndex.push(0)
    var pickerNum = this.data.pickerNum
    var departmentsIndex = this.data.departmentsIndex
    this.setData({
      pickerNum,
      departmentsIndex,
      selectedPoint
    })
  },
  deletePicker(e) {
    let selectedPoint = this.data.selectedPoint
    if (selectedPoint.belong.length > 1) {
      selectedPoint.belong.pop()

      this.setData({
        selectedPoint
      })
    } else
      return
  },
  selectedLabel(e) {
    console.log(e)
    let id = parseInt(e.currentTarget.id)
    let labelArray = this.data.labelArray
    let selectedPoint = this.data.selectedPoint
    if (labelArray[id].selected) {
      labelArray[id].selected = false;
    } else {
      labelArray[id].selected = true;
    }
    if (selectedPoint['tag'] == undefined) {
      selectedPoint['tag'] = new Array

    }
    if (labelArray[id].selected == true) {
      selectedPoint['tag'] = selectedPoint['tag'].concat(labelArray[id].name)
    } else {
      selectedPoint['tag'].splice(id,1)
    }
    this.setData({
      labelArray,
      selectedPoint
    })
  },
  confirmEditTap() {
    let show = new Date(this.data.bgdate + " 00:00")
    let start = new Date(this.data.bgdate + " " + this.data.bgtime)
    let end = new Date(this.data.endate + " " + this.data.edtime)
    let hide = new Date(this.data.endate + " 23:59")
    let time = db.point.generateTimeObj(show, start, end, hide)
    let name = this.data.selectedPoint.desc.name
    let text = this.data.selectedPoint.desc.text
    let icon = this.uploadIcontoCloud()
    let desc = db.point.generateDescObj(name, text, icon, [])
    let tag = this.data.selectedPoint.tag
    let belong = this.data.selectedPoint.belong
    db.point.updatePointById(this.data.selectedPoint._id, {
      time: time,
      desc: desc,
      belong: belong,
      tag: tag
    }).then(() => {
      this.setData({
        showEditPointPage: false
      })
      this.onReady()
    })
  },
  stopEdit(e) {
    this.setData({
      isSaveEditPoint: true
    })
  },
  saveEditPointBtnTap(e) {
    if (e.detail.item.text == '不保存') {
      this.setData({
        showEditPointPage: false
      })
    } else if (e.detail.item.text == '保存') {
      this.confirmEditTap();
    }
    this.setData({
      isSaveEditPoint: false
    })
  },
  touchStart(e) {
    console.log(e)
    touchDotBegin = e.touches[0].pageX;
    if (touchDotBegin < 20) {
      interval = setInterval(function () {
        time++;
      }, 100);
    }
  },
  touchMove(e) {

    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDotBegin + " diff:" + (touchMove - touchDotBegin));
    if (touchMove - touchDotBegin <= -40 && time < 10) {
      this.setData({
        showEditStrategy: false
      })
      console.log(213)
    }
    if (touchMove - touchDotBegin >= 40 && time < 10) {
      console.log('向右滑动');
      this.setData({
        showEditStrategy: false
      })
      console.log(54645)
    }
  },
  touchEnd(e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  getPostTitle(e) {
    this.setData({
      postTitleInput: e.detail.value
    })
  },
  getPostContent(e) {
    this.setData({
      postContentInput: e.detail.value
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
    let publishedPoint = []
    let openId = app.globalData.openid
    //console.log(app.globalData.campus._id)
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
    db.point.getPointArray(app.globalData.campus._id).then(res => {
      res.forEach(e => {
        // console.log(e._openid,openId)
        if (e._openid == openId) {
          e.desc.icon = CloudPathFront + e.desc.icon
          publishedPoint.push(e);
          //console.log(publishedPoint)
        }
      })
      this.setData({
        publishedPoint: publishedPoint
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.school._id)
    db.section.getSectionArray(app.globalData.school._id).then(res=>{
      this.setData({
        departmentsItemOne:this.data.departmentsItemOne.concat(res.data.name)
      })
    })
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