import { db } from './database'

const _db = wx.cloud.database()
const util = require('../util')

export class Arch {
  /**
   * 获取全部建筑物信息
   * @param {string} campusId 校区ID
   * @returns {Array} 建筑物数组 
   */
  async getArchArray(campusId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'arch',
        superId: campusId
      }
    }).then(res => res.result.data).catch(err => [])
  }

  /**
   * 添加建筑物
   * @param {string} campusId 校区ID
   * @param {object} arch 建筑物
   */
  async addArch(campusId, arch) {
    if (arch.constructor != Object) {
      console.error('arch类型非法')
    } else {
      return _db.collection('arch').add({
        data: {
          super: {
            _id: campusId,
            type: 'campus'
          },
          name: arch.name,
          logo: arch.logo,
          type: arch.type,
          geo: arch.geo,
          markId: util.randomNumberId()
        }
      })
    }
  }

  /**
   * 更新建筑物
   * @param {string} archId 
   * @param {object} arch 
   */
  updateArchById(archId, arch) {
    if (arch.constructor != Object) {
      console.error('arch类型非法')
    } else {
      // console.log(arch)
      return _db.collection('arch').doc(archId).update({
        data: arch
      })
    }
  }

  /**
   * 更新建筑物
   * @param {string} markId 
   * @param {object} arch 
   */
  updateArchByMarkId(markId, arch) {
    if (arch.constructor != Object) {
      console.error('arch类型非法')
    } else {
      return _db.collection('arch').where({
        markId: markId
      }).update({
        data: arch
      })
    }
  }

  /**
   * 删除指定建筑物
   * @param {string} archId 建筑物ID
   */
  async removeArchById(archId) {
    await _db.collection('arch').doc(archId).remove()
    await _db.collection('strategy').where({ 'super._id': archId }).remove()
    return db.comment.removeAllComment(archId)
  }

  /**
   * 删除指定建筑物
   * @param {string} markId 建筑物标注ID
   */
  async removeArchByMarkId(markId) {
    return await _db.collection('arch').where({
      markId: markId
    }).get().then(async res => {
      res.data.forEach(async e => {
        await _db.collection('arch').doc(e._id).remove()
        await _db.collection('strategy').where({ 'super._id': e._id }).remove()
        await _db.comment.removeAllComment(e._id)
      })
    })
  }
}