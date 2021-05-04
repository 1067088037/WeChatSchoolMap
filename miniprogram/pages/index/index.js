const app = getApp()
import { db } from '../../util/database/database'

// 宿舍点
const dormPoint = [{
  id: 101,
  title: "C1",
  longitude: 113.40182571464311,
  latitude: 23.046767824328636
}, {
  id: 102,
  title: "C2",
  longitude: 113.40120928117472,
  latitude: 23.0471646583267
}, {
  id: 103,
  title: "C3",
  longitude: 113.40185021415175,
  latitude: 23.047504186700028
}, {
  id: 104,
  title: "C4",
  longitude: 113.40054522533796,
  latitude: 23.047954877693126
}, {
  id: 105,
  title: "C5",
  longitude: 113.40153348539627,
  latitude: 23.04808106296843
}, {
  id: 106,
  title: "C6",
  longitude: 113.40149859469557,
  latitude: 23.048927878982695
}, {
  id: 107,
  title: "C7",
  longitude: 113.40034925086616,
  latitude: 23.048802272349267
}, {
  id: 108,
  title: "C8",
  longitude: 113.4010858530205,
  latitude: 23.04949424941177
}, {
  id: 109,
  title: "C9",
  longitude: 113.40125681993754,
  latitude: 23.050102380343247
}, {
  id: 110,
  title: "C10",
  longitude: 113.40164970605144,
  latitude: 23.050733632220382
}, {
  id: 111,
  title: "C11",
  longitude: 113.40054931683858,
  latitude: 23.050845904343497
}, {
  id: 112,
  name: "C12",
  longitude: 113.40021512898329,
  latitude: 23.051718927598355
}, {
  id: 113,
  title: "C13",
  longitude: 113.40095258016413,
  latitude: 23.05209316546067
}, {
  id: 114,
  title: "C14",
  longitude: 113.40095258016413,
  latitude: 23.05209316546067
}, {
  id: 115,
  title: "C15",
  longitude: 113.40284351234652,
  latitude: 23.05287646883959
}, {
  id: 116,
  title: "C16",
  longitude: 113.40274251516541,
  latitude: 23.052148280064554
}, {
  id: 117,
  title: "C17",
  longitude: 113.40181814367634,
  latitude: 23.051614075600956
}, {
  id: 118,
  title: "D5",
  longitude: 113.40228047286575,
  latitude: 23.04808907708455
}, {
  id: 119,
  title: "D3",
  longitude: 113.40291996021574,
  latitude: 23.047460629981458
}]
const classRoomPoint = [{
  id: 201,
  title: "A1",
  longitude: 113.40556827398132,
  latitude: 23.047712869258447
}, {
  id: 202,
  title: "A2",
  longitude: 113.4055623261861,
  latitude: 23.048541478195286
}, {
  id: 203,
  title: "A3",
  longitude: 113.40546513492075,
  latitude: 23.049398833812845
}, {
  id: 204,
  title: "A4/A5",
  longitude: 113.4060915745905,
  latitude: 23.05017228010393
}] // 教学楼点
const collgePoint = [{
  id: 301,
  title: "B1国际楼",
  longitude: 113.40971094123438,
  latitude: 23.045284933369096
}, {
  id: 302,
  title: "B2医学院",
  longitude: 113.4086426292954,
  latitude: 23.04351926552582
}, {
  id: 303,
  title: "B3计算机科学与工程学院",
  longitude: 113.40868765581808,
  latitude: 23.045283987726666
}, {
  id: 304,
  title: "B4环境与能源学院",
  longitude: 113.40820212982726,
  latitude: 23.04456072757484
}, {
  id: 305,
  title: "B5能源研究学院",
  longitude: 113.40798590988652,
  latitude: 23.04575321449248
}, {
  id: 306,
  title: "B6生命科学于工程学院",
  longitude: 113.40741639450039,
  latitude: 23.04494517662861
}, {
  id: 307,
  title: "B7软件学院",
  longitude: 113.40742290742037,
  latitude: 23.046054516291566
}, {
  id: 308,
  title: "B8软件学院",
  longitude: 113.40683712367672,
  latitude: 23.045217041240647
}, {
  id: 309,
  title: "B9法学院",
  longitude: 113.40752034838943,
  latitude: 23.04816555065419
}, {
  id: 310,
  title: "B9新闻与传播学院",
  longitude: 113.40755053568273,
  latitude: 23.047758523388648
}, {
  id: 311,
  title: "B10经济与金融学院",
  longitude: 113.40734142376141,
  latitude: 23.049188072396547
}, {
  id: 312,
  title: "B10电子商务系",
  longitude: 113.40749441572348,
  latitude: 23.048559842489716
}, {
  id: 313,
  title: "B10旅游管理系",
  longitude: 113.4075529575232,
  latitude: 23.048885688944768
}, {
  id: 314,
  title: "B11设计学院/艺术学院",
  longitude: 113.40766014558994,
  latitude: 23.050032315286327
},] // 学院点
const canteenPoint = [{
  id: 1,
  title: "第一学生饭堂",
  longitude: 113.40268387434162,
  latitude: 23.04866925793428
}, {
  id: 2,
  title: "第二学生饭堂",
  longitude: 113.40333534303113,
  latitude: 23.051645364973492
}, {
  id: 3,
  title: "世博超市",
  longitude: 113.40203129147403,
  latitude: 23.048593578356705
}, {
  id: 4,
  title: "未来商店",
  longitude: 113.40235747403517,
  latitude: 23.047952836541615
}, {
  id: 5,
  title: "7-11便利店",
  longitude: 113.40188492453046,
  latitude: 23.051165789442734
}, {
  id: 6,
  title: "真功夫&猫熊煮茶",
  longitude: 113.40232360687605,
  latitude: 23.051009822324243
}] // 饭堂以及世博点
const deliverPickUpPoint = [] // 拿快递的点
const vouchCenterPoint = [] // 充值点
var activitiesPoint = [] // 活动标记点 -- 暂存
var isAdd = false; // 是否添加的标记
var flag = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    endate: "2021-05-04", // 活动结束日期 
    radioItems: [
      { name: "全校可见", value: '0', checked: true },
      { name: "仅本学院可见", value: '1' }
    ] // 可见性选项
  },
  /**
   * bindDateChange
   * @param {*} e 
   * @todo 改变日期
   */
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  /**
   * mapTap
   * @param {*} e 点击处的信息
   * @todo 获取点击处的经纬度
   */
  mapTap(e) {
    // console.log(e.detail);
    if (isAdd) {
      let latitude_ = e.detail.latitude;
      let longitude_ = e.detail.longitude;
      let userPoint = [{
        longitude: longitude_,
        latitude: latitude_,
      }]
      // console.log(latitude_) 
      this.setData({
        markers: userPoint,
        showMarkerDialog: true
      });

    } else
      return 0;
  },

  returnMarker(e) {
    isAdd = false;
    this.data.markers.pop()
    this.setData({
      markers: [],
      isAddedMarker: false,
      showMarkerDialog: false
    });

  },
  cancelMarker() {
    this.data.markers.pop()
    this.setData({
      markers: [],
      showMarkerDialog: false,

    })
    isAdd = false
  },
  confirmMarker() {
    this.setData({
      isAddedMarker: true,
      showMarkerDialogfa: false
    })
  },
  confirmTap(e) {
    isAdd = false;
    activitiesPoint.push(this.data.markers.pop())
    this.setData({
      markers: activitiesPoint,
      isAddedMarker: false,
      showMarkerDialog: false
    })

  },

  // 获取屏幕中心经纬度
  getCenterLocation_() {
    this.data.mapCtx.getCenterLocation({
      success: (res) => {
        return [{ longitude: res.longitude, latitude: res.latitude }]
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
        var markers_ = [{ latitude: 23.04866925793428, longitude: 113.40268387434162 }];
        this.setData({
          pagePosition: "center",
          isMoreTrue: false,
          markers: markers_
        })
        isAdd = true;
        break;
      }
      case "筛选": {
        this.setData({
          pagePosition: "center",
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
    console.log(isAdd);
  },
  // 只显示宿舍
  DormOnly() {
    const markers = dormPoint;
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
  collgeOnly() {
    const markers = collgePoint;
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
  // 根据markerID获取经纬度
  getLatitude(id) {
    let markerArr;
    console.log(flag)
    switch (flag) {
      case 1: {
        markerArr = dormPoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.latitude;
        })
      }
      case 2: {
        markerArr = classRoomPoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.latitude;
        })
      }
      case 3: {
        markerArr = collgePoint
        markerArr.forEach(function (item) {
          if (item.id == id)
            return item.latitude;
        })
      }
      case 4: {
        markerArr = canteenPoint
        for (var i = 0; i < markerArr.length; i++) {
          console.log(markerArr[i].id)
          if (id == markerArr[i].id)
            return markerArr[i].latitude
        }

      }
    }

  },
  getLongtitude(id) {
    let markerArr;
    console.log(flag)
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
        markerArr = collgePoint
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
    console.log(e.detail.markerId)
    app.globalData.markerId = e.detail.markerId
    app.globalData.desLatitude = this.getLatitude(e.detail.markerId)
    app.globalData.desLongtitude = this.getLongtitude(e.detail.markerId)
    this.setData({
      showBuildingDialog: true
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
      app.globalData.markerId = 0
      app.globalData.desLatitude = 0
      app.globalData.desLongtitude = 0
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

  // 退出功能页面
  showPrev() {
    this.setData({
      showPage: false
    })
  },

  // page-container的触发函数，不写以下这些函数会警告
  onBeforeEnter(res) {
    console.log(res)
  },
  onEnter(res) {
    console.log(res)
  },
  onAfterEnter(res) {
    console.log(res)
  },
  onBeforeLeave(res) {
    console.log(res)
  },
  onLeave(res) {
    console.log(res)
  },
  onAfterLeave(res) {
    console.log(res)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载后生成MapContext对象
    wx.getLocation({
      type: "wsg84",
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude, longitude)
      }
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // dormPoint.forEach(e => {
    //   // let e = dormPoint[0]
    //   let arch = {
    //     name: e.title,
    //     logo: null,
    //     type: "dorm",
    //     geo: db.Geo.Point(e.longitude, e.latitude)
    //   }
    //   db.arch.addArch('1ace8ef160901b1b008f69ae08b0ee8a', arch)
    //   console.log(e)
    // })

    // db.arch.getArchArray('1ace8ef160901b1b008f69ae08b0ee8a').then(arr => {
    //   arr.forEach(e => {
    //     db.arch.removeArch(e)
    //     // console.log(e)
    //   })
    // })
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