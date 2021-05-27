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
    await db.attention.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
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
    await db.attention.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
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
   * 获取全校的海报
   * @param {string} schoolId 
   */
  async getPosterBySchoolId(schoolId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'poster',
        superId: schoolId
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
   * @param {string} schoolId 
   * @param {object} poster 包含sender，name，desc，images 不需要传入sendTime
   */
  async addPoster(schoolId, poster) {
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
            _id: schoolId,
            type: 'school'
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
  }

  /**
   * 删除指定海报
   * @param {string} posterId 
   */
  async removePoster(posterId) {
    await _db.collection('like').where({
      'super._id': posterId
    }).remove()
    await db.comment.removeAllComment(posterId)
    await _db.collection('poster').doc(posterId).get().then(res => {
      console.log("delete: ", res.data.images)
      wx.cloud.deleteFile({
        fileList: res.data.images
      })
    })
    await _db.collection('poster').doc(posterId).remove()
  }

  /**
   * 更新海报
   * @param {string} posterId 
   * @param {object} poster 
   */
  async updatePoster(posterId, poster) {
    if (poster.constructor != Object) {
      console.error('poster类型非法')
    } else {
      poster._id = undefined
      return await _db.collection('poster').doc(posterId).update({
        data: poster
      })
    }
  }
}