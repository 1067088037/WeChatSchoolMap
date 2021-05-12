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
    },
    introArea: true,
    showTipsArea: false,
    showComment: false,
    isLike: false,
    likePicIndex: null,
    commentValue: null,
    intoComment: false,
    tips: [],
    selectedTip: null,
    showBuilidngBanner: true,
    isCreateNewTip: false,
    files: [],
    commentNum: 0,
    comments: [],
    userAvatars: [],
    userNickName: [],
    likeNums: [],
    userUploadPhotoes:[]
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
      userUploadPhotoes:this.data.userUploadPhotoes.concat(e.detail.urls[0])
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
    let superId = this.data.selectedTip.id.toString()
    console.log(superId)
    db.comment.addComment(superId, "arch", {
      reply: null,
      text: this.data.commentValue,
      images: []
    })
  },
  /**
   * likeClick
   * @param {*} e 
   * @todo 点赞函数，没有云端做法，需要接口获取数据库的攻略内容
   *  
   */
  likeClick(e) {
    let id = parseInt(e.currentTarget.id);
    console.log(id)
    let newtip = new Object
    let idx = 0;
    this.data.tips.forEach((value, index) => {
      if (value.id == id) {
        if (!value.isLike) {
          newtip = value
          newtip.isLike = true;
          newtip.likeNum++;
          idx = index
        } else {
          newtip = value
          newtip.isLike = false;
          newtip.likeNum--;
          idx = index
        }
      }
    })
    console.log(newtip)
    this.data.tips.splice(idx, 1, newtip)
    let tips = this.data.tips
    this.setData({
      tips
    })
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
        showTipsArea: false,
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
      showTipsArea: false,
      introArea: true
    })
  },
  /**
   * toTipsAreaPage
   * @todo 从攻略的具体界面返回攻略界面
   */
  toTipsAreaPage() {
    this.setData({
      selectedTip: null,
      showTipsArea: true,
      showBuilidngBanner: true
    })
  },
  /**
   * returnTipArea
   * @todo 从添加攻略界面返回到攻略界面
   */
  returnTipArea() {
    this.setData({
      isCreateNewTip: false,
      showTipsArea: true,
      showBuilidngBanner: true,
      userUploadPhotoes:[]
    })
  },
  sendTip(){
    this.data.userUploadPhotoes.forEach((e,i)=>{
      const filepath=e;
      const name = i.toString()
      const cloudpath="School/4144010561/images/Tips/tip"+name + filepath.match(/\.[^.]+?$/)[0]
      console.log(cloudpath)
      wx.cloud.uploadFile({
        cloudPath:cloudpath,
        filePath:filepath,
        success:res=>{
          console.log(res.fileId)
        },
        fail:console.error
      })
    })
    
  },
  /**
   * createNewTip
   * @todo 进入添加攻略界面
   */
  createNewTip(e) {
    this.setData({
      isCreateNewTip: true,
      showTipsArea: false,
      showBuilidngBanner: false
    })
  },
  /**
   * tipsAreaTap
   * @param e
   * @returns void
   * @todo 显示攻略区
   */
  tipsAreaTap(e) {
    this.setData({
      showTipsArea: true,
      introArea: false,
      // 测试数据tips,正常使用时应从数据库获取
      tips: [{
        src: "/images/tabBarIcon/design_selected.png",
        id: 1,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 2,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 3,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 4,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }, {
        src: "/images/tabBarIcon/design_selected.png",
        id: 5,
        likeNum: 0,
        isLike: false,
        isClicked: false,
        title: "华南理工大学",
        description: "云山苍苍，珠水泱泱\n华工吾校，伟人遗芳\n" + "前贤创业，后人图强\n" + "崛起南国，培育栋梁\n金银岛畔，湖滨路旁\n红楼耸立，碑铭铿锵"
      }]
    })

  }, // end function
  /**
   * intoDetailTip
   * @param {} e 
   * @todo 进入具体攻略区
   */
  intoDetailTip(e) {
    // 获取该攻略区的评论
    var that = this
    let comments = []
    db.comment.getAllComment(e.currentTarget.id).then(res => {
      let avatars = []
      let likeNums = []
      res.forEach(v => {
        var userAvatar;
        var commentObj = {
          text: v.text,
          id: v._id,
          
        }
        db.user.getUser(v._openid).then(value => {
          that.setData({
            userAvatars: that.data.userAvatars.concat([value.userInfo.avatarUrl]),
            userNickName: that.data.userNickName.concat([value.userInfo.nickName]),
          })
        })
        comments.push(commentObj)
      })
      for(var i=0; i < comments.length;i++)
      {
        let comment = comments[i]
        console.log(comment)
        db.like.countLike(comments[i].id).then(r => {
          // console.log(comment.id,r)
          that.setData({
            likeNums: that.data.likeNums.concat(r)
          })
        })
        
        db.like.isLike(comment.id).then( islike =>{
          comment.isLike = islike 
          console.log(comment.isLike)
        })
      }
      setTimeout(()=>{
        this.setData({
          comments:comments,
          commentNum: res.length
        })
      },1000)
     
    })
    let id = parseInt(e.currentTarget.id)
    console.log(this.data.comments)
    let selectedTip = new Object
    // 从所有发布的攻略中选出用户点击的那个攻略区，通过id选取
    this.data.tips.forEach((value, index) => {
      if (value.id == id) {
        selectedTip = value
        selectedTip.isClicked = true;
      }
    })
    // 显示具体攻略区
    wx.showLoading({
      title: 'loading...',
    })
    setTimeout(() => {
      this.setData({
        selectedTip,
        showTipsArea: false,
        showBuilidngBanner: false,
      })
      wx.hideLoading()
    }, 1000)

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
        likeNums[index] = likeNums[index]+1
        this.setData({
          comments:comment,
          likeNums:likeNums
        })
      }
      else{
        db.like.cancelLike(this.data.comments[index].id)
        let comment = this.data.comments
        comment[index].isLike = false;
        let likeNums = this.data.likeNums;
        likeNums[index] = likeNums[index]-1
        this.setData({
          comments:comment,
          likeNums:likeNums
        })
      }
    })
    
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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