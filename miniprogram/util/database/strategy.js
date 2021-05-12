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
  addStrategy(campusId, strategy) {
    if (strategy.constructor != Object) {
      console.error('strategy类型非法')
    } else if (strategy.name.constructor != String) {
      console.error('name类型非法，需要String')
    } else if (strategy.content.constructor != Array) {
      console.error('content类型非法，需要Array')
    } else {
      let _id = util.randomId()
      return _db.collection('strategy').add({
        data: {
          _id: _id,
          super: {
            _id: campusId,
            type: 'campus'
          },
<<<<<<< HEAD
          version: {
            editVersion: 1,
            createTime: _db.serverDate(),
            lastEditTime: _db.serverDate()
          },
          publish: {
            name: strategy.name,
            content: strategy.content,
          },
          draft: {
            name: strategy.name,
            content: strategy.content,
          }
=======
          name: strategy.name,
          content: strategy.content,
          time: strategy.time
>>>>>>> dev
        }
      })
    }
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