import { db } from './database'

const _db = wx.cloud.database()
const cmd = _db.command
const util = require('../util')

export class Poster {
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
   * 通过海报ID查询海报
   * @param {string} posterId 
   */
  async getPosterById(posterId) {
    return await _db.collection('poster').doc(posterId).get().then(res => {
      res.data
    })
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
    return await _db.collection('poster').doc(posterId).remove()
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
      return await _db.collection('poster').doc(posterId).update({
        data: poster
      })
    }
  }
}