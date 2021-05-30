import {
  db
} from '../../util/database/database'
var util = require('../../util/util.js')
// pages/schoolMap/schoolMap.js
let SCREEN_WIDTH = 750; // 屏幕宽度
let RATE = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth // 比率
const app = getApp() // 小程序全局
const tempTest = require('./tempTest')
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";
let isFirstShow = 1
const shopPoint = [{
    name: "图书馆 ",
    longitude: 113.40538247792563,
    latitude: 23.046693083903406,

    text: "",
    type: "classRoom",
    images: [],
  }, {
    name: "学术大讲堂 ",
    longitude: 113.40681198887796,
    latitude: 23.04685094782348,

    text: "",
    type: "college",
    images: [],
  },
  {
    name: "B12",
    longitude: 113.40716671729854,
    latitude: 23.04230005903462,

    text: "",
    type: "college",
    images: [],
  }, {
    name: "音乐厅",
    longitude: 113.40487415076132,
    latitude: 23.046156124627498,

    text: "",
    type: "college",
    images: [],
  },

] // 商店点

const vouchCenterPoint = [{
    id: 1,
    name: "学生卡和水卡圈存点",
    longitude: 113.40268387434162,
    latitude: 23.04866925793428,
    type: "Service",
    text: "",
    images: [],
  },
  {
    id: 2,
    name: "学生卡和水卡圈存点",
    longitude: 113.40333534303113,
    latitude: 23.051645364973492,
    images: [],
    text: "",
    type: "Service"
  }, {
    name: "水卡充值点",
    longitude: 113.40238690806586,
    latitude: 23.04796789472804,
    images: [],
    text: "",
    type: "Service"
  }, {
    name: "校园卡服务中心",
    longitude: 113.40247027791906,
    latitude: 23.047744468260245,
    images: [],
    text: "",
    type: "Service"
  }, {
    name: "校医院",
    longitude: 113.40369964771867,
    latitude: 23.05245737178352,
    images: [],
    text: "",
    type: "Service"
  }, {
    name: "桶装水订水点",
    longitude: 113.4020619426492,
    latitude: 23.04675934159357,
    images: [],
    text: "",
    type: "Service"
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
      "定位",
      "海报",
      "添加",
      "搜索",
      "筛选",
      "关注",
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
    bgdate: (new Date()).toLocaleDateString(), // 活动开始日期 暂存
    bgtime: "08:00",
    edtime: "22:30",
    endate: (new Date()).toLocaleDateString(), // 活动结束日期 
    archItems: [{
      value: "dorm",
      name: "宿舍",
      selected: true,
    }, {
      value: "classRoom",
      name: "教室",
      selected: true,
    }, {
      value: "college",
      name: '学院',
      selected: true,
    }, {
      value: "canteen",
      name: "饭堂",
      selected: true,
    }, {
      value: "shop",
      name: "商店",
      selected: false,
    }, {
      value: "Service",
      name: "服务",
      selected: false,
    }, {
      value: "activity",
      name: "活动",
      selected: true,
    }], // 筛选建筑的选项
    departmentsItem: [
      "(全校)", "软件学院", "百步梯", "校学生会"
    ], // belong 属于那个部门
    departmentsIndex: [0], // 
    pickerNum: [1],
    markerTypes: ['实时消息', '活动', '失物招领', '诈骗防范', '地点'], //type
    markerType: 1,
    newMarkerTitle: "",
    newMarkerDesc: "",
    newMarkerTag: [],
    buildingSelected: null,
    files: [],
    userUploadIcons: "",
    userUploadPhotoes: [],
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
    }, {
      name: '电影展播',
      selected: false
    }],
    Month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    WeekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
    monthIndex: 0,
    weekIndex: 0,
    followActivitiesTag: [],
    tempFiles: [],
    currentLocation: null, //用户当前位置
  },
  getLocation() {
    this.data.mapCtx.getCenterLocation({
      success: res => {
        console.log(res.longitude, res.latitude)
      }
    })
  },
  bindfollowMonthChange(e) {
    this.setData({
      monthIndex: parseInt(e.detail.value)
    })
  },
  bindfollowWeekDayChange(e) {
    this.setData({
      weekIndex: parseInt(e.detail.value)
    })
  },
  selectedFollowLabel(e) {
    let id = parseInt(e.currentTarget.id)
    let labelArray = this.data.labelArray

    if (labelArray[id].selected) {
      labelArray[id].selected = false;
    } else {
      labelArray[id].selected = true;
    }
    let followActivitiesTag = this.data.followActivitiesTag
    if (labelArray[id].selected) {
      followActivitiesTag.push(labelArray[id].name)
    } else {
      followActivitiesTag.splice(id, 1)
    }
    this.setData({
      labelArray,
      followActivitiesTag
    })
  },

  followActivityTap(e) {
    let openid = app.globalData.openid;
    let day = this.data.weekIndex
    let month = this.data.monthIndex
    let followActivitiesTag = this.data.followActivitiesTag
    console.log(day)
    db.attention.addAttention(openid, followActivitiesTag, month, day).then(res => {
      if (!res.refuse) {
        this.data.labelArray.forEach((e, index) => {
          e.selected = false
          this.data.labelArray[index] = e
        })
        this.setData({
          func: '',
          weekIndex: 0,
          monthIndex: 0,
          followActivitiesTag: [],
          labelArray: this.data.labelArray
        })
        wx.showToast({
          title: '关注成功',
          duration: 1000
        })
      }
    })
  },
  selectedLabel(e) {
    let id = parseInt(e.currentTarget.id)
    let labelArray = this.data.labelArray

    if (labelArray[id].selected) {
      labelArray[id].selected = false;
    } else {
      labelArray[id].selected = true;
    }
    let newMarkerTag = this.data.newMarkerTag
    if (labelArray[id].selected) {
      newMarkerTag.push(labelArray[id].name)
    } else {
      newMarkerTag.splice(id, 1)
    }
    this.setData({
      labelArray,
      newMarkerTag
    })
  },
  /**
   * addPicker()
   * @param null
   */
  addPicker() {
    this.data.pickerNum.push(1)
    this.data.departmentsIndex.push(0)
    let pickerNum = this.data.pickerNum
    let departmentsIndex = this.data.departmentsIndex
    let departmentsItem = this.data.departmentsItem
    if (departmentsItem[0] == '(全校)' || departmentsItem[0] == '全校') {
      departmentsItem.splice(0, 1);
    }
    this.setData({
      pickerNum,
      departmentsIndex,
      departmentsItem
    })
  },
  /**
   * deletePicker()
   * @todo 删除选择器，在添加标点界面中
   * @param null
   * 
   */
  deletePicker() {
    if (this.data.pickerNum.length > 2) {
      this.data.pickerNum.pop()
      var pickerNum = this.data.pickerNum
      this.setData({
        pickerNum
      })
    } else if (this.data.pickerNum.length == 2) {
      this.data.pickerNum.pop()
      var pickerNum = this.data.pickerNum
      let departmentsItem = this.data.departmentsItem
      departmentsItem.splice(0, 1, '全校')
      this.setData({
        pickerNum,
        departmentsItem
      })
    }
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
    let date = new Date(e.detail.value)
    let bgDate = new Date(this.data.bgdate)
    console.log(date, bgDate)
    if (date >= bgDate) {
      this.setData({
        bgdate: e.detail.value,
        endate: e.detail.value
      })
    } else {
      wx.showToast({
        title: '输入正确的日期',
        icon: 'error'
      })
    }
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
    // console.log(e)
    if (this.data.showPage) {
      this.setData({
        showPage: false,
        isAddedMarker: false,
        func: ""
      })
    }
    // console.log(e.detail);
    if (isAdd) {
      let latitude_ = e.detail.latitude;
      let longitude_ = e.detail.longitude;
      let id = util.randomNumberId();
      let userPoint = [{
        id: id,
        width: 50,
        height: 50,
        iconPath: "/images/global/activity.png",
        longitude: longitude_,
        latitude: latitude_,
      }]
      console.log(latitude_)
      this.setData({
        markers: userPoint,
        showMarkerDialog: true
      });
    } else if (isAdd == false) {
      return 0;
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
      markers: visibleArchArray,
      isAddedMarker: false,
      showMarkerDialog: false,
      newMarkerTag: [],
      func: ''
    });
  },
  /**
   * cancelMarker
   * @todo 返回。放弃添加标点 --- 在地图上
   * @param {*} e 
   */
  cancelMarker() {
    this.data.markers.pop()
    console.log(visibleArchArray)
    this.setData({
      markers: visibleArchArray,
      showMarkerDialog: false,
      func: '',
      // isMoreTrue:true
    })
    isAdd = false
  },
  /**
   * confirmMarker
   * @todo 确定添加标点位置，进入标点添加信息界面 --- 在地图上
   * @param {*} e 
   */
  confirmMarker() {
    console.log(this.data.markers[0].iconPath)
    this.setData({
      isAddedMarker: true,
      showMarkerDialogfa: false,
      func: '',
      iconfiles: [{
        url: this.data.markers[0].iconPath
      }]
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
  uploadPhotoesSuccess(e) {
    console.log('upload success', e)
    this.setData({
      userUploadPhotoes: this.data.userUploadPhotoes.concat(e.detail.urls)
    })
  },
  selectFile(files) {
    console.log('files', files)
  },
  updatePhotoesToCloud() {
    let images = []
    let type = this.data.markerTypes[this.data.markerType]
    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      let name = util.randomId()
      const cloudpath = "School/4144010561/images/Point/" + type + name + filepath.match(/\.[^.]+?$/)[0]
      images.push(CloudPathFront + cloudpath)
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
    if (this.data.userUploadIcons.length > 0) {
      let name = util.randomId()
      let fileName = this.data.userUploadIcons;
      let type = this.data.markerTypes[this.data.markerType]
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
      return CloudPathFront + cloudPath
    }
    return ""
  },
  /**
   * confirmTap
   * @todo 确定添加标点，将用户所填写的标点信息上传到云端数据库 --- 在标点添加信息界面
   * @param {*}  
   */
  confirmTap(e) {
    isAdd = false;
    let newPoint = this.data.markers.pop()

    console.log("标点坐标： ", newPoint)
    let campusId = app.globalData.campus._id;
    let belongs = []
    for (var i = 0; i < this.data.pickerNum.length; i++) {
      let belong = [this.data.departmentsItem[this.data.departmentsIndex[i]]]
      if (belong == "(全校)")
        belong = null;
      belongs.push(belong)
    }

    let type;
    if (this.data.markerTypes[this.data.markerType] != '活动') {
      type = "current"
    } else {
      type = "activity"
    }
    let show = new Date(this.data.bgdate + " 00:00")
    let start = new Date(this.data.bgdate + " " + this.data.bgtime)
    let end = new Date(this.data.endate + " " + this.data.edtime)
    let hide = new Date(this.data.endate + " 23:59")
    let time = db.point.generateTimeObj(show, start, end, hide)
    let name = this.data.newMarkerTitle
    let text = this.data.newMarkerDesc
    let icon = (this.uploadIcontoCloud() != "") ? this.uploadIcontoCloud() : newPoint.iconPath
    let images = this.updatePhotoesToCloud()
    let desc = db.point.generateDescObj(name, text, icon, images)
    if (name != "" && text != "") {
      db.point.addPoint(campusId, belongs, type, time, desc, db.Geo.Point(newPoint.longitude, newPoint.latitude), this.data.newMarkerTag).then(res => {
        if (!res.refuse) {
          this.setData({
            isAddedMarker: false,
            showMarkerDialog: false,
            func: '',
            markers: [],
            // isMoreTrue:true
          })
          this.onReady(false)
        }
      })
    } else {
      wx.showModal({
        title: '需填写标题以及简介',
        icon: 'error',
        duration: 2000
      })

      this.setData({
        showMarkerDialog: false,
        userUploadIcons: ""
      })
    }
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
      case "定位":
        if (this.data.currentLocation == null) {
          wx.showToast({
            title: '定位失败',
            icon: 'error'
          })
        } else {
          this.data.mapCtx.moveToLocation({
            longitude: this.data.currentLocation.longitude,
            latitude: this.data.currentLocation.latitude
          })
        }
        this.setData({
          func: '',
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      case "海报":
        this.setData({
          pagePosition: "center",
          isMoreTrue: false
        })
        break;
      case "搜索":
        this.setData({
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      case "添加": {
        if (db.user.checkIsLogin()) {
          let la;
          let lon;
          this.data.mapCtx.getCenterLocation({
            success: res => {
              // console.log(res)
              la = res.latitude;
              lon = res.longitude
              var markers_ = [{
                id: util.randomNumberId(),
                latitude: la,
                longitude: lon,
                width: 50,
                height: 50,
                iconPath: "/images/global/activity.png",
              }];
              this.setData({
                pagePosition: "center",
                isMoreTrue: false,
                markers: markers_,
                showMarkerDialog: true
              })
            }
          })
          isAdd = true;
        }else{
          
          
          this.setData({
            func:''
          })
          return;
        }
        break;
      }
      case "筛选":
        this.setData({
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      case "关注":
        this.setData({
          pagePosition: "top",
          isMoreTrue: false
        })
        break;
      default:
        this.setData({
          pagePosition: "center",
          isMoreTrue: false
        })
        break;
    }
    if (isAdd == true)
      return;
    this.setData({
      showPage: true,
    })
    console.log("是否添加标点： " + isAdd);
  },
  //跳转到海报区
  navigatorToPosterArea() {
    wx.navigateTo({
      url: '../../pages/posterArea/posterArea',
    });
  },
  /**
   * selectArchFunc
   * @param {*} e checkbox对象
   */
  selectArchFunc(e) {
    selectedArchType = [];
    visibleArchArray = [];
    // console.log(e)
    let archItems = this.data.archItems;
    if (e != null) {
      let id = parseInt(e.currentTarget.id)
      if (archItems[id].selected) {
        archItems[id].selected = false;
      } else {
        archItems[id].selected = true;
      }
      archItems.forEach(e => {
        if (e.selected) {
          selectedArchType.push(e.value)
        }
      })
    }

    console.log('改变可见性')
    visibleArchArray = [].concat(realTimeInfoArray)
    console.log(activitiesPoint)
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
    console.log(visibleArchArray)
    app.globalData.archItem = this.data.archItems
    this.setData({
      archItems,
      markers: visibleArchArray
    })

    db.preference.updateArchItems(this.data.archItems)
  },




  getMarkerInfo(id) {
    let obj = new Object
    archArray.forEach(e => {
      if (e.id == id) {
        obj = e;
        return obj;
      }
    })
    activitiesPoint.forEach(e => {
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
    // console.log(e)
    visibleArchArray.forEach(m => {
      // console.log(m)
      if (m.id == e.detail.markerId && m.type != 'user') {
        if (e.detail.markerId != null) {
          console.log("用户选择的建筑对象的Id：", e.detail.markerId)
          app.globalData.buildingSelected = this.getMarkerInfo(e.detail.markerId)
          console.log("用户选择的建筑对象：", app.globalData.buildingSelected)
          if (app.globalData.buildingSelected.text != undefined)
            app.globalData.buildingSelected.text = app.globalData.buildingSelected.text.replaceAll("\\n", '\n')
          this.setData({
            showBuildingDialog: true,
            buildingSelected: app.globalData.buildingSelected
          })
        }
        return;
      }
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
      wx.navigateTo({
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
  deleteStorage(e) {
    wx.clearStorage({
      success: (res) => {
        console.log(res)
      },
    })
  },
  deepCopy(arr) {
    let length = arr.length;
    let res = []
    for (let i = 0; i < length; i++) {
      res[i] = arr[i]
    }
    return res
  },
  onMapUpdated() {
    // console.log('onMapUpdated')
    // setTimeout(() => {
    //   this.data.mapCtx.moveToLocation({
    //     longitude: this.data.longitude,
    //     latitude: this.data.latitude
    //   }).then(res => {
    //     console.log(res)
    //   }).catch(err => {
    //     console.error(err)
    //   })
    // }, 100)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mCampus = getApp().globalData.campus
    this.setData({
      longitude: mCampus.geo.center.longitude,
      latitude: mCampus.geo.center.latitude
    })

    // 加载后生成MapContext对象
    wx.getLocation({
      type: "gcj02",
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
      }
    })

    if (app.globalData.archItem == undefined) {
      app.globalData.archItem = []
    }
    // 绑定this才能上传
    if (app.globalData.archItem.length > 0) {
      this.setData({
        selectFile: this.selectFile.bind(this),
        uploadFile: this.uploadFile.bind(this),
        archItems: app.globalData.archItem
      })
      selectedArchType = []
      //console.log("SSS",selectedArchType)
      app.globalData.archItem.forEach(e => {
        if (e.selected) {
          selectedArchType.push(e.value)
        }
      })
      //console.log("SSS",selectedArchType)
    } else {
      this.setData({
        selectFile: this.selectFile.bind(this),
        uploadFile: this.uploadFile.bind(this),
      })
    }
    //console.log("sss",selectedArchType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (isLoading = true) {
    if (isLoading) {
      wx.showLoading({
        title: '正在载入建筑物数据',
      })
    }
    // console.log("On Ready")
    archArray = []
    activitiesPoint = []
    realTimeInfoArray = []
    // console.log("act", activitiesPoint)
    let mCampus = getApp().globalData.campus
    // console.log('初始显示的位置:', mCampus.geo.center)
    if (isFirstShow == 1) {
      let mapContext = wx.createMapContext('myMap', this)
      this.setData({
        mapCtx: mapContext
      })
      // console.log('初始化地图')
      this.data.mapCtx.moveToLocation({
        longitude: this.data.longitude,
        latitude: this.data.latitude
      }).then(res => {
        // console.log(res)
      }).catch(err => {
        console.error(err)
      })
    }
    let campusId = app.globalData.campus._id

    let stTime = (new Date()).getTime()
    let tasks = []

    tasks.push(db.preference.getPreference().then(res => {
      let archItems = this.data.archItems
      archItems.forEach(e => {
        res.archItems.forEach(dbEle => {
          if (e.value == dbEle.value) e.selected = dbEle.selected
        })
      })
      this.setData({
        archItems: archItems
      })
    }))
    tasks.push(db.arch.getArchArray(app.globalData.campus._id).then(res => {
      // console.log(res)
      res.forEach((value, index) => {
        let archObj = {
          _id: value._id,
          id: value.markId,
          latitude: value.geo.coordinates[1],
          longitude: value.geo.coordinates[0],
          type: value.type,
          title: value.name,
          width: 50,
          height: 50,
          text: value.text,
          images: value.images
        };
        switch (value.type) {
          case 'canteen':
            archObj.iconPath = "/images/building/canteen.png";
            break;
          case 'dorm':
            archObj.iconPath = "/images/building/dormitory.png";
            break;
          case 'shop':
            archObj.iconPath = "/images/building/shop.png";
            break;
          case 'classRoom':
            archObj.iconPath = "/images/building/classroom.png";
            break;
          case 'college':
            archObj.iconPath = "/images/building/college.png";
            break;
          case 'Service':
            archObj.iconPath = "/images/building/service.png";
            break;
          default:
            archObj.iconPath = (value['logo'] != undefined && value['logo'] != "") ? value['logo'] : "";
            break;
        }
        archArray.push(archObj);
      });
    }))
    tasks.push( // 从数据库中获取标点对象
      db.point.getPointArray(app.globalData.campus._id).then(res => {
        //console.log(res)
        res.forEach((value, index) => {
          // console.log("point:",value)
          // console.log("acarr:", activitiesPoint)
          if (value.type == 'activity')
            activitiesPoint.push({
              _id: value._id,
              id: value.markId,
              title: value.desc.name,
              longitude: value.geo.coordinates[0],
              latitude: value.geo.coordinates[1],
              width: 50,
              height: 50,
              type: value.type,
              iconPath: (value.desc.icon == "") ? value.desc.icon : value.desc.icon,
              text: value.desc.text,
              images: value.desc.images
            })
          else if (value.type == 'current') {
            realTimeInfoArray.push({
              _id: value._id,
              id: value.markId,
              title: value.desc.name,
              longitude: value.geo.coordinates[0],
              latitude: value.geo.coordinates[1],
              width: 50,
              height: 50,
              type: value.type,
              iconPath: "/images/index/realtimeInfo.png",
            })
          }
        })
      }))
    Promise.all(tasks).then(() => {
      this.data.archItems.forEach(e => {
        if (e.selected) {
          if (selectedArchType.indexOf(e.value) == -1) selectedArchType.push(e.value)
        }
      })
      visibleArchArray = []
      // console.log(selectedArchType)
      archArray.forEach((value, index) => {
        if (selectedArchType.indexOf(value.type) != -1) {
          visibleArchArray.push(value)
        }
      })

      // this.setData({
      //   markers: visibleArchArray
      // })
      activitiesPoint.forEach((value, index) => {
        if (selectedArchType.indexOf(value.type) != -1) {
          visibleArchArray.push(value)
        }
      })
      // console.log("visi:", visibleArchArray)
      visibleArchArray = visibleArchArray.concat(realTimeInfoArray)
      this.setData({
          markers: visibleArchArray
        })
        ++isFirstShow
      if (isLoading) {
        wx.hideLoading()
        // console.log('检测代码包版本')
        db._db.collection('static').doc('version').get().then(res => {
          let currentVerCode = getApp().globalData.versionCode
          if (currentVerCode < res.data.versionCode) {
            console.warn(`目前的代码包不是最新的，请及时通过Git拉取最新代码！当前版本：${currentVerCode}，最新版本：${res.data.versionCode}`)
            wx.showToast({
              title: `当前版本${currentVerCode} 最新版本${res.data.versionCode} \n 请及时更新小程序`,
              icon: 'none',
              mask: false,
              duration: 2500
            })
          }
        })
      }
    })
  },
  getObjArrayValues(arr) {
    let values = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['type'] == 'user')
        values.push(arr[i]['type'])
    }
    return values
  },
  getUserLocation: function (res) {
    // console.log(isAdd)
    this.data.currentLocation = res
    if (this.data.showMarkerDialog) {
      return
    } else {
      while (this.getObjArrayValues(visibleArchArray).length > 0) {
        visibleArchArray.forEach((m, idx) => {
          if (m['type'] == "user")
            visibleArchArray.splice(idx, 1)
        })
      }
      // console.log("after: ", visibleArchArray)
      setTimeout(() => {
        let marker = {
          longitude: res.longitude,
          latitude: res.latitude,
          id: util.randomNumberId(),
          iconPath: getApp().globalData.userInfo.userInfo.avatarUrl,
          width: 30,
          height: 30,
          type: "user",
          title: '自己'
        }
        // console.log(marker)
        if (this.getObjArrayValues(visibleArchArray).length == 0 && this.data.showMarkerDialog == false) {
          visibleArchArray.push(marker)
          // console.log("last: ", visibleArchArray)

          this.setData({
            markers: visibleArchArray
          })
        }
      }, 1000);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.markers)
    tempTest.launchTest() //用于临时测试
    tempTest.dbExample() //数据库函数调用示例
    db.section.getSectionArray(app.globalData.school._id).then(res => {
      // console.log(res, res.data[0].name)
      this.setData({
        departmentsItem: this.data.departmentsItem.concat(res.data[0].name)
      })
    })
    // console.log("buildingSelected", app.globalData.buildingSelected)
    if (app.globalData.buildingSelected != null && app.globalData.buildingSelected.type == "activity" && app.globalData.buildingSelected['geo'] != undefined) {
      // console.log("appSelected:",app.globalData.buildingSelected)
      let activitySelected = {
        _id: app.globalData.buildingSelected._id,
        id: app.globalData.buildingSelected.markId,
        width: 50,
        height: 50,
        longitude: app.globalData.buildingSelected.geo.coordinates[0],
        latitude: app.globalData.buildingSelected.geo.coordinates[1],
        title: app.globalData.buildingSelected.desc.name,
        type: app.globalData.buildingSelected.type,
        iconPath: app.globalData.buildingSelected.desc.icon,
        text: app.globalData.buildingSelected.desc.text
      }

      activitySelected.text = activitySelected.text.replaceAll("\\n", '\n')
      this.setData({
        markers: [activitySelected],
        buildingSelected: activitySelected,
        showBuildingDialog: true
      })
    } else if (!this.data.isAddedMarker && isFirstShow != 1) {
      console.log("页面刷新")
      this.onReady(false)
    }
    console.log("页面刷新")
    setTimeout(() => {
      if (!isAdd) {
        wx.startLocationUpdate({
          success: res => {
            console.log(res)
            wx.onLocationChange(this.getUserLocation)
          },
          fail: console.error
        })
      } else {
        wx.stopLocationUpdate({
          success: (res) => {
            console.log(res)
            wx.offLocationChange(this.getUserLocation)
          },
        })
      }
    }, 100);
    // this.getUserLocation
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.stopLocationUpdate()
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