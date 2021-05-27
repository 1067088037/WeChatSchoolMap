import { db } from './database'

const _db = wx.cloud.database()
const util = require('../util')

export class Arch {
  /**
   * 获取全部建筑物信息
   * @param {string} campusId 校区ID
   */
  async getArchArray(campusId) {
    let serverTime = new Date(getApp().globalData.campus.archLastUpdateTime).getTime()
    let archStorage = wx.getStorageSync(campusId)
    if (archStorage.lastUpdateTime >= serverTime) {
      return new Promise((resolve, reject) => {
        console.log('建筑物从本地缓存载入')
        resolve(archStorage.archs)
      })
    } else {
      console.log('本地建筑物数据不是最新的，从服务器载入建筑物信息')
      return await wx.cloud.callFunction({
        name: 'getAllBySuperId',
        data: {
          collection: 'arch',
          superId: campusId
        }
      }).then(res => {
        wx.setStorage({
          key: campusId,
          data: {
            desc: '校区的建筑物缓存',
            lastUpdateTime: new Date().getTime(),
            archs: res.result.data
          }
        })
        return res.result.data
      }).catch(err => [])
    }
  }

  /**
   * 刷新最后一次更新建筑物的世界
   * @param {string} campusId 校区ID
   */
  async refreshArchLastUpdateTime(campusId) {
    console.log(campusId)
    return _db.collection('campus').doc(campusId).update({
      data: {
        archLastUpdateTime: new Date()
      }
    })
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
      await this.refreshArchLastUpdateTime(campusId)
      return _db.collection('arch').add({
        data: {
          super: {
            _id: campusId,
            type: 'campus'
          },
          name: arch.name,
          logo: arch.logo,
          images: arch.images,
          type: arch.type,
          geo: arch.geo,
          text: arch.text,
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
      _db.collection('arch').doc(archId).get().then(res => {
        this.refreshArchLastUpdateTime(res.data.super._id)
      })
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
      _db.collection('arch').where({
        markId: markId
      }).get().then(res => {
        this.refreshArchLastUpdateTime(res.data.super._id)
      })
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
    _db.collection('arch').doc(archId).get().then(res => {
      this.refreshArchLastUpdateTime(res.data.super._id)
    })
    await _db.collection('arch').doc(archId).remove()
    await _db.collection('strategy').where({ 'super._id': archId }).remove()
    return db.comment.removeAllComment(archId)
  }

  /**
   * 删除指定建筑物
   * @param {string} markId 建筑物标注ID
   */
  async removeArchByMarkId(markId) {
    _db.collection('arch').where({
      markId: markId
    }).get().then(res => {
      this.refreshArchLastUpdateTime(res.data.super._id)
    })
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