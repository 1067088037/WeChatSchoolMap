import { db } from '../../util/database/database'
const util = require('../../util/util')

var schoolData = []
var campusData = []
var _openid = null

function getUserInfo(that, openid) {
  db.user.getUser(openid).then(res => {
    // console.log(res)
    if (res == null) { //用户信息为空
      console.log("用户信息为空")
      that.setData({
        needToGetUserInfo: true //显示获取用户信息提示
      })
    } else {
      getApp().globalData.userInfo = res //暂存用户信息
      loadSchoolAndCampus(that) //加载学校和校区
    }
  })
}

function loadSchoolAndCampus(that) {
  // console.log('loadSchoolAndCampus')
  db.user.getUser(_openid).then(res => {
    // console.log(res)
    if (res != null) {
      getApp().globalData.userInfo = res
      let info = res.info
      if (info == undefined || info['school'] == undefined || info['school'] == undefined) { //对象为空
        getSchoolAndCampusToChoose(that)
      } else {
        let tasks = []
        tasks.push(db.school.getSchool(info.school).then(school => { getApp().globalData.school = school }))
        tasks.push(db.campus.getCampus(info.campus).then(campus => { getApp().globalData.campus = campus }))
        Promise.all(tasks).then(() => {
          that.next()
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
    wx.showLoading({
      title: '正在保存信息',
      mask: true
    })
    await db.user.setInfo(_openid, {
      school: schoolData[this.data.schoolIndex]._id,
      campus: campusData[this.data.campusIndex]._id,
      section: { admin: null, join: [] },
      permission: 16
    }).then(res => {
      wx.hideLoading()
      loadSchoolAndCampus(this)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '网络异常',
        icon: 'error'
      })
    })
  },
  //如果成功获取用户信息则跳转到
  next: function () {
    if (getApp().globalData.userInfo != undefined) {
      // console.log('向数据库更新运行时')
      db._db.collection('user').doc(getApp().globalData.userInfo._openid).update({
        data: {
          lastLoginTime: db.serverDate(),
          runtimeVersion: getApp().globalData.versionCode
        }
      })
      // console.log('跳转页面')
      db.preference.checkInit().then(() => {
        wx.switchTab({
          url: '../index/index'
        })
      }).catch(err => {
        wx.switchTab({
          url: '../index/index'
        })
      })
    } else {
      console.log('userInfo为空')
    }
  },
  // 获取用户信息的函数
  getUserProfile() {
    var that = this
    console.log('getUserProfile')
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserProfile({
            desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: res => {
              console.log("获取用户信息成功")
              getApp().globalData.userInfo = res.userInfo
              db.user.setUserInfo(_openid, res.userInfo).then(() => {
                console.log('.then 设置用户信息成功')
                loadSchoolAndCampus(that)
              })
            },
            fail: err => {
              console.log('获取用户信息失败')
              wx.showToast({
                title: '获取信息失败',
                icon: 'error'
              })
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
        getApp().globalData.openid = _openid
        getUserInfo(that, _openid)
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