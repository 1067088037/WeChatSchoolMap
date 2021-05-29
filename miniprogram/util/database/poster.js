import { db } from './database'

const _db = wx.cloud.database()
const cmd = _db.command
const util = require('../util')

export class Poster {
  /**
   * 添加海报的关注
   * @param {String} openid 
   * @param {String} posterId 
   */
  async addAttention(openid, posterId) {
    if (!db.perControl.limitTimeStrategy('addAttention', 1000))
      return db.perControl.refusePromise()
    await db.attention.checkInit(openid)
    return await _db.collection('attention').where({
      _id: openid,
      _openid: '{openid}'
    }).update({
      data: {
        poster: cmd.addToSet(posterId)
      }
    })
  }

  /**
   * 删除海报的关注
   * @param {string} openid 
   * @param {string} posterId 
   */
  async removeAttention(openid, posterId) {
    if (!db.perControl.limitTimeStrategy('removeAttention', 1000))
      return db.perControl.refusePromise()
    await db.attention.checkInit(openid)
    return await _db.collection('attention').where({
      _id: openid,
      _openid: '{openid}'
    }).update({
      data: {
        poster: cmd.pull(posterId)
      }
    })
  }

  /**
   * 获取关注的海报
   * @param {string} openid 
   */
  async getAttention(openid) {
    await db.attention.checkInit(openid)
    return await _db.collection('attention').doc(openid).get().then(res => res.data.poster)
  }

  /**
   * 获取校区的海报
   * @param {string} campusId 
   */
  async getPosterByCampusId(campusId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'poster',
        superId: campusId
      }
    }).then(res => res.result).catch(err => [])
  }

  /**
   * 通过openid查询该用户创建的海报
   * @param {string} openid 
   */
  async getPosterByOpenid(openid) {
    return await _db.collection('poster').where({
      sender: openid
    }).get().then(res => res.data)
  }

  /**
   * 通过海报ID获取海报
   * @param {string} posterId 
   */
  async getPosterById(posterId) {
    return await _db.collection('poster').doc(posterId).get().then(res => res.data)
  }

  /**
   * 新建海报
   * @param {string} campusId 
   * @param {object} poster 包含sender，name，desc，images 不需要传入sendTime
   */
  async addPoster(campusId, poster) {
    if (!db.perControl.limitTimeStrategy('addPoster', 20000, '上传太频繁了\n休息一下吧'))
      return db.perControl.refusePromise()
    let res = await _db.collection('poster').where({
      _openid: '{openid}'
    }).count()
    if (db.perControl.thisPermission >= 48 || res.total < 5) {
      if (poster.sender.constructor != String) {
        console.error('sender类型非法')
      } else if (poster.name.constructor != String) {
        console.error('name类型非法')
      } else if (poster.desc.constructor != String) {
        console.error('desc类型非法')
      } else if (poster.images.constructor != Array) {
        console.error('images类型非法')
      } else {
        let posterId = util.randomId()
        _db.collection('poster').add({
          data: {
            _id: posterId,
            super: {
              _id: campusId,
              type: 'campus'
            },
            sender: poster.sender,
            sendTime: _db.serverDate(),
            name: poster.name,
            desc: poster.desc,
            images: poster.images
          }
        })
        return db.like.bindNewLike(posterId, 'poster', null)
      }
    } else {
      wx.showToast({
        title: '权限不足或创建的海报数量已达上限',
      })
      return db.perControl.refusePromise()
    }
  }

  /**
   * 删除指定海报
   * @param {string} posterId 
   */
  async removePoster(posterId) {
    if (!db.perControl.limitTimeStrategy('removePoster', 1000, '删除得太频繁\n休息一下吧'))
      return db.perControl.refusePromise()
    await _db.collection('like').where({
      'super._id': posterId,
      _openid: '{openid}'
    }).remove()
    await db.comment.removeAllComment(posterId)
    await _db.collection('poster').doc(posterId).get().then(res => {
      console.log("delete: ", res.data.images)
      wx.cloud.deleteFile({
        fileList: res.data.images
      })
    })
    return _db.collection('poster').where({
      _id: posterId,
      _openid: '{openid}'
    }).remove()
  }

  /**
   * 更新海报
   * @param {string} posterId 
   * @param {object} poster 
   */
  async updatePoster(posterId, poster) {
    if (!db.perControl.limitTimeStrategy('updatePoster', 1000, '更新得太频繁\n休息一下吧'))
      return db.perControl.refusePromise()
    if (poster.constructor != Object) {
      console.error('poster类型非法')
    } else {
      poster._id = undefined
      return await _db.collection('poster').where({
        _id: posterId,
        _openid: '{openid}'
      }).update({
        data: poster
      })
    }
  }
}