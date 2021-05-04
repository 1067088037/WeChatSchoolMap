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
   * @param {string} id 校区ID
   */
  async getArch(id) {
    try {
      return this.getArchList(id)
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
   * 添加建筑物
   * @param {string} campusId 校区ID
   * @param {object} arch 建筑物
   */
  async addArch(campusId, arch) {
    let archId = util.randomId()
    return await db.comment.bindNewCommentList(archId, 'arch')
      .then(async res => { //res是commit-list的ID
        await _db.collection('arch').add({
          data: {
            _id: archId,
            super: {
              _id: campusId,
              type: 'campus'
            },
            name: arch.name,
            logo: arch.logo,
            type: arch.type,
            commit: res,
            geo: arch.geo
          }
        }).then(async res => {
          this.getArchList(campusId).then(async listId =>{
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
  }
}