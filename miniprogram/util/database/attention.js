import { db } from "./database"

const _db = wx.cloud.database()
const cmd = _db.command

var hasInit = []

export class Attention {
  /**
   * 添加关注
   * @param {string} openid 
   * @param {Array} value 
   * @param {number} month 
   * @param {number} week 
   */
  async addAttention(openid, value, month, week) {
    if (!db.perControl.limitTimeStrategy('addAttention', 1500, '添加得太频繁了\n休息一下吧'))
      return db.perControl.refusePromise()
    if (value.constructor != Array) {
      console.error('value类型非法')
    } else {
      await this.checkInit(openid)
      return await _db.collection('attention').where({
        _id: openid,
        _openid: '{openid}'
      }).update({
        data: {
          attention: cmd.addToSet({
            each: [{
              value: value,
              month: month,
              week: week
            }]
          })
        }
      })
    }
  }

  /**
   * 更新全部关注内容，注意：调用该方法是替换全部内容
   * @param {string} openid 
   * @param {Array} attentionArray 
   */
  async updateAttention(openid, attentionArray) {
    console.warn('TODO:调用处没有修改')
    if (!db.perControl.limitTimeStrategy('updateAttention', 2000))
      return db.perControl.refusePromise()
    await this.checkInit(openid)
    _db.collection('attention').where({
      _id: openid,
      _openid: '{openid}'
    }).update({
      data: {
        attention: attentionArray
      }
    })
  }

  /**
   * 删除指定的关注内容
   * @param {string} openid 
   * @param {Object} attention 
   */
  async removeAttention(openid, attention) {
    if (!db.perControl.limitTimeStrategy('removeAttention', 200, '取消关注得太快了\n休息一下吧'))
      return db.perControl.refusePromise()
    if (attention.constructor != Object) {
      console.error('attention类型非法')
    } else {
      await this.checkInit(openid)
      return _db.collection('attention').where({
        _id: openid,
        _openid: '{openid}'
      }).update({
        data: {
          attention: cmd.pull(attention)
        }
      })
    }
  }

  /**
   * 获取关注的信息
   * @param openid 
   */
  async getAttention(openid) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).get().then(res => res.data)
  }

  /**
   * 检查是否初始化 前端人员请勿调用
   * @param openid 
   */
  async checkInit(openid) {
    if (hasInit.indexOf(openid) != -1) {
      return true
    } else {
      hasInit.push(openid)
      return await _db.collection('attention').where({
        _id: openid,
        _openid: '{openid}'
      }).count().then(async res => {
        if (res.total == 0) await _db.collection('attention').add({
          data: {
            _id: openid,
            attention: [],
            poster: []
          }
        })
      })
    }
  }
}