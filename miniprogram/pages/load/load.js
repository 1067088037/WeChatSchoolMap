// pages/load/load.js

const db = getApp().globalData.db

var schoolData = []
var campusData = []

function getUserInfo(that, openid) {
  db.user.getUserInfo(openid).then(res => {
    getApp().globalData.userInfo = res
    if (res != null) {
      loadSchoolAndCampus(that)
    } else {
      if (wx.getUserProfile) {
        that.setData({
          needToGetUserInfo: true
        })
      }
    }
  }).catch(e => console.log(e))
}

function loadSchoolAndCampus(that) {
  db.user.getSchoolAndCampus(getApp().globalData.openid).then(res => {
    // console.log(res)
    if (res) {
      db.school.getSchoolById(res.schoolId.id).then(school => {
        getApp().globalData.school = school
        // console.log(school)
        school.campus.forEach(function (e) {
          if (e.id == res.campusId.id) {
            getApp().globalData.campus = e
            that.next()
          }
        })
      })
    } else {
      getSchoolAndCampusToChoose(that)
    }
  })
}

function getSchoolAndCampusToChoose(that) {
  that.setData({
    needToGetUserInfo: false
  })
  db.cloud.collection('index').doc('school').get().then(res => {
    let tempSchool = []
    let data = res.data.data
    schoolData = data
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
    db.school.getCampusById(schoolData[index].id).then(res => {
      campusData = res
      let tempCampus = []
      res.forEach(element => {
        tempCampus.push(element.name)
      });
      this.setData({
        schoolIndex: index,
        campusArray: tempCampus
      })
    })
  },
  //校区选择器
  bindCampusPickerChange: function (e) {
    this.setData({
      campusIndex: e.detail.value
    })
  },
  //
  onConfirmTapped: function () {
    db.user.setSchoolAndCampus(getApp().globalData.openid, schoolData[this.data.schoolIndex], campusData[this.data.campusIndex])
    loadSchoolAndCampus(this)
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
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log("获取用户信息成功")
              db.user.setUserInfo(getApp().globalData.openid, res.userInfo)
              getApp().globalData.userInfo = res.userInfo;
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
        console.log("在缓存中获取openid成功")
        getApp().globalData.openid = res.data
        getUserInfo(that, res.data)
      },
      fail() {
        console.log("在缓存中获取openid失败")
        db.user.getOpenId().then(openid => {
          console.log("从服务器拉取openid成功")
          wx.setStorage({
            key: 'openid',
            data: openid,
          }) //设置缓存
          getApp().globalData.openid = openid
          getUserInfo(that, openid)
        }).catch(e => console.log(e))
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