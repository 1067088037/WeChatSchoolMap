import { db } from '../../util/database/database'

var schoolData = []
var campusData = []
var _openid = null

function getUserInfo(that, openid) {
  db.user.getUser(openid).then(res => {
    if (res == null) { //用户信息为空
      if (wx.getUserProfile) { //获取用户配置
        that.setData({
          needToGetUserInfo: true
        })
      }
    } else {
      let userInfo = res
      getApp().globalData.userInfo = userInfo //暂存用户信息
      // console.log(userInfo)
      loadSchoolAndCampus(that) //加载学校和校区
    }
  })
}

function loadSchoolAndCampus(that) {
  // console.log('loadSchoolAndCampus')
  db.user.getUser(_openid).then(res => {
    if (res != null || getApp().globalData.userInfo != null) {
      let info = {}
      if (res != null) info = res.info
      else getSchoolAndCampusToChoose(that)
      if (Object.keys(info).length == 0) { //对象为空
        getSchoolAndCampusToChoose(that)
      } else {
        db.school.getSchool(info.school).then(school => {
          getApp().globalData.school = school
          // console.log(school)
          db.campus.getCampus(info.campus).then(campus => {
            // console.log(campus)
            getApp().globalData.campus = campus
            that.next()
          })
        })
      }
    }
  })
}

function getSchoolAndCampusToChoose(that) {
  that.setData({
    needToGetUserInfo: false
  })
  db.school.getAllSchool().then(res => {
    let tempSchool = []
    let data = res.result.data
    schoolData = data
    // console.log(schoolData)
    data.forEach(element => {
      tempSchool.push(element.name)
    });
    that.setData({
      chooseSchool: true,
      schoolArray: tempSchool
    })
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    needToGetUserInfo: false,
    chooseSchool: false,
    schoolArray: [],
    schoolIndex: -1,
    campusArray: [],
    campusIndex: -1
  },
  //学校选择器
  bindSchoolPickerChange: function (e) {
    let index = e.detail.value
    if (index == -1) return
    // console.log(schoolData[index].campus)
    let tempCampus = []
    schoolData[index].campus.forEach(e => {
      db.campus.getCampus(e).then(res => {
        // console.log(res)
        campusData.push(res)
        tempCampus.push(res.name)
        this.setData({
          schoolIndex: index,
          campusArray: tempCampus
        })
      })
    })
  },
  //校区选择器
  bindCampusPickerChange: function (e) {
    this.setData({
      campusIndex: e.detail.value
    })
  },
  //点击确定键
  onConfirmTapped: async function () {
    // console.log(schoolData[this.data.schoolIndex])
    // console.log(campusData[this.data.campusIndex])
    await db.user.setInfo(_openid, {
      school: schoolData[this.data.schoolIndex]._id, campus: campusData[this.data.campusIndex]._id
    }).then(res => {
      loadSchoolAndCampus(this)
    })
  },
  //如果成功获取用户信息则跳转到
  next: function () {
    if (getApp().globalData.userInfo != undefined)
      wx.switchTab({
        url: '../index/index'
      })
  },
  // 获取用户信息的函数
  getUserProfile() {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserProfile({
            desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log("获取用户信息成功")
              // console.log(res)
              db.user.setUserInfo(_openid, res.userInfo)
              getApp().globalData.userInfo = res.userInfo
              // console.log(getApp().globalData.userInfo)
              loadSchoolAndCampus(that)
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log("在缓存中获取openid成功 = " + res.data)
        _openid = res.data
        getApp().globalData.openid = res.data
        getUserInfo(that, res.data)
      },
      fail() {
        console.log("在缓存中获取openid失败")
        db.user.getOpenId().then(res => {
          _openid = res.result.openid
          console.log("从服务器拉取openid成功 = " + _openid)
          wx.setStorage({
            key: 'openid',
            data: _openid,
          }) //设置缓存
          getApp().globalData.openid = _openid
          getUserInfo(that, _openid)
        })
      }
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