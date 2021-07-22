import { db } from "./database"
const util = require('../util')

const _db = wx.cloud.database()
const cmd = _db.command

export class Like {
  /**
   * 绑定新的点赞
   * @param {string} superId 
   * @param {string} superType 
   * @param {object} super_super 只有属于comment的点赞才需要，其他一概填null
   */
  async bindNewLike(superId, superType, super_super) {
    return await _db.collection('like').add({
      data: {
        super: {
          _id: superId,
          type: superType,
          super: super_super
        },
        like: []
      }
    })
  }

  /**
   * 点赞 对于赞的父类不限制
   * @param {string} superId 
   */
  async giveALike(superId) {
    if (!db.perControl.limitTimeStrategy('giveALike', 200))
      return db.perControl.refusePromise()
    let openid = getApp().globalData.openid
    if (openid == null) {
      console.error('点赞的openid为null')
    } else {
      return await _db.collection('like').where({
        "super._id": superId
      }).update({
        data: {
          like: cmd.addToSet(openid)
        }
      })
    }
  }

  /**
   * 取消点赞 对于赞的父类不限制
   * @param {string} superId 
   */
  async cancelLike(superId) {
    if (!db.perControl.limitTimeStrategy('cancelLike', 200))
      return db.perControl.refusePromise()
    return await _db.collection('like').where({
      "super._id": superId
    }).update({
      data: {
        like: cmd.pull(getApp().globalData.openid)
      }
    })
  }

  /**
   * 获取是否点赞和计数数组
   * @param {Array} superArray 
   */
  async getIsAndCountLike(superArray) {
    return await wx.cloud.callFunction({
      name: 'getIsAndCountLikeArray',
      data: {
        commentArray: Array.from(new Set(superArray))
      }
    }).catch(err => [])
  }

  /**
   * 判断是否已经点赞
   * @param {string} superId 
   */
  async isLike(superId) {
    return await _db.collection('like').where({
      'super._id': superId
    }).get().then(res => res.data[0].like.indexOf(getApp().globalData.openid) != -1).catch(err => false)
  }

  /**
   * 获取点赞个数
   * @param {string} superId 
   */
  async countLike(superId) {
    try {
      return await _db.collection('like').where({
        'super._id': superId
      }).get().then(res => res.data[0].like.length)
    } catch (err) {
      return 0
    }
  }

}