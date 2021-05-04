import { db } from "./database"

const _db = wx.cloud.database()
const util = require('../util')

export class Arch {
  /**
   * 通过校区ID获取建筑物列表
   * @param {string} campusId 
   */
  async getArchList(campusId) {
    return await db.campus.getCampus(campusId).then(res => res.geo.arch)
  }

  /**
   * 通过ID获取建筑物数组
   * @param {string} campusId 校区ID
   */
  async getArchIdArray(campusId) {
    try {
      return this.getArchList(campusId)
        .then(async listId => {
          // console.log(listId)
          return await wx.cloud.callFunction({
            name: 'getItem',
            data: {
              collection: 'arch-list',
              docid: listId,
              item: 'list'
            }
          }).then(async res => {
            return res.result
          })
        })
    } catch (e) {
      return null
    }
  }

  /**
   * 获取全部建筑物信息
   * @param {string} campusId 校区ID
   */
  async getArchArray(campusId) {
    try {
      return await this.getArchList(campusId).then(async archListId => {
        console.log(archListId)
        return await wx.cloud.callFunction({
          name: 'getAllArch',
          data: {
            archListId: archListId
          }
        }).then(res => { return res.result })
      })
    } catch (err) {
      return err
    }
  }

  /**
   * 添加建筑物
   * @param {string} campusId 校区ID
   * @param {object} arch 建筑物
   */
  async addArch(campusId, arch) {
    let archId = util.randomId()
    return await db.comment.bindNewCommentList(archId, 'arch')
      .then(async res => { //res是commit-list的ID
        await this.getArchList(campusId).then(async archListId => {
          console.log(archListId)
          await _db.collection('arch').add({
            data: {
              _id: archId,
              super: {
                _id: archListId,
                type: 'arch-list'
              },
              name: arch.name,
              logo: arch.logo,
              type: arch.type,
              comment: res,
              geo: arch.geo
            }
          }).then(async res => {
            this.getArchList(campusId).then(async listId => {
              try {
                return await wx.cloud.callFunction({
                  name: 'addInArray',
                  data: {
                    collection: 'arch-list',
                    docid: listId,
                    array: 'list',
                    push: res._id
                  }
                })
              } catch (e) {
                return null
              }
            })
          })
        })
      })
  }

  /**
   * 删除指定建筑物
   * @param {string} archId 
   */
  removeArch(archId) {
    db.comment.removeAllComment(archId)
    try {
      _db.collection('arch').doc(archId).get().then(arch => {
        // console.log("archid = " + archId)
        // console.log(arch)
        wx.cloud.callFunction({
          name: 'removeInArray',
          data: {
            collection: 'arch-list',
            docid: arch.data.super._id,
            array: 'list',
            remove: archId
          }
        })
        _db.collection('arch').doc(archId).remove()
      })
    } catch (e) { }
  }
}