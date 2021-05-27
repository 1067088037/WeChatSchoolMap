import { db } from './database'

const _db = wx.cloud.database()
const util = require('../util')

const dateConstructor = new Date('2020-1-1').constructor

export class Point {
  /**
   * 通过openid获取标点
   * @param {string} openid 
   */
  async getPointByOpenid(openid) {
    return await wx.cloud.callFunction({
      name: 'getPointByOpenid',
      data: {
        _openid: openid
      }
    }).then(res => res.result.data)
  }

  /**
   * 获取校区下全部的标点
   * @param {string} campusId
   * @returns {Array} 标点数组
   */
  async getPointArray(campusId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'point',
        superId: campusId
      }
    }).then(res => res.result.data).catch(err => [])
  }

  /**
   * 新建标点
   * @param {string} campusId 
   * @param {Array} belong 
   * @param {String} type 合法值：current实时，activity活动
   * @param {Object} time 
   * @param {Object} desc 
   * @param {DB.IGeoJSONPoint} geo 
   * @param {Array} tag 标签数组
   */
  addPoint(campusId, belong, type, time, desc, geo, tag) {
    if (belong.constructor != Array) {
      console.error('belong类型非法，如果为空请传入[]')
    } else if (type.constructor != String) {
      console.error('type类型非法')
    } else if (type != 'current' && type != 'activity') {
      console.error('type值非法')
    } else if (time.constructor != Object) {
      console.error('time类型非法')
    } else if (desc.constructor != Object) {
      console.error('desc类型非法')
    } else if (geo.constructor != _db.Geo.Point(0, 0).constructor) {
      console.error("geo类型非法")
    } else if (tag.constructor != Array) {
      console.error('tag类型非法')
    } else {
      return _db.collection('point').add({
        data: {
          super: {
            _id: campusId,
            type: 'campus'
          },
          belong: belong,
          time: time,
          desc: desc,
          geo: geo,
          markId: util.randomNumberId(),
          type: type,
          tag: tag
        }
      })
    }
  }

  /**
   * 生成时间对象
   * @param {Date} show 标点开始展示的时间
   * @param {Date} start 活动开始的时间
   * @param {Date} end 活动结束的时间
   * @param {Date} hide 标点结束展示的时间
   */
  generateTimeObj(show, start, end, hide) {
    if (show.constructor != dateConstructor) {
      console.error('show类型非法')
    } else if (start.constructor != dateConstructor) {
      console.error('start类型非法')
    } else if (end.constructor != dateConstructor) {
      console.error('end类型非法')
    } else if (hide.constructor != dateConstructor) {
      console.error('hide类型非法')
    } else {
      return {
        show: show,
        start: start,
        end: end,
        hide: hide
      }
    }
  }

  /**
   * 生成描述对象
   * @param {string} name
   * @param {string} text 
   * @param {string} icon 
   * @param {Array} images 
   */
  generateDescObj(name, text, icon, images) {
    if (name.constructor != String) {
      console.error('name类型类型')
    } else if (text.constructor != String) {
      console.error('text类型非法')
    } else if (icon.constructor != String) {
      console.error('icon类型非法')
    } else if (images.constructor != Array) {
      console.error('images类型非法')
    } else {
      return {
        name: name,
        text: text,
        icon: icon,
        images: images
      }
    }
  }

  /**
   * 删除指定标点
   * @param {string} pointId 数据库中ID
   */
  async removePointById(pointId) {
    await _db.collection('point').doc(pointId).get().then(res => {
      wx.cloud.deleteFile({
        fileList: res.data.desc.images
      })
    })
    await _db.collection('point').doc(pointId).remove()
    return db.comment.removeAllComment([pointId])
  }

  /**
   * 删除指定标点
   * @param {string} markId 标注ID
   */
  async removePointByMarkId(markId) {
    return _db.collection('point').where({
      markId: markId
    }).get().then(res => {
      res.data.forEach(async e => {
        await _db.collection('point').doc(e._id).get().then(res => {
          wx.cloud.deleteFile({
            fileList: res.data.desc.images
          })
        })
        _db.collection('point').doc(e._id).remove()
        _db.comment.removeAllComment(e._id)
      })
    })
  }

  /**
   * 更新标点
   * @param {string} pointId 标点ID
   * @param {object} data 要更新的内容
   */
  updatePointById(pointId, data) {
    return _db.collection('point').doc(pointId).update({
      data: data
    })
  }

  /**
   * 更新标点
   * @param {string} markId 标点标注ID
   * @param {object} data 要更新的内容
   */
  updatePointByMarkId(markId, data) {
    return _db.collection('point').where({
      markId: markId
    }).update({
      data: data
    })
  }
}