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
   * @param {boolean} getHiden 是否显示隐藏的标点
   * @returns {Array} 标点数组
   */
  async getPointArray(campusId, getHiden = false) {
    return await wx.cloud.callFunction({
      name: 'getPointByCampusId',
      data: {
        campusId: campusId,
        getHiden: getHiden
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
  async addPoint(campusId, belong, type, time, desc, geo, tag) {
    if (!db.perControl.limitTimeStrategy('addPoint', 20000, '添加标点得太快了\n休息一下吧'))
      return db.perControl.refusePromise()
    let res = await _db.collection('point').where({
      _openid: '{openid}'
    }).count()
    const allAllowPer = 48
    const maxPoint = 10
    if (db.perControl.thisPermission < allAllowPer && res.total >= maxPoint) {
      wx.showModal({
        title: '添加标点失败',
        content: `您已经添加了${res.total}个标点，达到了上限。您可以删除部分标点或提高权限以继续添加标点。`,
        showCancel: false
      })
      return db.perControl.refusePromise()
    } else {
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
    if (!db.perControl.limitTimeStrategy('removePointById', 1000, '删除得太快了\n休息一下吧'))
      return db.perControl.refusePromise()
    await _db.collection('point').doc(pointId).get().then(res => {
      wx.cloud.deleteFile({
        fileList: res.data.desc.images
      })
    })
    await _db.collection('point').where({
      _id: pointId,
      _openid: '{openid}'
    }).remove()
    return db.comment.removeAllComment([pointId])
  }

  /**
   * 删除指定标点
   * @param {string} markId 标注ID
   */
  async removePointByMarkId(markId) {
    console.error('没用过这个函数呢！')
    // console.warn('TODO:调用处没有修改')
    // if (!db.perControl.limitTimeStrategy('removePointByMarkId', 2000))
    //   return db.perControl.refusePromise()
    // return _db.collection('point').where({
    //   markId: markId
    // }).get().then(res => {
    //   res.data.forEach(async e => {
    //     await _db.collection('point').doc(e._id).get().then(res => {
    //       wx.cloud.deleteFile({
    //         fileList: res.data.desc.images
    //       })
    //     })
    //     _db.collection('point').where({
    //       _id: e._id,
    //       _openid: '{openid}'
    //     }).remove()
    //     _db.comment.removeAllComment(e._id)
    //   })
    // })
  }

  /**
   * 更新标点
   * @param {string} pointId 标点ID
   * @param {object} data 要更新的内容
   */
  updatePointById(pointId, data) {
    return _db.collection('point').where({
      _id: pointId,
      _openid: '{openid}'
    }).update({
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
      markId: markId,
      _openid: '{openid}'
    }).update({
      data: data
    })
  }
}