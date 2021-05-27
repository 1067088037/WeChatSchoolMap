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
let SCREEN_WIDTH = 750; // 屏幕宽度
let RATE = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth
// pages/designPage/designPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapWidth: SCREEN_WIDTH,
    mapHeight: SCREEN_WIDTH * RATE,
    showUploadPostArea: false, // 显示上传海报界面
    showEditStrategy: false, // 显示编辑攻略界面
    showMyPost: false, //显示我的海报界面
    showChangeMyPost: false, //显示修改海报界面
    draftStrategiesId: [], // 草稿攻略的id合集
    draftStrategies: [], // 草稿攻略合集
    draftLifeStrategies: [], // 全局草稿攻略
    draftStrategySelected: null, // 选择的攻略
    file: [], // 海报文件数组
    files: [],
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
    myPost: [], //用户发布的海报
    myPostImagesUrl: [], //因为uploader里面的file中的属性不是string而是url，所以我再创建这个数组交
    myPostNumber: 0, //用户发布的海报数目
    postNeedChange: "",
    postNeedChangeid: "",
    dialogButtons: [{
      text: "不保存"
    }, {
      text: "保存"
    }], // 对话框按钮集,
    dialogDeleteButtons: [{
      text: '取消'
    }, {
      text: '删除'
    }],
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
    departmentsItemMore: ["软件学院", "百步梯", "校学生会"],
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
    }],
    strategyStep: [1], // 生活攻略的步骤
    newMapCtx: null, // 标点地图context
    needToMark: false, // 是否需要标点
    lifeStrategyTitle: "", // 生活攻略标题
    lifeStrategyIntro: "", // 生活攻略简介
    lifeStrategyStepNames: [""], // 生活攻略步骤名字
    lifeStrategyDescriptions: [""], // 每个步骤的描述
    lifeStrategyCoordinates: [{
      longitude: null,
      latitude: null
    }], // 标点的坐标
    needMarkers: [false], //是否需要添加标点的数组
    showIsSaveLifeStrategy: false, // 是否保存生活攻略
    showIsSaveLifeStrategyEdit: false, // 是否保存生活攻略在草稿箱界面
    isEditLifeStrategy: false, // 是否编辑生活攻略 --- 出现编辑界面 
    showEditPublishedStrategy: false, // 是否编辑已发布的攻略
    publishedArchStrategies: [], // 发布的建筑攻略数组
    publishedLifeStrategies: [], // 发布的生活攻略数组
    toEditPublishedLifeStartegy: false, // 是否编辑发布的生活攻略 -- 出现编辑界面
    toEditPublishedArchStartegy: false, // 是否编辑发布的建筑攻略 -- 出现编辑界面
    selectedPublishedArchStrategy: {},
    selectedPublishedLifeStrategy: {},

    slideViewButtons: [{
      text: "删除",
      type: "warn"
    }]
  },
  // 输入生活攻略的标题
  inputLifeStrategyTitle(e) {
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.name = e.detail.value
      this.setData({
        lifeStrategyTitle: e.detail.value,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyTitle: e.detail.value
      })
    }
  },
  // 输入生活攻略的简介
  inputLifeStrategyBriefIntro(e) {
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.desc = e.detail.value
      this.setData({
        lifeStrategyIntro: e.detail.value,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyIntro: e.detail.value
      })
    }
  },
  // 输入生活攻略每一步的标题
  inputLifeStrategyStepTitle(e) {
    // console.log(e)
    let index = parseInt(e.currentTarget.id)
    let lifeStrategyStepNames = this.data.lifeStrategyStepNames
    lifeStrategyStepNames[index] = e.detail.value
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.content[index].name = lifeStrategyStepNames[index]
      this.setData({
        lifeStrategyStepNames,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyStepNames
      })
    }
  },
  // 输入生活攻略的描述（每一步骤）
  inputLifeStrategyDescription(e) {
    let index = parseInt(e.currentTarget.id)
    let lifeStrategyDescriptions = this.data.lifeStrategyDescriptions;
    lifeStrategyDescriptions[index] = e.detail.value
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.content[index].desc = lifeStrategyDescriptions[index]
      this.setData({
        lifeStrategyDescriptions,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyDescriptions
      })
    }
  },
  // 成功上传照片时的函数
  uploadLifePhotoesSuccess(e) {
    console.log(e)
    let index = parseInt(e.currentTarget.id)
    let userUploadPhotoes = this.data.userUploadPhotoes
    if (userUploadPhotoes[index] == null || userUploadPhotoes[index] == undefined) {
      userUploadPhotoes[index] = [].concat(e.detail.urls)
    } else {
      userUploadPhotoes[index] = userUploadPhotoes[index].concat(e.detail.urls)
    }
    let files = this.data.files
    console.log('index', index)
    if (files[index] == undefined || userUploadPhotoes[index] == undefined) {
      files[index] = [].concat({
        url: e.detail.urls[0]
      })
    } else {
      files[index] = files[index].concat({
        url: e.detail.urls[0]
      })
    }
    this.setData({
      userUploadPhotoes,
      files
    })
  },
  // 是否需要显示地图标点
  needMark(e) {
    // try {
    let index = parseInt(e.currentTarget.id)
    console.log(index, this.data.lifeStrategyStepNames[index])

    let needMarkers = this.data.needMarkers
    needMarkers[index] = true
    this.setData({
      needToMark: true,
      contentIndex: index,
      needMarkers
    })
    if (this.data.isEditLifeStrategy && this.data.lifeStrategyCoordinates[index]) {
      let marker = {
        id: util.randomNumberId,
        width: 40,
        height: 50,
        longitude: this.data.lifeStrategyCoordinates[index].longitude,
        latitude: this.data.lifeStrategyCoordinates[index].latitude,
      }
      this.setData({
        markers: [marker],
        contentIndex: index
      })
    }
    // } catch {
    //   wx.showToast({
    //     title: '提示必须先填写内容',
    //     icon: 'error',
    //   })
    // }

  },
  // 点击地图的反馈函数--即会出现标点
  newMapTap(e) {
    console.log(e)
    let latitude_ = e.detail.latitude;
    let longitude_ = e.detail.longitude;
    let id = util.randomNumberId();
    let userPoint = [{
      id: id,
      width: 40,
      height: 50,
      longitude: longitude_,
      latitude: latitude_,
    }]
    this.setData({
      markers: userPoint,
    })
  },
  // 输入生活攻略的标题
  inputLifeStrategyTitle(e) {
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.name = e.detail.value
      this.setData({
        lifeStrategyTitle: e.detail.value,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyTitle: e.detail.value
      })
    }
  },
  // 输入生活攻略的简介
  inputLifeStrategyBriefIntro(e) {
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.desc = e.detail.value
      this.setData({
        lifeStrategyIntro: e.detail.value,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyIntro: e.detail.value
      })
    }
  },
  // 输入生活攻略每一步的标题
  inputLifeStrategyStepTitle(e) {
    // console.log(e)
    let index = parseInt(e.currentTarget.id)
    let lifeStrategyStepNames = this.data.lifeStrategyStepNames
    lifeStrategyStepNames[index] = e.detail.value
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.content[index].name = lifeStrategyStepNames[index]
      this.setData({
        lifeStrategyStepNames,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyStepNames
      })
    }
  },
  // 输入生活攻略的描述（每一步骤）
  inputLifeStrategyDescription(e) {
    let index = parseInt(e.currentTarget.id)
    let lifeStrategyDescriptions = this.data.lifeStrategyDescriptions;
    lifeStrategyDescriptions[index] = e.detail.value
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      draftLifeStrategySelected.content[index].desc = lifeStrategyDescriptions[index]
      this.setData({
        lifeStrategyDescriptions,
        draftLifeStrategySelected
      })
    } else {
      this.setData({
        lifeStrategyDescriptions
      })
    }
  },
  // 成功上传照片时的函数
  uploadLifePhotoesSuccess(e) {
    console.log(e)
    let index = parseInt(e.currentTarget.id)
    let userUploadPhotoes = this.data.userUploadPhotoes
    if (userUploadPhotoes[index] == null || userUploadPhotoes[index] == undefined) {
      userUploadPhotoes[index] = [].concat(e.detail.urls)
    } else {
      userUploadPhotoes[index] = userUploadPhotoes[index].concat(e.detail.urls)
    }
    let files = this.data.files
    console.log('index', index)
    if (files[index] == undefined || userUploadPhotoes[index] == undefined) {
      files[index] = [].concat({
        url: e.detail.urls[0]
      })
    } else {
      files[index] = files[index].concat({
        url: e.detail.urls[0]
      })
    }
    this.setData({
      userUploadPhotoes,
      files
    })
  },
  // 是否需要显示地图标点
  needMark(e) {
    // try {
    let index = parseInt(e.currentTarget.id)
    console.log(index, this.data.lifeStrategyStepNames[index])

    let needMarkers = this.data.needMarkers
    needMarkers[index] = true
    this.setData({
      needToMark: true,
      contentIndex: index,
      needMarkers
    })
    if (this.data.isEditLifeStrategy && this.data.lifeStrategyCoordinates[index]) {
      let marker = {
        id: util.randomNumberId,
        width: 40,
        height: 50,
        longitude: this.data.lifeStrategyCoordinates[index].longitude,
        latitude: this.data.lifeStrategyCoordinates[index].latitude,
      }
      this.setData({
        markers: [marker],
        contentIndex: index
      })
    }
    // } catch {
    //   wx.showToast({
    //     title: '提示必须先填写内容',
    //     icon: 'error',
    //   })
    // }

  },
  // 点击地图的反馈函数--即会出现标点
  newMapTap(e) {
    console.log(e)
    let latitude_ = e.detail.latitude;
    let longitude_ = e.detail.longitude;
    let id = util.randomNumberId();
    let userPoint = [{
      id: id,
      width: 40,
      height: 50,
      longitude: longitude_,
      latitude: latitude_,
    }]
    this.setData({
      markers: userPoint,
    })
  },
  // 确定在地图上的标注
  confirmMarker(e) {
    let lifeStrategyCoordinates = this.data.lifeStrategyCoordinates
    if (this.data.isEditLifeStrategy) {
      let draftLifeStrategySelected = this.data.draftLifeStrategySelected
      if (draftLifeStrategySelected.content[this.data.contentIndex]) {
        draftLifeStrategySelected.content[this.data.contentIndex].coordinates = {
          longitude: this.data.markers[0].longitude,
          latitude: this.data.markers[0].latitude
        }
      } else {
        draftLifeStrategySelected.content[this.data.contentIndex]['coordinates'] = {
          longitude: this.data.markers[0].longitude,
          latitude: this.data.markers[0].latitude
        }
      }
      this.setData({
        needToMark: false,
      })
    } else {
      lifeStrategyCoordinates[this.data.contentIndex] = {
        longitude: this.data.markers[0].longitude,
        latitude: this.data.markers[0].latitude
      }
      this.setData({
        needToMark: false,
        lifeStrategyCoordinates
      })
    }

  },
  // 取消在地图上标注
  cancelMarker(e) {
    if (this.data.isEditLifeStrategy) {
      this.setData({
        needToMark: false,
      })
    } else {
      let lifeStrategyCoordinates = this.data.lifeStrategyCoordinates
      lifeStrategyCoordinates[contentIndex] = {
        longitude: null,
        latitude: null
      }
      this.setData({
        needToMark: false,
        lifeStrategyCoordinates
      })
    }
  },
  // 获取正在添加的生活攻略主体对象（属性在发布时完整）
  getCreatingLifeStrategy() {
    let strategy = {
      name: this.data.lifeStrategyTitle,
      desc: this.data.lifeStrategyIntro,
      content: []
    }
    return strategy
  },
  // 发布生活攻略 -- 第一次添加时
  releaseLifeStrategy(e) {
    wx.showLoading({
      title: 'wating....',
    })
    if (!(this.data.isEditLifeStrategy)) {
      let superid = app.globalData.campus._id
      let superType = "campus"
      let loopTime = this.data.strategyStep.length;
      let strategy = this.getCreatingLifeStrategy()
      strategy['type'] = "publish"
      for (var index = 0; index < loopTime; index++) {
        let contentObj = {
          name: this.data.lifeStrategyStepNames[index],
          coordinates: this.data.lifeStrategyCoordinates[index],
          desc: this.data.lifeStrategyDescriptions[index],
          images: this.updatePhotoesToCloud(CloudStrategyPath, index)
        }
        console.log(contentObj)
        strategy.content.push(contentObj)
      }
      console.log(strategy)
      db.strategy.addStrategy(superid, superType, strategy).then(() => {
        this.setData({
          showCreateLifeStrategy: false,
          lifeStrategyStepNames: [],
          lifeStrategyImages: [],
          lifeStrategyDescriptions: [],
          lifeStrategyCoordinates: [],
          needMarkers: [],
          strategyStep: [],
          lifeStrategyIntro: "",
          lifeStrategyTitle: "",
          userUploadPhotoes: []
        })
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
      })
    } else {
      let draft = {
        name: this.data.draftLifeStrategySelected.name,
        desc: this.data.draftLifeStrategySelected.desc,
        content: this.data.draftLifeStrategySelected.content
      }
      this.data.userUploadPhotoes.forEach((e, index) => {
        let images = this.updatePhotoesToCloud(CloudStrategyPath, index)
        console.log("Images: ", )
        draft.content[index].images.push(images)
      })
      console.log('draft: ', draft)
      db.strategy.publishFromDraft(this.data.draftLifeStrategySelected.id, draft).then(() => {
        this.setData({
          draftLifeStrategySelected: null,
          showEditStrategy: true,
          isEditLifeStrategy: false,
          showCreateLifeStrategy: false,
          lifeStrategyStepNames: [],
          lifeStrategyImages: [],
          lifeStrategyDescriptions: [],
          lifeStrategyCoordinates: [],
          needMarkers: [false],
          strategyStep: [1],
          userUploadPhotoes: [],
          lifeStrategyIntro: "",
          lifeStrategyTitle: "",
          showIsSaveLifeStrategyEdit: false,
          files: [],
          draftLifeStrategies: [],
          draftLifeStrategySelected: {},
        })
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        this.navigaToEditStrategy()
      })
    }
    this.onReady()

  },
  // 是否保存生活攻略在第一次添加时的编辑
  isSaveLifeStrategy(e) {
    let loopTime = this.data.strategyStep.length;
    if (e.detail.item.text == '不保存') {
      this.setData({
        showCreateLifeStrategy: false,
        lifeStrategyStepNames: [],
        lifeStrategyImages: [],
        lifeStrategyDescriptions: [],
        lifeStrategyCoordinates: [],
        needMarkers: [false],
        strategyStep: [1],
        userUploadPhotoes: [],
        lifeStrategyIntro: "",
        lifeStrategyTitle: "",
        files: [],
        showIsSaveLifeStrategy: false,
        draftLifeStrategies: [],
      })
    } else if (e.detail.item.text == '保存') {
      let superid = app.globalData.campus._id
      let superType = "campus"
      let strategy = this.getCreatingLifeStrategy();
      strategy['type'] = "draft"
      for (var index = 0; index < loopTime; index++) {
        let contentObj = {
          name: this.data.lifeStrategyStepNames[index],
          coordinates: this.data.lifeStrategyCoordinates[index],
          desc: this.data.lifeStrategyDescriptions[index],
          images: this.updatePhotoesToCloud(CloudStrategyPath, index)
        }
        console.log(contentObj)
        strategy.content.push(contentObj)
      }
      console.log(strategy)
      db.strategy.addStrategy(superid, superType, strategy).then(() => {
        this.setData({
          showIsSaveLifeStrategy: false,
          draftLifeStrategies: [],
          showCreateLifeStrategy: false,
          lifeStrategyStepNames: [],
          lifeStrategyImages: [],
          lifeStrategyDescriptions: [],
          lifeStrategyCoordinates: [],
          needMarkers: [false],
          strategyStep: [1],
          userUploadPhotoes: [],
          lifeStrategyIntro: "",
          lifeStrategyTitle: "",
          files: [],
          showIsSaveLifeStrategy: false,
          draftLifeStrategies: [],
        })
        this.onReady()
      })
    }

  },
  // 是否保存生活攻略在草稿箱中的编辑
  isSaveLifeStrategyEdit(e) {
    if (e.detail.item.text == '不保存') {
      this.setData({
        draftLifeStrategySelected: null,
        showEditStrategy: true,
        isEditLifeStrategy: false,
        showCreateLifeStrategy: false,
        lifeStrategyStepNames: [],
        lifeStrategyImages: [],
        lifeStrategyDescriptions: [],
        lifeStrategyCoordinates: [],
        needMarkers: [false],
        strategyStep: [1],
        userUploadPhotoes: [],
        lifeStrategyIntro: "",
        lifeStrategyTitle: "",
        files: [],
        draftLifeStrategySelected: {},
        showIsSaveLifeStrategyEdit: false
      })
    } else if (e.detail.item.text == '保存') {
      let draft = {
        name: this.data.draftLifeStrategySelected.name,
        desc: this.data.draftLifeStrategySelected.desc,
        content: this.data.draftLifeStrategySelected.content
      }
      this.data.userUploadPhotoes.forEach((e, index) => {
        let images = this.updatePhotoesToCloud(CloudStrategyPath, index)
        console.log("Images: ", )
        draft.content[index].images.push(images)
      })
      console.log('draft: ', draft)
      db.strategy.updateDraftStrategy(this.data.draftLifeStrategySelected.id, draft).then(() => {
        this.setData({
          draftLifeStrategySelected: null,
          showEditStrategy: true,
          isEditLifeStrategy: false,
          showCreateLifeStrategy: false,
          lifeStrategyStepNames: [],
          lifeStrategyImages: [],
          lifeStrategyDescriptions: [],
          lifeStrategyCoordinates: [],
          needMarkers: [false],
          strategyStep: [1],
          userUploadPhotoes: [],
          lifeStrategyIntro: "",
          lifeStrategyTitle: "",
          showIsSaveLifeStrategyEdit: false,
          files: [],
          draftLifeStrategies: [],
          draftLifeStrategySelected: {},

        })
        this.navigaToEditStrategy()
      })

    }
  },
  // 增加生活攻略步骤
  AddStrategySteps() {
    if (this.data.isEditLifeStrategy) {
      let content = {
        desc: "",
        name: "",
        coordinates: {},
        images: [],
      }
      this.data.draftLifeStrategySelected.content.push(content)
      this.setData({
        strategyStep: this.data.strategyStep.concat([1]),
        needMarkers: this.data.needMarkers.concat([false]),
        draftLifeStrategySelected: this.data.draftLifeStrategySelected
      })
    } else {
      this.setData({
        strategyStep: this.data.strategyStep.concat([1]),
        needMarkers: this.data.needMarkers.concat([false]),
        lifeStrategyStepNames: this.data.lifeStrategyStepNames.concat([""]),
        lifeStrategyDescriptions: this.data.lifeStrategyDescriptions.concat([""]),
        lifeStrategyCoordinates: this.data.lifeStrategyCoordinates.concat([{
          longitude: null,
          latitude: null
        }])
      })
    }
  },
  // 减少生活攻略步骤
  ReduceStrategySteps() {
    if (!(this.data.isEditLifeStrategy)) {
      if (this.data.strategyStep.length > 1) {
        this.data.strategyStep.pop()
        this.data.lifeStrategyCoordinates.pop(),
          this.data.lifeStrategyStepNames.pop(),
          this.data.needMarkers.pop(),
          this.data.lifeStrategyDescriptions.pop()
      }
      this.setData({
        strategyStep: this.data.strategyStep,
        needMarkers: this.data.needMarkers,
        lifeStrategyCoordinates: this.data.lifeStrategyCoordinates,
        lifeStrategyStepNames: this.data.lifeStrategyStepNames,
        lifeStrategyDescriptions: this.data.lifeStrategyDescriptions,
      })
    } else {
      if (this.data.strategyStep.length > 1) {
        this.data.strategyStep.pop()
        this.data.needMarkers.pop(),
          this.data.draftLifeStrategySelected.content.pop()
      }
      this.setData({
        strategyStep: this.data.strategyStep,
        needMarkers: this.data.needMarkers,
        draftLifeStrategySelected: this.data.draftLifeStrategySelected
      })
    }
  },
  // 从创建生活攻略界面返回
  cancelCreateLifeStrategy(e) {
    if (this.data.isEditLifeStrategy == false) {
      this.setData({
        showIsSaveLifeStrategy: true
      })
    } else {
      this.setData({
        showIsSaveLifeStrategyEdit: true
      })
    }
  },
  // 草稿箱界面显示建筑攻略的函数
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
  // 草稿箱界面显示生活攻略的函数
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
  // 导航至上传海报界面
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
  backToHomePageFromMyPost() {
    this.setData({
      showMyPost: false
    })
  },
  sendPhoto() {

    this.data.userUploadPosters.forEach((e, i) => {
      const filepath = e;
      const name = util.randomId()
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
  //发送海报到数据库
  sendPost() {
    //console.log(this.data.userUploadPosters);
    db.poster.addPoster('1ace8ef160901b1b008f69ae08b0ee8a', {
      sender: getApp().globalData.openid,
      name: this.data.postTitleInput,
      desc: this.data.postContentInput,
      images: this.data.userUploadPosters,
    })
    wx.navigateTo({
      url: '../../pages/posterArea/posterArea',
    });
    this.setData({
      showUploadPostArea: false
    })
  },
  //出现我的海报页面，从数据库中加载数据
  navigaToMyPost() {
    this.setData({
      showMyPost: true
    })
    db.poster.getPosterByOpenid(getApp().globalData.openid).then(res => {
      this.setData({
        myPost: res,
        myPostNumber: res.length
      })
      //console.log("嘿嘿嘿嘿我发布的海报")
      //console.log(res)
    })
  },
  //点击了修改，转到修改界面，并且加载原来的数据
  ChangeThisPost(e) {
    var that = this;
    that.setData({
      postNeedChangeid: e.currentTarget.id,
      showChangeMyPost: true,
      showMyPost: false
    })
    db.poster.getPosterById(e.currentTarget.id).then(res => {
      console.log(res)
      that.setData({
        postNeedChange: res
      })
      let postNeedChangeImagesArray = Array.from(res.images);
      var imagesUrl = that.data.myPostImagesUrl;
      postNeedChangeImagesArray.forEach(function (imageString, index) {
        let im = {
          url: imageString
        }
        imagesUrl[index] = im;
        that.setData({
          myPostImagesUrl: imagesUrl
        })
      })
      //myPostImagesUrl
    })
  },
  DeleteThisPost(e) {
    db.poster.removePoster(e.currentTarget.id).then(res => {}),
      db.poster.getPosterByOpenid(getApp().globalData.openid).then(res => {
        this.setData({
          myPost: res,
          myPostNumber: res.length,
          showMyPost: false
        })
      })
  },
  postNoChange() {
    this.setData({
      showChangeMyPost: false
    })
  },
  ChangeThisPostNow() {
    //console.log(this.data.userUploadPosters);
    //postNeedChange
    var that = this;
    if (this.data.postTitleInput != "")
      this.data.postNeedChange.name = this.data.postTitleInput;
    if (this.data.postContentInput != "")
      this.data.postNeedChange.desc = this.data.postContentInput;

    // let myPostUrlArray = Array.from(this.data.myPostImagesUrl)
    // var myPostImgaesString = [];
    // myPostUrlArray.forEach(function (postUrl, index) {
    //   //console.log("这里看看")
    //   //console.log(postUrl.url.url)
    //   myPostImgaesString[index] = postUrl.url.url//得到string类型
    //   that.data.postNeedChange.images = myPostImgaesString
    // })

    this.setData({
      postNeedChange: this.data.postNeedChange
    })
    //console.log(this.data.postNeedChange)
    db.poster.updatePoster(this.data.postNeedChangeid, this.data.postNeedChange).then(res => {
      //console.log(res),
      console.log("改了改了看这里")
    })
    db.poster.getPosterByOpenid(getApp().globalData.openid).then(res => {
      this.setData({
        myPost: res,
        myPostNumber: res.length,
        showMyPost: false
      })
    })
    this.setData({
      showChangeMyPost: false
    })
    wx.navigateTo({
      url: '../../pages/posterArea/posterArea',
    });
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
  // 上传照片
  updatePhotoesToCloud(path, index = 0) {
    let images = []
    if (this.data.userUploadPhotoes[index] != null && this.data.userUploadPhotoes[index].constructor != Array) {
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
    } else if (this.data.userUploadPhotoes[index] != null) {
      this.data.userUploadPhotoes[index].forEach((e, i) => {
        const filepath = e;
        const name = util.randomId()
        const cloudpath = path + name + filepath.match(/\.[^.]+?$/)[0]
        images.push(cloudpath)
        console.log(images)
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
    }
    return images
  },
  // 上传图示
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
    return CloudPathFront + cloudPath;
  },
  uploadPointPhotoToCloud() {
    let images = []
    let name = util.randomId();
    if (this.data.userUploadPhotoes.length > 0) {
      let files = this.data.userUploadPhotoes;
      console.log(files)
      let type = this.data.selectedPoint.type
      files.forEach(image => {
        let cloudPath = "School/4144010561/images/Point/" + type + name + image.match(/\.[^.]+?$/)[0];
        console.log(cloudPath)
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: image,
          success: res => {
            console.log(res.fileId)
          },
          fail: console.error
        })
        images.push(CloudPathFront + cloudPath);
      })
    }
    return images;
  },
  isSaveEdit(e) {
    wx.showLoading({
      title: 'waiting...',
    })
    if (e.detail.item.text == '不保存') {
      this.setData({
        strategyTitle: "",
        strategyContent: "",
        strategyBriefIntro: "",
        userUploadPhotoes: [],
        isExitEditStrategy: false,
        draftStrategies: [],
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
        draftStrategySelected: null,
        draftStrategies: [],
      })
    }
    wx.hideLoading()
    this.navigaToEditStrategy();
    wx.showToast({
      title: '成功',
    })
  },
  // isDeleteEdit(e) {
  //   if (e.detail.item.text == '返回') {
  //     this.setData({
  //       isShowDeleteDraft: false
  //     })
  //   } else if (e.detail.item.text == '删除') {
  //     db.strategy.removeStrategy(this.data.draftStrategySelected.id).then(() => {
  //       this.setData({
  //         strategyTitle: "",
  //         strategyContent: "",
  //         strategyBriefIntro: "",
  //         userUploadPhotoes: [],
  //         isExitEditStrategy: false,
  //         draftStrategySelected: null,
  //         isShowDeleteDraft: false
  //       })
  //     })
  //   }
  // },
  // 发布草稿（建筑攻略）
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
  // 进入草稿箱界面
  navigaToEditStrategy(e) {
    wx.showLoading({
      title: 'loading....',
    })
    let draftStrategies = this.data.draftStrategies
    let draftLifeStrategies = this.data.draftLifeStrategies
    new Promise((resolve, reject) => {
      this.data.draftStrategiesId.forEach(id => {
        db.strategy.getStrategy(id).then(res => {
          if (res.type == "draft" && res.super.type == "arch") {
            let draft = res.draft;
            draft['id'] = res._id;
            draftStrategies.push(draft)
          } else if (res.type == 'draft' && res.super.type == 'campus') {
            let draft = res.draft;
            draft['id'] = res._id;
            draftLifeStrategies.push(draft)
          }
        }).then(() => {
          this.setData({
            draftStrategies,
            draftLifeStrategies
          })
        })
      })
      resolve()
    }).then(() => {
      this.setData({
        showEditStrategy: true,
      })
      // console.log("关闭Loading")
      wx.hideLoading()
    })
  },
  // 进入已发布的攻略界面
  navigaToEditPublishedStrategy(e) {
    let publishedArchStrategies = this.data.publishedArchStrategies;
    let publishedLifeStrategies = this.data.publishedLifeStrategies;
    this.data.draftStrategiesId.forEach(id => {
      db.strategy.getStrategy(id).then(res => {
        if (res.super.type == 'arch') {
          res.draft.content[0].image.forEach((e, idx) => {
            e = CloudPathFront + e
            res.draft.content[0].image[idx] = e
          })
          let draft = res.draft
          draft['id'] = res._id
          publishedArchStrategies.push(draft)
        } else {
          res.draft.content.forEach(con => {
            con.images.forEach((im, index) => {
              im = CloudPathFront + im;
              con.images[index] = im
            })
          })
          if(res.type == 'publish'){
          let draft = res.draft
          draft['id'] = res._id
          publishedLifeStrategies.push(draft)
        }
        }
      }).then(() => {
        this.setData({
          showEditPublishedStrategy: true,
          publishedArchStrategies,
          publishedLifeStrategies
        })
      }).then(() => {
        this.setData({
          // showEditStrategy: true,
  
        })
        // console.log("关闭Loading")
        
      })
      // resolve()
    })
  },
  // 从建筑草稿编辑界面返回
  returnFromDraftPage(e) {
    this.setData({
      showEditStrategy: false,
      draftStrategies: [],
      draftLifeStrategies: []
    })
  },
  // 从建筑草稿编辑界面返回
  returnFromDraftPage(e) {
    this.setData({
      showEditStrategy: false,
      draftStrategies: [],
      draftLifeStrategies: []
    })
  },
  // 从建筑草稿编辑界面返回
  returnFromDraftPage(e) {
    this.setData({
      showEditStrategy: false,
      draftStrategies: [],
      draftLifeStrategies: []
    })
  },
  // 从建筑草稿编辑界面返回
  returnFromDraftPage(e) {
    this.setData({
      showEditStrategy: false,
      draftStrategies: [],
      draftLifeStrategies: []
    })
  },
  // 进入某个选中的建筑攻略草稿编辑界面
  EditDraftTap(e) {
    let id = e.currentTarget.id
    let draftStrategySelected = new Object;
    let image = []
    this.data.draftStrategies.forEach(item => {
      if (item.id == id) {
        draftStrategySelected = item;
        if (item.content.length > 0) {
          item.content[0].image.forEach(e => {
            e = CloudPathFront + e;
            image.push(e)
          })
        }
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
  // 进入选中的生活攻略编辑界面
  EditlifeDraftTap(e) {
    let id = e.currentTarget.id
    let draftLifeStrategySelected = new Object;
    let files = []
    let strategyStep = []
    let lifeStrategyStepNames = []
    let lifeStrategyDescriptions = []
    let lifeStrategyCoordinates = []
    this.data.draftLifeStrategies.forEach(Strategy => {
      if (Strategy.id == id) {
        console.log(id)
        draftLifeStrategySelected = Strategy
        Strategy.content.forEach((con, index) => {
          let images = []
          files[index] = new Array
          if (con.images.length > 0) {
            con.images.forEach(im => {
              images.push(im)
              im = CloudPathFront + im
              let file = {
                url: im
              }
              files[index].push(file)
              console.log(files[index])
            })
          }
          lifeStrategyDescriptions.push(con.desc)
          lifeStrategyStepNames.push(con.name)
          lifeStrategyCoordinates.push(con.coordinates)
          strategyStep.push(1)
          draftLifeStrategySelected.content[index].images = images
        })
        let lifeStrategyTitle = draftLifeStrategySelected.name;
        let lifeStrategyIntro = draftLifeStrategySelected.desc;
        this.setData({
          lifeStrategyStepNames,
          lifeStrategyDescriptions,
          lifeStrategyCoordinates,
          lifeStrategyTitle,
          lifeStrategyIntro,
          draftLifeStrategySelected,
          files,
          strategyStep,
          showCreateLifeStrategy: true,
          showEditStrategy: false,
          isEditLifeStrategy: true
        })
      }
    })
  },
  // 是否删除建筑攻略界面
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
              this.data.draftStrategies.splice(index, 1);
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
  // 是否删除生活草稿函数
  showDeleteDraftLifeStrategy(e) {
    wx.showModal({
      title: "确定删除草稿吗？",
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "删除",
      confirmColor: "#ff00000",
      success: (res) => {
        if (res.confirm) {
          db.strategy.removeStrategy(this.data.draftLifeStrategySelected.id)
          this.data.draftLifeStrategies.forEach((item, index) => {
            if (item.id == this.data.draftLifeStrategySelected.id) {
              this.data.draftLifeStrategies.splice(index, 1)
            }
          })
          let draftLifeStrategies = this.data.draftLifeStrategies
          this.setData({
            isEditLifeStrategy: false,
            draftLifeStrategies,
            draftLifeStrategySelected: null,
            showCreateLifeStrategy: false,
            showEditStrategy: true
          })
        } else {
          console.log(res)
        }
      }
    })
  },
  // 去创建生活攻略界面
  navigaToCreateLifeStrategy(e) {
    this.setData({
      showCreateLifeStrategy: true
    })
  },
  // 是否显示上传标点
  navigaToPostedPoint(e) {
    this.setData({
      showEditPoint: true
    })
  },
  // 进入某个选中的标点编辑界面
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
        let Pointfiles = [];
        if (point.desc.images.length > 0) {
          point.desc.images.forEach(im => {
            Pointfiles.push({
              url: im
            });
          })
        }
        this.setData({
          selectedPoint: point,
          endate,
          bgdate,
          bgtime,
          edtime,
          files: [{
            url: userUploadIcon
          }],
          Pointfiles,
          userUploadIcon: userUploadIcon

        })
      }
    })
    this.setData({
      showEditPointPage: true
    })
  },
  // 输入标点的名字
  inputMarkerName(e) {
    let selectedPoint = this.data.selectedPoint;
    selectedPoint.desc.name = e.detail.value
    this.setData({
      selectedPoint
    })
  },
  // 输入标点的描述
  inputMarkerDesc(e) {
    let selectedPoint = this.data.selectedPoint;
    selectedPoint.desc.text = e.detail.value
    this.setData({
      MarkerDesc: e.detail.value
    })
  },
  // 开始日期改变
  bindBeginDateChange(e) {
    this.setData({
      bgdate: e.detail.value,
    })
  },
  // 开始时间改变
  bindBeginTimeChange(e) {
    this.setData({
      bgtime: e.detail.value
    })
  },
  // 结束日期改变
  bindEndDateChange(e) {
    this.setData({
      endate: e.detail.value,
    })
  },
  // 结束时间改变
  bindEndTimeChange(e) {
    this.setData({
      edtime: e.detail.value,
    })
  },
  // 标点类型改变
  markerTypeChange(e) {
    let index = e.detail.value;
    let selectedPoint = this.data.selectedPoint
    selectedPoint.type = this.data.markerTypes[index]
    this.setData({
      markerType: e.detail.value,
      selectedPoint
    })
  },
  // 部门选择（可视性）改变函数
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
  // 增加部门选择器的数目
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
  // 删除部门选择器的数目
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
  // 选择标点标签
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
      selectedPoint['tag'].splice(id, 1)
    }
    this.setData({
      labelArray,
      selectedPoint
    })
  },
  // 删除标点图示
  deleteSelectedIcon(e) {
    let selectedPoint = this.data.selectedPoint
    wx.cloud.deleteFile({
      fileList: [selectedPoint.desc.icon],
      success: res => {
        console.log("删除成功", res)
      },
      fail: res => {
        console.log("删除失败", res)
      }
    })
    selectedPoint.desc.icon = ""
  },
  deleteSelectedPointPhotoes(e) {
    let index = e.detail.index
    console.log(e)
    let selectedPoint = this.data.selectedPoint
    if (this.data.Pointfiles.length > 0) {
      let selectedImage = this.data.Pointfiles[index]
      this.data.Pointfiles.splice(index, 1)
      console.log(selectedImage)
      selectedPoint.desc.images.forEach((im, idx) => {
        if (im == selectedImage.url) {
          selectedPoint.desc.images.splice(idx, 1);
          try {
            wx.cloud.deleteFile({
              fileList: [selectedImage.url],
              success: res => {
                console.log("删除成功", res)
              },
              fail: res => {
                console.log("删除失败", res)
              }
            })
          } catch {
            console.log("Fail to delete")
          }
          this.setData({
            selectedPoint
          })
          return;
        }
      })
    }
  },
  // 删除编辑时上传的照片
  // 该函数用于编辑生活攻略草稿和建筑攻略草稿
  deletePhotoes(e) {
    if (e.currentTarget.id == '2021') {
      if (draftStrategySelected.content[0].image > 0) {
        let filePath = this.data.draftStrategySelected.content[0].image[e.detail.index]
        wx.cloud.deleteFile({
          fileList: [filePath],
          success: res => {
            console.log("删除成功")
          },
          fail: res => {
            console.log("删除失败")
          }
        })
        this.data.draftStrategySelected.content[0].image.splice(e.detail.index, 1)
        this.data.files.splice(e.detail.index, 1)
        this.setData({
          userUploadPhotoes: this.data.userUploadPhotoes,
          files: this.data.files
        })
      }
    } else {
      console.log(e)
      let id = parseInt(e.currentTarget.id)
      let filePath = this.data.draftLifeStrategySelected.content[id].images[e.detail.index]
      wx.cloud.deleteFile({
        fileList: [filePath],
        success: res => {
          console.log("删除成功", res)
        },
        fail: res => {
          console.log("删除失败", res)
        }
      })
      this.data.draftLifeStrategySelected.content[id].images.splice(e.detail.index, 1)
      this.data.files[id].splice(e.detail.index, 1)
      this.setData({
        draftLifeStrategySelected: this.data.draftLifeStrategySelected
      })
    }
  },
  selectPhotoes(e) {
    console.log(e)
  },
  // 确定编辑发布的标记
  confirmEditTap() {
    let show = new Date(this.data.bgdate + " 00:00")
    let start = new Date(this.data.bgdate + " " + this.data.bgtime)
    let end = new Date(this.data.endate + " " + this.data.edtime)
    let hide = new Date(this.data.endate + " 23:59")
    let time = db.point.generateTimeObj(show, start, end, hide)
    let name = this.data.selectedPoint.desc.name
    let text = this.data.selectedPoint.desc.text
    let icon;
    let images = [];
    if (this.data.selectedPoint.desc.images.length > 0) {
      images = this.data.selectedPoint.desc.images.concat(this.uploadPointPhotoToCloud())
    } else {
      images = this.uploadPointPhotoToCloud()
    }

    if (this.data.selectedPoint.desc.icon == "") {
      icon = this.uploadIcontoCloud()
    } else {
      icon = this.data.selectedPoint.desc.icon
    }
    let desc = db.point.generateDescObj(name, text, icon, images)
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
  // 编辑标点界面的返回键的响应函数，弹出对话框
  stopEdit(e) {
    this.setData({
      isSaveEditPoint: true
    })
  },
  // 是否保存编辑标点的对话框按钮的响应函数
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
  showDeletePointDraft(e){
    wx.showModal({
      title: '是否确定要删除？',
      confirmText: "删除",
      confirmColor: "#FF0000",
      cancelText: "取消",
      success :(res)=>{
        if(res.confirm){
         db.point.removePointById(this.data.selectedPoint._id).then(()=>{
           wx.showToast({
             title: '删除成功',
           })
           this.setData({
            // showEditPoint:false,
            showEditPointPage:false
           })
           this.onReady()
         })
        }
      }
    })
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

  // 从发布的攻略界面返回主页面
  returnToHomeFromEPS(e) {
    this.setData({
      showEditPublishedStrategy: false,
      publishedArchStrategies: [],
      publishedLifeStrategies: []
    })
  },
  // 删除发布的攻略
  deletePublishedStrategy(e) {
    let id = e.currentTarget.id
    wx.showModal({
      title: '是否确定要删除？',
      confirmText: "删除",
      confirmColor: "#FF0000",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: 'waiting...',
          })
          db.strategy.removeStrategy(id).then(() => {
            this.setData({
              publishedArchStrategies: [],
              publishedLifeStrategies: []
            })
            this.onReady()
            this.navigaToEditPublishedStrategy()
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '攻略已删除',
            })
          })
        }
      }
    })
  },
  returnFromEditPoint(e) {
    this.setData({
      showEditPoint: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mCampus = getApp().globalData.campus
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      userOpenId: app.globalData.openid,
      longitude: mCampus.geo.center.longitude,
      latitude: mCampus.geo.center.latitude
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let draftStrategiesId = []
    let publishedPoint = []
    let openId = app.globalData.openid
    //console.log(app.globalData.campus._id)
    db.strategy.getBriefStrategyArrayByOpenid(this.data.userOpenId).then(res => {
      console.log(res)
      // let draftStrategiesId = this.data.draftStrategiesId
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
          //e.desc.icon = CloudPathFront + e.desc.icon
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

    db.section.getSectionArray(app.globalData.school._id).then(res => {
      this.setData({
        departmentsItemOne: this.data.departmentsItemOne.concat(res.data.name),
        newMapCtx: wx.createMapContext('newMap', this)
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