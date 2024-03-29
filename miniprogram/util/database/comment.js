import { db } from './database'

const _db = wx.cloud.database()
const util = require('../util')

export class Comment {
  /**
   * 获取属于该父级的所有评论
   * @param {string} superId 父级ID
   * @returns {Array} 评论数组
   */
  async getAllComment(superId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'comment',
        superId: superId
      }
    }).then(res => res.result.data).catch(err => [])
  }

  /**
   * 删除以superId为父级的所有评论
   * @param {string} superId 父级id
   */
  async removeAllComment(superId) {
    return await wx.cloud.callFunction({
      name: 'removeAllComment',
      data: {
        superId: superId
      }
    })
  }

  /**
   * 插入评论
   * @param {string} superId 
   * @param {string} superType 
   * @param {object} comment 需要包含 reply,text,images
   */
  async addComment(superId, superType, comment) {
    if (!db.perControl.limitTimeStrategy('addComment', 6000))
      return db.perControl.refusePromise()
    let commentId = util.randomId()
    if (comment.constructor != Object) {
      console.error("comment类型非法")
    } else {
      await _db.collection('comment').add({
        data: {
          _id: commentId,
          super: {
            _id: superId,
            type: superType
          },
          time: _db.serverDate(),
          reply: comment.reply,
          text: comment.text,
          images: comment.images
        }
      })
      return db.like.bindNewLike(commentId, 'comment', { _id: superId, type: superType })
    }
  }

  /**
   * 删除指定ID的评论
   * @param {string} commentId 
   */
  async removeComment(commentId) {
    
    if (!db.perControl.limitTimeStrategy('removeComment', 1000))
      return db.perControl.refusePromise()
    await _db.collection('comment').doc(commentId).get().then(res => {
      wx.cloud.deleteFile({
        fileList: res.data.images
      })
    })
    await _db.collection('comment').where({
      _id: commentId,
      _openid: '{openid}'
    }).remove()
    return _db.collection('like').where({
      'super._id': commentId,
      _openid: '{openid}'
    }).remove()
  }
}