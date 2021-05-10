const _db = wx.cloud.database()
const cmd = _db.command

export class Like {
  /**
   * 点赞，赞的父类必须是评论
   * @param {string} commentId 
   */
  giveALike(commentId) {
    let openid = getApp().globalData.openid
    if (openid == null) {
      console.error('点赞的openid为null')
    } else {
      _db.collection('like').where({
        "super._id": commentId
      }).update({
        data: {
          like: cmd.addToSet(openid)
        }
      })
    }
  }

  /**
   * 取消点赞
   * @param {string} commentId 
   */
  cancelLike(commentId) {
    _db.collection('like').where({
      "super._id": commentId
    }).update({
      data: {
        like: cmd.pull(getApp().globalData.openid)
      }
    })
  }

  /**
   * 判断是否已经点赞
   * @param {string} commentId 
   */
  async isLike(commentId) {
    try {
      return await _db.collection('like').where({
        'super._id': commentId
      }).get().then(res => res.data[0].like.indexOf(getApp().globalData.openid) != -1)
    } catch (e) {
      return false
    }
  }

  /**
   * 获取点赞个数
   * @param {string} commentId 
   */
  async countLike(commentId) {
    try {
      return await _db.collection('like').where({
        'super._id': commentId
      }).get().then(res => res.data[0].like.length)
    } catch (err) {
      return 0
    }
  }

}