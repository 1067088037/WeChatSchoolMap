// pages/building/building.js
const app = getApp();
var archArray = new Array;
import {
  Campus
} from '../../util/database/campus';
import {
  db
} from '../../util/database/database'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    building: {
      type: 'canteen'
    }, // 保存点开的建筑
    introArea: true, // 简介区域是否显示
    showStrategiesArea: false, // 攻略区域是否显示
    showComment: false, // 攻略按钮显示
    isLike: false, // 攻略是否点赞
    intoComment: false, // 是否进入评论区
    strategies: [], // 攻略集合
    selectedStrategy: null, // 选中的攻略
    showBuilidngBanner: true, // 建筑图片区是否显示
    isCreateNewStrategy: false, // 是否新建攻略
    files: [], // 图片文件
    commentNum: 0, // 评论数量
    comments: [], // 评论数组
    userAvatars: [], // 用户头像
    userNickName: [], // 用户名称
    likeNums: [], // 评论点赞数
    userUploadPhotoes: [], // 用户上传的图片
    strategyTitle: "", // 用户发布的攻略标题
    strategyContent: "", // 用户发布的攻略内容
    strategyBriefIntro: "", // 用户发布的内容简介
    isExitAddStrategy: false, // 是否退出添加攻略界面，弹出对话框
    dialogButtons: [{
      text: "不保存"
    }, {
      text: "保存"
    }], // 对话框按钮集,
    strategiesIds: []

  },
  inputTitle(e) {
    this.setData({
      strategyTitle: e.detail.value
    })
  },
  inputContent(e) {
    this.setData({
      strategyContent: e.detail.value
    })
  },
  inputBriefIntro(e) {
    this.setData({
      strategyBriefIntro: e.detail.value
    })
  },
  /**
   * chooseImage
   * @param {*} e 
   * @todo 选择图片上传
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res.tempFilePaths)
        let obj = {}
        obj['url'] = res.tempFilePaths
        that.setData({
          files: that.data.files.push(obj)
        });
      }
    })
  },
  /**
   * previewImage
   * @param {*} e 当前对象
   * @todo 预览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * selectFile
   * @param {*} files 
   * @todo 选择文件，mp-uploader里的函数 非必填
   */
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  /**
   * uplaodFile
   * @param {}} files 
   * @todo 上传图片，mp-uploader的主要函数，但是目前没实现上传到云端 
   */
  uplaodFile(files) {
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
  /**
   * uploadError
   * @param {}} e 
   * @todo 上传失败的反馈函数
   */
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  /**
   * uploadSuccess
   * @param {}} e 
   * @todo 上传成功的反馈函数
   */
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    this.setData({
      userUploadPhotoes: this.data.userUploadPhotoes.concat(e.detail.urls[0])
    })
  },
  //获取用户输入的评论内容
  getComment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  //发表评论
  sendComment() {
    let superId = this.data.selectedStrategy.id
    console.log("评论所属于的攻略的id为：", superId)

    db.comment.addComment(superId, "strategy", {
      reply: null,
      text: this.data.commentValue,
      images: []
    })
    this.onPullDownRefresh()
    wx.startPullDownRefresh()
    setTimeout(() => {
      wx.stopPullDownRefresh()
      this.setData({
        commentValue: "",
      })
    }, 500)


  },
  /**
   * likeClick
   * @param {*} e 
   * @todo 点赞函数，没有云端做法，需要接口获取数据库的攻略内容
   *  
   */
  likeClick(e) {
    let id = (e.currentTarget.id);
    console.log("点赞攻略的id是：", id)
    let newStrategy = new Object
    let idx = 0;
    this.data.strategies.forEach((value, index) => {
      if (value.id == id) {
        db.like.isLike(id).then(res => {
          if (!res) {
            db.like.giveALike(id);
            newStrategy = value
            newStrategy.isLike = true;
            newStrategy.likeNum++;
            idx = index
          } else {
            db.like.cancelLike(id)
            newStrategy = value
            newStrategy.isLike = false;
            newStrategy.likeNum--;
            idx = index
          }
        })
      }
    })
    setTimeout(() => {
      console.log(newStrategy)
      this.data.strategies.splice(idx, 1, newStrategy)
      let strategies = this.data.strategies
      this.setData({
        strategies
      })
    }, 1000)

  },
  /**
   * intoCommentClick
   * @param {}} e 
   * @todo 进入评论区界面，但是应该进入到具体攻略的评论区界面
   */
  intoCommentClick(e) {
    db.comment.getAllComment('1').then(res => {
      //console.log(res[0].text)
      this.setData({
        showStrategiesArea: false,
        showComment: true,
        comments: [{
          text: res[0].text
        }, {
          text: res[1].text
        }]
      })
    })
  },
  /**
   * toHomePage
   * @todo 从攻略去返回到简介区（主页面）
   */
  toHomePage() {
    this.setData({
      showStrategiesArea: false,
      introArea: true
    })
  },
  /**
   * toStrategiesAreaPage
   * @todo 从攻略的具体界面返回攻略界面
   */
  toStrategiesAreaPage() {
    this.setData({
      selectedStrategy: null,
      showStrategiesArea: true,
      showBuilidngBanner: true
    })
  },
  /**
   * returnStrategyArea
   * @todo 从添加攻略界面返回到攻略界面,弹出对话框是否保存编辑
   */
  returnStrategyArea() {

    this.setData({
      isExitAddStrategy: true,
    })
  },
  /**
   * isSaveEdit
   * @param {*} e 对话框按钮对象
   * @todo  是否保存编辑，不保存则清空数据,保存则上传到数据库
   */
  isSaveEdit(e) {
    console.log(e.detail.item.text)
    if (e.detail.item.text == '不保存') {
      // 清空数据并退出
      this.setData({
        isCreateNewStrategy: false,
        showStrategiesArea: true,
        showBuilidngBanner: true,
        userUploadPhotoes: [],
        StrategyTitle: "",
        StrategyContent: "",
      })
      return;
    }
    if (e.detail.item.text == '保存') {
      // 上传数据到云端
      let name = this.getStrategyName()
      let campusId = this.data.building._id
      let content = [];
      let contentobj = new Object;
      let desc = this.data.strategyBriefIntro
      contentobj['desc'] = this.data.strategyContent;
      contentobj['name'] = this.data.strategyTitle;
      let images = this.updatePhotoesToCloud()
      contentobj['image'] = images;
      content.push(contentobj);
      let strategy = {
        name: name,
        content: content,
        desc: desc,
        type: 'draft'
      }
      db.strategy.addStrategy(campusId, "arch", strategy)
      this.setData({
        isCreateNewStrategy: false,
        showStrategiesArea: true,
        showBuilidngBanner: true,
        userUploadPhotoes: []
      })
      return;
    }
  },

  /**
   * getStrategyName
   * @todo 根据不同建筑，返回不同的name属性
   */
  getStrategyName() {
    return this.data.building.title + "攻略"
  },
  /**
   * updatePhotoesToCloud
   * @todo 上传照片到云端，并且返回储存照片云端路径的数组
   */
  updatePhotoesToCloud() {
    let images = []
    this.data.userUploadPhotoes.forEach((e, i) => {
      const filepath = e;
      const name = Math.round(Math.random * 1000).toString()
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
  /**
   * sendStrategy
   * @todo 上传攻略到数据库
   */
  sendStrategy() {
    let superId = this.data.building._id
    let name = this.getStrategyName();
    //let campusId = app.globalData.campus._id
    let content = [];
    let obj = new Object;
    let desc = this.data.strategyBriefIntro
    obj['desc'] = this.data.strategyContent;
    obj['name'] = this.data.strategyTitle;
    let images = this.updatePhotoesToCloud()
    obj['image'] = images;
    let strategy = {
      name: name,
      content: content,
      desc: desc,
      type: 'publish'
    }
    content.push(obj);
    db.strategy.addStrategy(superId, "arch", strategy)
    this.setData({
      isCreateNewStrategy: false,
      showStrategiesArea: true,
      showBuilidngBanner: true,
      userUploadPhotoes: []
    })
  },
  /**
   * createNewStrategy
   * @todo 进入添加攻略界面
   */
  createNewStrategy(e) {
    this.setData({
      isCreateNewStrategy: true,
      showStrategiesArea: false,
      showBuilidngBanner: false
    })
  },
  /**
   * StrategiesAreaTap
   * @param e
   * @returns void
   * @todo 显示攻略区
   */
  StrategiesAreaTap(e) {
    let testStrategies = [];
    this.data.strategiesIds.forEach(id => {
      db.strategy.getStrategy(id).then(res => {
        console.log("获取到该建筑的攻略： ", res)
        let srcs = []
        res.publish.content[0].image.forEach(im => {
          im = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/" + im
          srcs.push(im)
        })
        let likeNum;
        db.like.countLike(res._id).then(likenums => {
          likeNum = likenums;
        })
        setTimeout(() => {
          let strategy = {
            src: srcs,
            id: res._id,
            likeNum: likeNum,
            isLike: (likeNum) ? true : false,
            intro: res.publish.desc,
            description: res.publish.content[0].desc,
            title: res.publish.content[0].name
          }
          testStrategies.push(strategy)
        }, 1000)
      })
    })
    wx.showLoading({
      title: 'loading...',
    })
    setTimeout(() => {
      this.setData({
        showStrategiesArea: true,
        introArea: false,
        // 测试数据Strategies,正常使用时应从数据库获取
        strategies: [].concat(testStrategies)
      })
      wx.hideLoading()
    }, 1500)



  }, // end function
  /**
   * intoDetailStrategy
   * @param {} e 
   * @todo 进入具体攻略区
   */
  intoDetailStrategy(e) {
    // 获取该攻略区的评论
    var that = this
    let comments = []
    let openIdArray = []
    let commentNum ;
    console.log("选中的攻略id是", e.currentTarget.id)
    db.comment.getAllComment(e.currentTarget.id).then(res => {
      let avatars = []
      let likeNums = []
      commentNum = res.length
      res.forEach(v => {
        var userAvatar;
        var commentObj = {
          text: v.text,
          id: v._id
        }
        comments.push(commentObj)
        openIdArray.push(v._openid)
        db.user.getUser(v._openid).then(value => {
          that.setData({
            userAvatars: that.data.userAvatars.concat([value.userInfo.avatarUrl]),
            userNickName: that.data.userNickName.concat([value.userInfo.nickName]),
          })
        })
      })
    }).then(()=>{
      for (var i = 0; i < comments.length; i++) {
        let comment = comments[i]
        console.log(comment)
        db.like.countLike(comments[i].id).then(r => {
          // console.log(comment.id,r)
          that.setData({
            likeNums: that.data.likeNums.concat(r)
          })
        })
        db.like.isLike(comment.id).then(islike => {
          comment.isLike = islike
          //console.log(comment.isLike)
        })
      }
      setTimeout(() => {
        this.setData({
          comments: comments,
          commentNum: commentNum
        })
      }, 2000)
    })
    let id = (e.currentTarget.id)
    console.log(this.data.comments)
    let selectedStrategy = new Object
    // 从所有发布的攻略中选出用户点击的那个攻略区，通过id选取
    this.data.strategies.forEach((value, index) => {
      if (value.id == id) {
        selectedStrategy = value
        selectedStrategy.isClicked = true;
      }
    })
    // 显示具体攻略区
    wx.showLoading({
      title: 'loading...',
    })
    setTimeout(() => {
      this.setData({
        selectedStrategy,
        showStrategiesArea: false,
        showBuilidngBanner: false,
      })
      wx.hideLoading()
    }, 1500)
  },
  giveLike(e) {
    console.log(getApp().globalData.openid)
    let index = parseInt(e.currentTarget.id)
    var that = this
    console.log(this.data.comments[index].id)
    let isLike;
    db.like.isLike(this.data.comments[index].id).then(r => {
      isLike = r;
      console.log(isLike)
      if (!isLike) {
        db.like.giveALike(this.data.comments[index].id)
        let comment = this.data.comments
        comment[index].isLike = true;
        let likeNums = this.data.likeNums;
        likeNums[index] = likeNums[index] + 1
        this.setData({
          comments: comment,
          likeNums: likeNums
        })
      } else {
        db.like.cancelLike(this.data.comments[index].id)
        let comment = this.data.comments
        comment[index].isLike = false;
        let likeNums = this.data.likeNums;
        likeNums[index] = likeNums[index] - 1
        this.setData({
          comments: comment,
          likeNums: likeNums
        })
      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.globalData.markerId)
    if (app.globalData.markerId) {
      this.setData({
        markerId: app.globalData.markerId
      })
    }
    if (app.globalData.buildingSelected != null) {
      this.setData({
        building: app.globalData.buildingSelected
      })
    }
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    db.strategy.getBriefStrategyArray(this.data.building._id).then(res => {
      console.log("获取到该建筑的简略信息", res)
      res.forEach(e => {
        let id = [e._id]
        this.setData({
          strategiesIds: this.data.strategiesIds.concat(id)
        })
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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