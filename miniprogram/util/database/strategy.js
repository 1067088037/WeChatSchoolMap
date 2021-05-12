import { db } from "./database"

const _db = wx.cloud.database()
const cmd = _db.command
const util = require('../util')

export class Strategy {
  /**
   * 添加攻略 仅仅用于首次添加
   * @param {string} campusId 校区ID
   * @param {object} strategy 策略 包括name，content; time会自动生成
   * content是Array，数组中每个对象包括name，楼层，位置，描述和图像数组
   * time是Object，包含首次创建时间fisrtCreate和最后修改时间lastEdit
   */
  async addStrategy(campusId, strategy) {
    if (strategy.constructor != Object) {
      console.error('strategy类型非法')
    } else if (strategy.name.constructor != String) {
      console.error('name类型非法，需要String')
    } else if (strategy.content.constructor != Array) {
      console.error('content类型非法，需要Array')
    } else {
      let _id = util.randomId()
      await db.like.bindNewLike(_id, 'strategy', null)
      return _db.collection('strategy').add({
        data: {
          _id: _id,
          super: {
            _id: campusId,
            type: 'campus'
          },
          version: {
            editVersion: 1,
            createTime: _db.serverDate(),
            lastEditTime: _db.serverDate()
          },
          publish: {
            name: strategy.name,
            desc: strategy.desc,
            content: strategy.content,
          },
          draft: {
            name: strategy.name,
            desc: strategy.desc,
            content: strategy.content,
          }
        }
      })
    }
  }

  /**
   * 获取攻略
   * @param {string} strategyId 攻略ID
   */
  async getStrategy(strategyId) {
    return await _db.collection('strategy').doc(strategyId).get().then(res => {
      return res.data
    })
  }

  /**
   * 获取校区内全部攻略的简要信息，不包含详情
   * @param {string} campusId 
   */
  async getBriefStrategyArray(campusId) {
    return wx.cloud.callFunction({
      name: 'getBriefStrategy',
      data: {
        superId: campusId
      }
    }).then(res => res.result.data)
  }

  /**
   * 删除指定攻略
   * @param {string} strategyId 
   */
  async removeStrategy(strategyId) {
    await _db.collection('strategy').doc(strategyId).remove()
    return db.comment.removeAllComment(strategyId)
  }

  /**
   * 更新草稿攻略
   * @param {string} strategyId 
   * @param {object} data 
   */
  updateDraftStrategy(strategyId, draft) {
    return _db.collection('strategy').doc(strategyId).update({
      data: {
        "version.editVersion": cmd.inc(1),
        "version.lastEditTime": _db.serverDate(),
        draft: draft
      }
    })
  }

  /**
   * 将草稿内容发布
   * @param {string} strategyId 
   */
  async publishFromDraft(strategyId) {
    const res = await _db.collection('strategy').doc(strategyId).get()
    return _db.collection('strategy').doc(strategyId).update({
      data: {
        publish: res.data.draft
      }
    })
  }

}