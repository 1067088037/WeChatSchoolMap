// pages/building/building.js
const app = getApp();
var archArray = new Array;
import {
  Campus
} from '../../util/database/campus';
import {
  db
} from '../../util/database/database'
import {
  LogTime
} from '../../util/util';
const util = require('../../util/util')
const CloudPathFront = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/";

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
  notShowDeleteComment(e) {
    console.log(e)
    if (this.data.isDeleteComment) {
      this.setData({
        isDeleteComment: false,
        deletCommentId: "",
        deletCommentsuperId: ""
      })
    }
  },
  showDeleteComment(e) {
    console.log(e)
    let openid = app.globalData.openid
    let commentId = e.currentTarget.id
    let commentX = e.touches[0].clientX * 2
    let commentY = e.touches[0].clientY * 2
    this.data.comments.forEach(e => {
      if (commentId == e.id && openid == e.openid) {
        this.setData({
          isDeleteComment: true,
          commentX,
          commentY,
          deletCommentId: commentId,
          deletCommentsuperId: e.superId
        })
      }
    })

  },
  toDeletComment(e) {
    // removeComment
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "是否要删除评论",
      confirmColor: "#FF0000",
      success: res => {
        if (res.confirm) {
          db.comment.removeComment(this.data.deletCommentId).then((res) => {
            if (!res.refuse) {
              this.intoDetailStrategy(this.data.deletCommentsuperId)
              this.setData({
                isDeleteComment: false,
                deletCommentId: "",
                deletCommentsuperId: ""
              })
            }
          })
        }
      }
    })
  },
  onPageScroll(e) {
    // console.log(e)
    if (this.data.isDeleteComment) {
      this.setData({
        isDeleteComment: false,
        deletCommentId: "",
        deletCommentsuperId: ""
      })
    }
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
    let that = this
    let superId = this.data.selectedStrategy.id
    console.log("评论所属于的攻略的id为：", superId)

    db.comment.addComment(superId, "strategy", {
      reply: null,
      text: this.data.commentValue,
      images: []
    }).then(res => {
      if (!res.refuse) {
        this.intoDetailStrategy(superId)
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          commentValue: "",
        })
      }
    })
  },
  /**
   * likeClick
   * @param {*} e 
   * @todo 点赞函数，没有云端做法，需要接口获取数据库的攻略内容
   *  
   */
  likeClick(e) {
    console.log(e)
    let id = e.currentTarget.id;
    console.log("点赞攻略的id是：", id)
    let newStrategy = {}
    let idx = 0;
    this.data.strategies.forEach((value, index) => {
      if (value.id == id) {
        db.like.isLike(id).then(res => {
          if (!res) {
            return db.like.giveALike(id).then(res => {
              newStrategy = value
              if (!res.refuse) {
                newStrategy.isLike = true;
                newStrategy.likeNum++;
              }
              idx = index
            })
          } else {
            return db.like.cancelLike(id).then(res => {
              newStrategy = value
              if (!res.refuse) {
                newStrategy.isLike = false;
                if (newStrategy.likeNum > 1) newStrategy.likeNum--;
              }
              idx = index
            })
          }
        }).then(() => {
          console.log(newStrategy)
          this.data.strategies.splice(idx, 1, newStrategy)
          let strategies = this.data.strategies
          this.setData({
            strategies
          })
        })
      }
    })
  },
  strategyLike(e) {
    let newObject = this.data.selectedStrategy;
    db.like.isLike(newObject.id).then(res => {
      if (!res) {
        return db.like.giveALike(newObject.id).then(res => {
          if (!res.refuse) {
            newObject.likeNum++;
            newObject.isLike = true;
          }
        })
      } else {
        return db.like.cancelLike(newObject.id).then(res => {
          if (!res.refuse) {
            newObject.likeNum--;
            newObject.isLike = false;
          }
        })
      }
    }).then(() => {
      this.setData({
        selectedStrategy: newObject
      })
    })
  },
  /**
   * toHomePage
   * @todo 从攻略去返回到（主页面）
   */
  toHomePage() {
    app.globalData.buildingSelected = null;
    wx.reLaunch({
      url: '../index/index',
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
    if (this.data.strategyTitle == "" && this.data.strategyBriefIntro == "" && this.data.strategyContent == "") {
      this.setData({
        isCreateNewStrategy: false,
        showStrategiesArea: true,
        showBuilidngBanner: true,
        userUploadPhotoes: [],
        StrategyTitle: "",
        StrategyContent: "",
      })
    } else {
      this.setData({
        isExitAddStrategy: true,
      })
    }
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
      db.strategy.addStrategy(campusId, "arch", strategy).then(res => {
        if (!res.refuse) {
          this.setData({
            isCreateNewStrategy: false,
            showStrategiesArea: true,
            showBuilidngBanner: true,
            userUploadPhotoes: []
          })
        }
      })
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
      let name = util.randomId()
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
    db.strategy.addStrategy(superId, "arch", strategy).then(res => {
      if (!res.refuse) {
        this.setData({
          isCreateNewStrategy: false,
          showStrategiesArea: true,
          showBuilidngBanner: true,
          userUploadPhotoes: []
        })
      }
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
    wx.showLoading({
      title: 'loading...',
    })
    this.data.strategiesIds.forEach(id => {
      db.strategy.getStrategy(id).then(res => {
        console.log("获取到该建筑的攻略： ", res)
        let srcs = [];
        res.publish.content[0].image.forEach(im => {
          im = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/" + im
          srcs.push(im)
        })
        let likeNum;
        db.like.countLike(res._id).then(likenums => {
          likeNum = likenums;
        }).then(() => {
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
          this.setData({
            showStrategiesArea: true,
            introArea: false,
            // 测试数据Strategies,正常使用时应从数据库获取
            strategies: [].concat(testStrategies)
          })
        })
      })
    })
  }, // end function
  /**
   * intoDetailStrategy
   * @param {} e 
   * @todo 进入具体攻略区
   */
  intoDetailStrategy(e) {
    let log = new LogTime("进入具体攻略区")
    log.enable = false
    // 获取该攻略区的评论
    console.log(e)
    var that = this
    let comments = []
    let openIdArray = []
    let commentsIdArray = []
    let userInfos = []
    let isAndLikeNum = []
    let commentNum;
    let targetStrategyId = (e['type'] == 'tap') ? e.currentTarget.id : e;
    console.log("选中的攻略id是", targetStrategyId)
    wx.showLoading({
      title: 'loading...',
    })

    log.logTime("开始请求评论")
    log.logTime("开始请求评论")
    db.comment.getAllComment(targetStrategyId).then(res => {
      log.logTime("评论请求完成")
      console.log("res: ", res)
      let avatars = []
      let likeNums = []
      commentNum = res.length
      res.forEach(v => {
        if (v.text != undefined) {
          var commentObj = {
            openid: v._openid,
            text: v.text,
            id: v._id,
            superId: v.super._id
          }
          commentsIdArray.push(v._id)
          comments.push(commentObj)
          openIdArray.push(v._openid)
        } else {
          commentNum--;
        }
      })
      if (commentNum > 0) {
        db.user.getUserInfoArray(openIdArray).then(res => {
          log.logTime("初步处理完成")

          let tasks = []
          tasks.push(db.user.getUserInfoArray(openIdArray).then(res => {
            log.logTime("getUserInfoArray")

            console.log(res)
            res.result.forEach(e => {
              userInfos.push(e)
            })
            //console.log("userInfo: ", userInfos)
          }))
          tasks.push(db.like.getIsAndCountLike(commentsIdArray).then(res => {
            console.log(res)
            log.logTime("getIsAndCountLike")
            res.result.forEach(e => {
              isAndLikeNum.push(e)
            })
            //console.log("isAndLikeNum: ", isAndLikeNum)
          }))
          log.logTime("发送用户信息和点赞的请求")

          Promise.all(tasks).then(res => {
            log.logTime("网络请求完毕")
            console.log(res)
            comments.forEach(comment => {
              let user = userInfos.find((item, index) => {
                //console.log(item._openid, comment.openid)
                return item._openid == comment.openid
              })
              comment['userAvatarUrl'] = user.avatarUrl
              comment['nickName'] = user.nickName
              let likeObj = isAndLikeNum.find((item, index) => {
                return comment.id == item.superId
              })
              wx.hideLoading();
              comment['isLike'] = likeObj.isLike
              comment['likeNum'] = likeObj.count
            })
            // 显示具体攻略区
            this.setData({
              selectedStrategy,
              comments: comments,
              commentNum: commentNum,
              showStrategiesArea: false,
              showBuilidngBanner: false,
            })

            // comment['isLike'] = likeObj.isLike
            // comment['likeNum'] = likeObj.count
          })
          // 显示具体攻略区
          this.setData({
            selectedStrategy,
            comments: comments,
            commentNum: commentNum,
            showStrategiesArea: false,
            showBuilidngBanner: false,
          })

          log.logTime("页面加载完毕")
          log.refreshStTime()
        })
      } else {
        this.setData({
          selectedStrategy,
          comments: comments,
          commentNum: commentNum,
          showStrategiesArea: false,
          showBuilidngBanner: false,
        })
        wx.hideLoading();
      }
    })
    let id = targetStrategyId
    let selectedStrategy = new Object
    // 从所有发布的攻略中选出用户点击的那个攻略区，通过id选取
    this.data.strategies.forEach((value, index) => {
      if (value.id == id) {
        selectedStrategy = value
        selectedStrategy.isClicked = true;
      }
    })

    log.logTime("异步请求发送完毕")

    log.logTime("异步请求发送完毕")

  },
  giveLike(e) {
    console.log(getApp().globalData.openid)
    let index = parseInt(e.currentTarget.id)
    var that = this
    //console.log(this.data.comments[index].id)
    let isLike;
    let comment = this.data.comments
    db.like.isLike(this.data.comments[index].id).then(async r => {
      isLike = r;
      // console.log(isLike)
      if (!isLike) {
        const res = await db.like.giveALike(this.data.comments[index].id);
        if (!res.refuse) {
          comment[index].isLike = true;
          // let likeNums = this.data.likeNums;
          comment[index].likeNum = comment[index].likeNum + 1;
        }
      } else {
        const res_1 = await db.like.cancelLike(this.data.comments[index].id);
        if (!res_1.refuse) {
          comment[index].isLike = false;
          comment[index].likeNum = comment[index].likeNum - 1;
        }
      }
    }).then(() => {
      this.setData({
        comments: comment,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.buildingSelected)
    if (app.globalData.markerId) {
      this.setData({
        markerId: app.globalData.markerId
      })
    }
    if (app.globalData.buildingSelected != null) {
      let building = app.globalData.buildingSelected
      console.log("building:", building.desc)
      let images = []
      if (building.desc == undefined) {
        if (building.images != undefined) {
          // building.images.forEach(e => {
          //   e = CloudPathFront + e
          //   images.push(e)
          // })
          // console.log(building)
          // building.images = images
          this.setData({
            building: building
          })
        } else {
          this.setData({
            building: building
          })
        }
      } else if (building.desc != undefined) {
        if (building.desc.images.length > 0) {
          images = building.desc.images;
          building.images = images
          building.text = building.desc.text
          this.setData({
            building: building
          })
        }
      }
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

    console.log(this.data.strategiesIds)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: 'loading...',
    })
    let that = this
    console.log("Ready")
    let strategiesId = []
    let testStrategies = []
    db.strategy.getBriefStrategyArray(this.data.building._id).then(res => {
      console.log("获取到该建筑的简略信息", res)
      res.forEach(e => {
        strategiesId.push(e._id);
      })
      console.log(strategiesId)
      strategiesId.forEach(id => {
        db.strategy.getStrategy(id).then(strategy => {
          let tempStrategy = {}
          console.log("获取到该建筑的攻略： ", strategy)
          let srcs = [];
          strategy.publish.content[0].image.forEach(im => {
            im = "cloud://cloud1-4gd8s9ra41d160d3.636c-cloud1-4gd8s9ra41d160d3-1305608874/" + im
            srcs.push(im)
          })
          tempStrategy['src'] = srcs;
          tempStrategy['id'] = strategy._id;
          tempStrategy['intro'] = strategy.publish.desc;
          tempStrategy['description'] = strategy.publish.content[0].desc;
          tempStrategy['title'] = strategy.publish.content[0].name;
          testStrategies.push(tempStrategy)
        })
      })
    }).then(() => {
      db.like.getIsAndCountLike(strategiesId).then(res => {
        console.log("res", res)
        console.log("testStrategies", testStrategies)
        testStrategies.forEach(s => {
          let isAndlike = res.result.find((item, index) => {
            return item.superId == s.id
          })
          s['likeNum'] = isAndlike.count;
          s['isLike'] = isAndlike.isLike;
        })
      }).then(() => {
        testStrategies.forEach(e => {
          db.comment.getAllComment(e.id).then(com => {
            e.commentNum = com.length
            console.log(com.length)
          }).then(() => {
            this.setData({
              strategies: testStrategies
            })
          })
        })
        this.setData({
            //strategies: (testStrategies),
            strategiesId
          }),
          wx.hideLoading({
            success: (res) => {},
          })
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