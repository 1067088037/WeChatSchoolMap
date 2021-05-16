import {
  db
} from '../../util/database/database'
var util = require('../../util/util.js')
// pages/schoolMap/schoolMap.js
let SCREEN_WIDTH = 750; // 屏幕宽度
let RATE = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth // 比率
const app = getApp() // 小程序全局
const tempTest = require('./tempTest')



const shopPoint = [{

    title: "世博超市",
    longitude: 113.40203129147403,
    latitude: 23.048593578356705
  },
  {

    title: "7-11便利店",
    longitude: 113.40188492453046,
    latitude: 23.051165789442734
  },
  {
    title: "",
    longitude: 113.40176343650955,
    latitude: 23.05108920417096
  }
] // 商店点
const deliverPickUpPoint = [] // 拿快递的点
const vouchCenterPoint = [{
    id: 1,
    title: "学生卡和水卡充值点",
    longitude: 113.40268387434162,
    latitude: 23.04866925793428
  },
  {
    id: 2,
    title: "学生卡和水卡充值点",
    longitude: 113.40333534303113,
    latitude: 23.051645364973492
  }, {
    title: "水卡充值点",
    longitude: 113.40238690806586,
    latitude: 23.04796789472804
  }, {

  }
] // 充值点
var activitiesPoint = [] // 活动标记点 -- 暂存
var isAdd = false; // 是否添加的标记
var flag = 0;
var visibleArchArray = new Array;
var selectedArchType = new Array;
var archArray = new Array;
var realTimeInfoArray = new Array;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapWidth: SCREEN_WIDTH,
    mapHeight: SCREEN_WIDTH * RATE,
    mapCtx: null, // MapContext对象
    longitude: 0, // 小程序一开始显示的经纬度
    latitude: 0,
    isMoreTrue: false, // 是否需要选择更多功能
    functions: [ // 功能名称数组
      "海报",
      "添加",
      "搜索",
      "筛选"
    ],
    markers: [],
    func: '', // 功能名称
    showPage: false, // 是否显示功能页面
    pagePosition: 'center', // 弹出的方式
    pageDuration: 500, // 动画时长
    overlay: false, // 是否显示遮罩层
    showBuildingDialog: false, // 是否显示对话框 -- 用于点击具体建筑时弹出的简介
    showMarkerDialog: false, // 是否显示对话框 -- 用于添加标点时
    isAddedMarker: false, // 是否添加了marker
    buildingBtns: [{
      text: '退出'
    }, {
      text: '了解更多'
    }], // 对话框的按钮文字
    markerBtns: [{
      text: '取消'
    }, {
      text: '确定'
    }], // 添加标点对话框的按钮
    bgdate: "2021-05-03", // 活动开始日期 暂存
    bgtime: "08:00",
    edtime: "22:30",
    endate: "2021-05-04", // 活动结束日期 
    archItems: [{
      value: "dorm",
      name: "宿舍",
      checked: false
    }, {
      value: "classRoom",
      name: "教室"
    }, {
      value: "college",
      name: '学院'
    }, {
      value: "canteen",
      name: "饭堂"
    }, {
      value: "shop",
      name: "商店"
    }, {
      value: "canteen",
      name: "饭堂"
    }, {
      value: "vouchCenter",
      name: "充值点"
    }, {
      value: "activity",
      name: "活动"
    }, {
      value: "deliveryPickUp",
      name: "快递外卖提取点"
    }], // 筛选建筑的选项
    departmentsItem: [
      "(全校)", "软件学院", "百步梯", "校学生会"
    ], // belong 属于那个部门
    departmentsIndex: [0], // 
    pickerNum: [1],
    markerTypes: ['实时消息', '活动','失物招领','诈骗防范','地点'], //type
    markerType: 1,
    newMarkerTitle: "",
    newMarkerDesc: "",
    buildingSelected: null,
    files: [],
    userUploadIcons: ""
  },
  /**
   * addPicker()
   * @todo 添加选择器，在添加标点界面中
   * @param null
   * 
   */
  addPicker() {
    this.data.pickerNum.push(1)
    this.data.departmentsIndex.push(0)
    var pickerNum = this.data.pickerNum
    var departmentsIndex = this.data.departmentsIndex
    this.setData({
      pickerNum,
      departmentsIndex
    })
  },
  /**
   * deletePicker()
   * @todo 删除选择器，在添加标点界面中
   * @param null
   * 
   */
  deletePicker() {
    if (this.data.pickerNum.length > 1) {
      this.data.pickerNum.pop()
      var pickerNum = this.data.pickerNum
      this.setData({
        pickerNum
      })
    } else
      return
  },
  /**
   * inputMarkerName(e)
   * @todo 输入标点的题目/名字
   * @param e  --- 输入框的对象
   * 
   */
  inputMarkerName(e) {
    console.log(e)
    this.setData({
      newMarkerTitle: e.detail.value
    })
  },
  inputMarkerDesc(e) {
    console.log(e)
    this.setData({
      newMarkerDesc: e.detail.value
    })
  },
  /**
   * bindBeginDateChange
   * @param {*} e  picker中的对象
   * @todo 改变开始日期
   */
  bindBeginDateChange(e) {
    this.setData({
      bgdate: e.detail.value,
    })
  },
  /**
   * bindEndDateChange
   * @param {*} e  picker中的对象
   * @todo 改变结束日期
   */
  bindEndDateChange(e) {
    this.setData({
      endate: e.detail.value,
    })
  },
  /**
   * bindBeginTimeChange
   * @param {*} e  picker中的对象
   * @todo 改变开始时间
   */
  bindBeginTimeChange(e) {
    this.setData({
      bgtime: e.detail.value
    })
  },
  /**
   * bindEndTimeChange
   * @param {*} e  picker中的对象
   * @todo 改变结束时间
   */
  bindEndTimeChange(e) {
    this.setData({
      edtime: e.detail.value
    })
  },
  /**
   * markerTypeChange
   * @param {*} e  picker中的对象
   * @todo 改变新加标点的type
   */
  markerTypeChange(e) {
    this.setData({
      markerType: e.detail.value
    })
  },
  /**
   * visibleChange
   * @param {*} e  picker中的对象
   * @todo 改变新加标点的可见性 注：尚未完成
   */
  visibleChange(e) {
    console.log(e)
    var id = parseInt(e.currentTarget.id)
    this.data.departmentsIndex[id] = e.detail.value
    var departmentsIndex = this.data.departmentsIndex
    this.setData({
      departmentsIndex
    })
  },
  /**
   * mapTap
   * @param {*} e 点击处的信息
   * @todo 获取点击处的经纬度
   */
  mapTap(e) {
    if (this.data.showPage) {
      this.setData({
        showPage: false
      })
    }
    // console.log(e.detail);
    if (isAdd) {
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
      // console.log(latitude_) 
      this.setData({
        markers: userPoint,
        showMarkerDialog: true
      });
    } else if(isAdd == false)
    {  return 0;
    }
  },
  /**
   * returnMarker
   * @todo 返回。放弃添加标点 --- 在添加标点具体页面中
   * @param {*} e 
   */
  returnMarker(e) {
    isAdd = false;
    this.data.markers.pop()
    this.setData({
      markers: [],
      isAddedMarker: false,
      showMarkerDialog: false
    });
  },
  /**
   * cancelMarker
   * @todo 返回。放弃添加标点 --- 在地图上
   * @param {*} e 
   */
  cancelMarker() {
    this.data.markers.pop()
    this.setData({
      markers: [],
      showMarkerDialog: false,

    })
    isAdd = false
  },
  /**
   * confirmMarker
   * @todo 确定添加标点位置，进入标点添加信息界面 --- 在地图上
   * @param {*} e 
   */
  confirmMarker() {
    this.setData({
      isAddedMarker: true,
      showMarkerDialogfa: false
    })
  },
  chooseImage: function (e) {
    console.log("e", e)
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res.tempFilePaths)
        let obj = {}
        obj['url'] = res.tempFilePaths[0]
        that.setData({
          files: that.data.files.push(obj)
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  uploadFile(files) {
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
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    this.setData({
      userUploadIcons: (e.detail.urls[0])
    })
  },
  selectFile(files) {
    console.log('files', files)
  },
  /**
   * confirmTap
   * @todo 确定添加标点，将用户所填写的标点信息上传到云端数据库 --- 在标点添加信息界面
   * @param {*}  
   */
  confirmTap(e) {
    isAdd = false;

    let newPoint = this.data.markers.pop()
    let campusId = app.globalData.campus._id;
    let belongs = []
    for (var i = 0; i < this.data.pickerNum.length; i++) {
      let belong = [this.data.departmentsItem[this.data.departmentsIndex[i]]]
      if (belong == "(全校)")
        belong = null;
      belongs.push(belong)
    }

    let type;
    if (this.data.markerTypes[this.data.markerType] == '实时消息') {
      type = "current"
    } else if(this.data.markerTypes[this.data.markerType] == '活动')  {
      type = "activity"
    } else{
      type = this.data.markerTypes[this.data.markerType];
    }
    let show = new Date(this.data.bgdate + " 00:00")
    let start = new Date(this.data.bgdate + " " + this.data.bgtime)
    let end = new Date(this.data.endate + " " + this.data.edtime)
    let hide = new Date(this.data.endate + " 23:59")
    let time = db.point.generateTimeObj(show, start, end, hide)
    let name = this.data.newMarkerTitle
    let text = this.data.newMarkerDesc
    let icon = this.data.userUploadIcons
    let desc = db.point.generateDescObj(name, text, icon, [])

    db.point.addPoint(campusId, belongs, type, time, desc, db.Geo.Point(newPoint.longitude, newPoint.latitude))
    this.setData({
      isAddedMarker: false,
      showMarkerDialog: false
    })

  },

  // 获取屏幕中心经纬度
  getCenterLocation_() {
    this.data.mapCtx.getCenterLocation({
      success: (res) => {

        console.log("" + res.longitude, res.latitude)
      }
    })
  },

  // 显示功能页面
  showFunction: function () {
    if (this.data.isMoreTrue) {
      this.setData({
        isMoreTrue: false
      })
    } else {
      this.setData({
        isMoreTrue: true
      })
    }
  },

  // 弹窗函数 
  popup: function (e) {
    var that = this;
    this.setData({
      func: e.currentTarget.dataset.item
    })
    // 根据用户选择，显示不同的页面
    switch (this.data.func) {
      case "海报": {
        this.setData({
          pagePosition: "center",
          isMoreTrue: false
        })
        break;
      }
      case "搜索": {
        this.setData({
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      }
      case "添加": {
        var markers_ = [{
          id: util.randomNumberId(),
          latitude: 23.04866925793428,
          longitude: 113.40268387434162,
          width: 40,
          height: 50
        }];
        this.setData({
          pagePosition: "center",
          isMoreTrue: false,
          markers: markers_,
          showMarkerDialog: true
        })
        isAdd = true;
        break;
      }
      case "筛选": {
        this.setData({
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      }
      default: {
        this.setData({
          pagePosition: "center",
          isMoreTrue: false
        })
      }
      break;
    }
    if (isAdd == true)
      return;
    this.setData({
      showPage: true,
    })
    console.log("是否添加标点： " + isAdd);
  },
  /**
   * selectArchFunc
   * @todo 筛选显示在地图上标点
   * @param {*} e  checkbox对象
   */
  selectArchFunc(e) {
    //   如果selectArchType中含有不在e.detail.value中的type 则删除
    if (selectedArchType.length > 0) {
      selectedArchType.forEach((value, index) => {
        console.log(e.detail.value.indexOf(value))
        if (e.detail.value.indexOf(value) == -1)
          selectedArchType.splice(index, 1)
      })
    }
    // 选择arrchArray中有e.detail.value的type 且selectedArchType中没有的type
    // push进selectArchType
    archArray.forEach((value, index) => {
      if (e.detail.value.indexOf(value.type) != -1 && selectedArchType.indexOf(value.type) == -1) {
        selectedArchType.push(value.type)
      }
    })
    activitiesPoint.forEach((value, index) => {
      if (e.detail.value.indexOf(value.type) != -1 && selectedArchType.indexOf(value.type) == -1) {
        selectedArchType.push(value.type)
      }
    })
    visibleArchArray = [].concat(realTimeInfoArray)
    // 更新可视建筑
    archArray.forEach((value, index) => {
      if (selectedArchType.indexOf(value.type) != -1) {
        visibleArchArray.push(value)
      }
    })
    activitiesPoint.forEach((value, index) => {
      if (selectedArchType.indexOf(value.type) != -1) {
        visibleArchArray.push(value)
      }
    })
    //console.log(selectedArchType)
    //visibleArchArray = visibleArchArray.concat(activitiesPoint)
    this.setData({
      markers: visibleArchArray
    })
  },

  // 以下Only函数要取代，无需看
  // 只显示宿舍
  DormOnly() {
    const markers = dormPoint_db;
    this.setData({
      markers,
      showPage: false,

    })
    flag = 1
  },
  // 只显示教学楼
  ClassRoomOnly() {
    const markers = classRoomPoint;
    this.setData({
      markers,
      showPage: false,

    })
    flag = 2
  },
  // 只显示学院楼
  collegeOnly() {
    const markers = collegePoint;
    this.setData({
      markers,
      showPage: false,
    })
    flag = 3
  },
  // 只显示可吃饭的地方
  canteenOnly() {
    const markers = canteenPoint
    this.setData({
      markers,
      showPage: false,

    })
    flag = 4
    console.log(flag)
  },

  getMarkerInfo(id) {
    let obj = new Object
    archArray.forEach(e => {
      if (e.id == id) {
        obj = e;
        return obj;
      }
    })
    return obj;
  },
  // 根据markerID获取经纬度
  getLongtitude(id) {
    let markerArr;
    //console.log(flag)
    switch (flag) {
      case 1: {
        markerArr = dormPoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.longitude;
        })
      }
      case 2: {
        markerArr = classRoomPoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.longitude;
        })
      }
      case 3: {
        markerArr = collegePoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.longitude;
        })
      }
      case 4: {
        markerArr = canteenPoint
        for (var i = 0; i < markerArr.length; i++) {
          console.log(markerArr[i].id)
          if (id == markerArr[i].id)
            return markerArr[i].longitude
        }
      }
    }
    return 0;
  },

  // 进入具体建筑的简介弹窗
  markerstap(e) {
    // console.log(e.detail.markerId)
    app.globalData.buildingSelected = this.getMarkerInfo(e.detail.markerId)
    console.log("用户选择的建筑对象：" + app.globalData.buildingSelected)
    this.setData({
      showBuildingDialog: true,
      buildingSelected: app.globalData.buildingSelected
    })
  },
  /**
   * showMarkerInfoPage
   * @param {*} e 对话框按钮信息
   * @todo 确定标记点是否设为当前位置，如果是则进入标记点信息填写界面，不是则删除该标记点
   */
  showMarkerInfoPage(e) {
    if (e.detail.item.text == "取消") {
      activitiesPoint.pop();
      this.setData({
        markers: activitiesPoint,
        isAddedMarker: false
      })
    } else if (e.detail.item.text == "确定") {
      this.setData({
        isAddedMarker: true
      })
      isAdd = false;
    }
    this.setData({
      showMarkerDialog: false
    })
  },

  /**
   * toDetailPage
   * @param {*} e  -- 按钮数据
   * @return void
   * @todo 导航到具体建筑的页面并把该建筑的经纬度传到全局变量
   */
  toDetailPage(e) {
    // console.log(e);
    if (e.detail.item.text == "退出") {
      app.globalData.buildingSelected = null;
    } else if (e.detail.item.text == "了解更多") {
      wx.redirectTo({
        url: '../building/building',
        success: (res) => {
          console.log(666)
        }
      })
    }
    this.setData({
      showBuildingDialog: false
    })
  },
  /**
   * navigation
   * @todo 导航函数
   */
  navigation(e) {
    console.log(this.data.buildingSelected.latitude, this.data.buildingSelected.longitude)
    // 打开app导航
    wx.openLocation({
      latitude: this.data.buildingSelected.latitude,
      longitude: this.data.buildingSelected.longitude,
      name: this.data.buildingSelected.title
    })
  },

  // 退出功能页面
  showPrev() {
    this.setData({
      showPage: false
    })
  },
  // 搜索功能
  search(e) {
    visibleArchArray = []
    archArray.forEach((value, index) => {
      if (value.title == e.detail.value) {
        visibleArchArray.push(value)
      }
    })
    this.setData({
      markers: visibleArchArray
    })
  },
  // page-container的触发函数，不写以下这些函数会警告
  onBeforeEnter(res) {
    // console.log(res)
  },
  onEnter(res) {
    // console.log(res)
  },
  onAfterEnter(res) {
    // console.log(res)
  },
  onBeforeLeave(res) {
    // console.log(res)
  },
  onLeave(res) {
    // console.log(res)
  },
  onAfterLeave(res) {
    // console.log(res)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载后生成MapContext对象
    wx.getLocation({
      type: "gcj02",
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude, longitude)
      }
    })
    // 绑定this才能上传
    this.setData({
      selectFile: this.selectFile.bind(this),
      uploadFile: this.uploadFile.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let mCampus = getApp().globalData.campus
    // console.log(mCampus.geo.center.latitude)
    this.setData({
      longitude: mCampus.geo.center.longitude,
      latitude: mCampus.geo.center.latitude
    })
    this.setData({
      mapCtx: wx.createMapContext('myMap', this),
      // longitude: getApp().globalData.campus.longitude,
    })
    let campusId = app.globalData.campus._id

    // 从数据库中获取建筑的标点对象
    db.arch.getArchArray(app.globalData.campus._id).then(res => {
      console.log(res)
      res.forEach((value, index) => {
        if (value.type == 'canteen') {
          archArray.push({
            _id: value._id,
            id: value.markId,
            latitude: value.geo.coordinates[1],
            longitude: value.geo.coordinates[0],
            type: value.type,
            title: value.name,
            width: 50,
            height: 40,
            iconPath: "/images/building/canteen.png"
          })
          this.setData({
            markers: this.data.markers.concat({
              _id: value._id,
              id: value.markId,
              latitude: value.geo.coordinates[1],
              longitude: value.geo.coordinates[0],
              type: value.type,
              title: value.name,
              width: 50,
              height: 40,
              iconPath: "/images/building/canteen.png"
            })
          })
        } else {
          archArray.push({
            _id: value._id,
            id: value.markId,
            latitude: value.geo.coordinates[1],
            longitude: value.geo.coordinates[0],
            type: value.type,
            title: value.name,
            width: 40,
            height: 50
          })
        }
      })
    })
    // 从数据库中获取标点对象
    db.point.getPointArray(app.globalData.campus._id).then(res => {
      res.forEach((value, index) => {
        if (value.type == 'activity')
          activitiesPoint.push({
            _id: value._id,
            id: value.markId,
            title: value.desc.name,
            longitude: value.geo.coordinates[0],
            latitude: value.geo.coordinates[1],
            width: 30,
            height: 40,
            type: value.type,
            iconPath: value.desc.icon
          })
        else {
          realTimeInfoArray.push({
            _id: value._id,
            id: value.markId,
            title: value.desc.name,
            longitude: value.geo.coordinates[0],
            latitude: value.geo.coordinates[1],
            width: 30,
            height: 40,
            type: value.type,
            iconPath: "/images/index/realtimeInfo.png"
          })
        }
      })
    })

    // 默认显示实时信息标点。
    const that = this
    visibleArchArray = realTimeInfoArray
    setTimeout(() => {
      that.setData({
        markers: this.data.markers.concat(visibleArchArray)
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    tempTest.launchTest() //用于临时测试
    tempTest.dbExample() //数据库函数调用示例

    // dormPoint.forEach(e => {
    //   // let e = dormPoint[0]
    //   let arch = {
    //     name: e.title,
    //     logo: null,
    //     type: "dorm",
    //     geo: db.Geo.Point(e.longitude, e.latitude)
    //   }
    //   db.arch.addArch(app.globalData.campus._id, arch)
    //   console.log(e)
    // })

    // db.arch.getArchArray('1ace8ef160901b1b008f69ae08b0ee8a').then(arr => {
    //   arr.forEach(e => {
    //     db.arch.removeArchById(e._id)
    //     console.log(e)
    //   })
    // })

    // db.point.addPoint(app.globalData.campus._id, [], 'current',
    //   db.point.generateTimeObj(Date('2020-1-1'),Date('2020-1-2'),Date('2020-1-3'),Date('2020-1-4')),
    //   db.point.generateDescObj('标点','哈哈哈哈哈哈', 'cloud:/',[]), db.Geo.Point(1,1))

    // db.point.getPointArray(app.globalData.campus._id).then(res => {
    //   console.log(res)
    // })

    // db.point.updatePointById('79550af2609276ce1475f6ef13718594', {
    //   belong: db.cmd.push('123456')
    // })

    // db.point.removePointById('79550af2609276ce1475f6ef13718594')

    // db.point.removePointByMarkId(2733118894648745)

    // db.like.giveALike('123456')

    // for (let i = 0; i < 5; i++) {
    // db.comment.addComment('123', 'arch', {
    //   reply: null,
    //   text: 'qwq',
    //   images: []
    // })
    // }

    // db.comment.removeComment('e810o28g1ekfvswpx7ul7qmlfbq6g3ii')
    // db.comment.removeAllComment('123')

    // db.like.giveALike('bcnefaoh58nbpfecpu2b3xewag4ahmqq')
    // db.like.countLike('bcnefaoh58nbpfecpu2b3xewag4ahmqq').then(res => {
    //   console.log(res)
    // })

    // db.like.cancelLike('bcnefaoh58nbpfecpu2b3xewag4ahmqq')
    // db.like.countLike('bcnefaoh58nbpfecpu2b3xewag4ahmqq').then(res => console.log(res))

    // db.section.addSection('1ace8ef16090a631008f950170cb8165', {
    //   name: '学生会',
    //   desc: '就这里啊',
    //   images: ['123'],
    //   geo: db.Geo.Point(1,1)
    // })

    // console.log(new Date('2020-1-1').constructor)
    // console.log(Date('2020-1-1').constructor)

    // db.section.removeSection('79550af26093a82914b5da045773f1ce')

    // db.comment.addComment('28ee4e3e6093a074165cb26a0b7cae41', 'arch', {
    //   reply: null,
    //   text: '6666',
    //   images: []
    // })

    // console.log(getApp().globalData.openid)
    // console.log(db.like.countLike('ytff4it7v1afo3o63p2oqbnrykd1bk7a'))

    // db.like.giveALike('ytff4it7v1afo3o63p2oqbnrykd1bk7a')
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